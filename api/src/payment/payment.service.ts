import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus, UserRole } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePaymentDto, requestUserId?: number) {
    const userId = requestUserId;
    if (!userId) throw new BadRequestException('Foydalanuvchi aniqlanmadi');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');

    const membership = await this.prisma.membership.findUnique({ where: { id: dto.membershipId } });
    if (!membership) throw new NotFoundException('A\'zolik turi topilmadi');

    const method = dto.method ?? 'CARD';
    const amount = Number(membership.price);

    return await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId,
          membershipId: membership.id,
          method: method as any,
          amount,
          status: PaymentStatus.PENDING,
          paidAt: null,
        },
      });

      return { message: "To'lov so'rovi yaratildi. Admin tasdiqlashini kuting.", status: payment.status };
    });
  }

  /** Current user's own payments */
  async findMine(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: { membership: true },
      }),
      this.prisma.payment.count({ where: { userId } }),
    ]);
    return { data, total };
  }

  async findAll(page = 1, limit = 20, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: 'desc' },
        include: { user: true, membership: true },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        membership: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        paidAt: dto.status === PaymentStatus.SUCCESS ? new Date() : undefined,
      },
      include: { membership: true },
    });

    // When admin confirms (SUCCESS) — create Member record if not exists
    if (dto.status === PaymentStatus.SUCCESS) {
      const existing = await this.prisma.member.findFirst({
        where: { userId: payment.userId, membershipId: payment.membershipId },
        orderBy: { id: 'desc' },
      });

      const membership = updated.membership;
      if (membership && (!existing || existing.status !== 'ACTIVE')) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + membership.durationDays);
        await this.prisma.member.create({
          data: {
            userId: payment.userId,
            membershipId: payment.membershipId,
            startDate: new Date(),
            endDate,
            status: 'ACTIVE',
            isPaid: true,
          },
        });
      }
    }

    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.payment.delete({
      where: { id },
    });
  }
}

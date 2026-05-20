import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) { }

  // create(dto: CreateMemberDto) {
  //   return this.prisma.member.create({
  //     data: {
  //       userId: dto.userId,
  //       membershipId: dto.membershipId,
  //       startDate: new Date(dto.startDate),
  //       endDate: new Date(dto.endDate),
  //       status: dto.status,
  //       isPaid: dto.isPaid ?? false
  //     },
  //   });
  // }

  /** Returns the most recent ACTIVE member for the given user, with membership data */
  async findByUser(userId: number) {
    const member = await this.prisma.member.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { id: 'desc' },
      include: { membership: true },
    });
    if (!member) throw new NotFoundException('Active member not found');
    return member;
  }

  async findAll(page = 1, limit = 20, search?: string, status?: string, membershipId?: number) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (membershipId) where.membershipId = membershipId;
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
      this.prisma.member.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: 'desc' },
        include: { user: true, membership: true },
      }),
      this.prisma.member.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        user: true,
        membership: true,
        memberState: true,
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(id: number, dto: UpdateMemberDto) {
    await this.findOne(id);

    return this.prisma.member.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.member.delete({
      where: { id },
    });
  }
}

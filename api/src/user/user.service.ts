import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImageOwnerType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) throw new BadRequestException("Bu telefon raqam allaqachon ro'yxatdan o'tgan");

    const hashedPass = await bcrypt.hash(dto.password, 7);
    return this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        password: hashedPass,
        role: 'ADMIN',
        isActive: true,
      },
    });
  }

  async addImage(data: { ownerId: number; ownerType: ImageOwnerType; filename: string; url: string }) {
    return this.prisma.image.create({ data });
  }

  async deleteImage(id: number) {
    return this.prisma.image.delete({ where: { id } });
  }

  async findAll(page = 1, limit = 20, search?: string, role?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, any> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }
    if (role) where.role = role as UserRole;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where: where as any,
        orderBy: { id: 'desc' },
      }),
      this.prisma.user.count({ where: where as any }),
    ]);

    return { data: users, total };
  }

  async findAllUser(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = { role: UserRole.USER };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take: limit, where, orderBy: { id: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { members: true, payments: true, bookHistory: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const images = await this.prisma.image.findMany({
      where: { ownerId: id, ownerType: ImageOwnerType.USER },
    });
    return { ...user, images };
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.firstName) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.phone) {
      const conflict = await this.prisma.user.findFirst({
        where: { phone: dto.phone, id: { not: id } },
      });
      if (conflict) throw new BadRequestException('Bu telefon raqam boshqa foydalanuvchida mavjud');
      data.phone = dto.phone;
    }
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 7);
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async statistic(id: number) {
    const user = await this.prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: { score: 'desc' },
      take: 10,
      select: { firstName: true, lastName: true, score: true, id: true },
    });
    const images = await this.prisma.image.findMany({
      where: { ownerType: ImageOwnerType.USER, ownerId: { in: user.map((b) => b.id) } },
    });

    const me = await this.prisma.user.findUnique({
      where: { id },
      select: { firstName: true, lastName: true, score: true, id: true, role: true },
    });
    const meImg = await this.prisma.image.findMany({ where: { ownerId: me?.id, ownerType: 'USER' } });

    if (!me || me.role !== UserRole.USER) throw new NotFoundException('User not found');

    const leaderScore = user[0].score ?? me.score;
    const higerCount = await this.prisma.user.count({ where: { role: 'USER', score: { gt: me.score } } });
    const myRank = higerCount + 1;
    const meInTop = user.some((u) => u.id === me.id);

    const imagesByUserId = images.reduce((acc, img) => {
      (acc[img.ownerId] ??= []).push(img);
      return acc;
    }, {} as Record<number, typeof images>);

    const leaderboard = user.map((u, index) => ({
      ...u,
      rank: index + 1,
      isMe: u.id === me.id,
      images: imagesByUserId[u.id] || [],
    }));
    if (!meInTop) leaderboard.push({ ...me, isMe: true, images: meImg, rank: myRank });

    return { leaderboard, rank: myRank, score: leaderScore - me.score };
  }
}

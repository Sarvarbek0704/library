import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) { }

  create(dto: CreateMembershipDto) {
    return this.prisma.membership.create({
      data: {
        ...dto,
      },
    });
  }

  findAll() {
    return this.prisma.membership.findMany({
      include: {
        members: true,
        payments: true,
      },
    });
  }

  async findOne(id: number) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
      include: {
        members: true,
        payments: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return membership;
  }

  async update(id: number, dto: UpdateMembershipDto) {
    await this.findOne(id);

    return this.prisma.membership.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.membership.delete({
      where: { id },
    });
  }
}

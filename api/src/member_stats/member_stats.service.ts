import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberStateDto } from './dto/create-member_stat.dto';
import { UpdateMemberStatDto } from './dto/update-member_stat.dto';
import { bookState } from '@prisma/client';

@Injectable()
export class MemberStateService {
  constructor(private readonly prisma: PrismaService) {}

  // create(dto: CreateMemberStateDto) {
  //   if(dto.status === bookState.RETURNED) throw new BadRequestException('Unable to create RETURNED status');
  //   return this.prisma.memberState.create({
  //     data: {
  //       memberId: dto.memberId,
  //       bookId: dto.bookId,
  //       startDate: new Date(dto.startDate),
  //       endDate: new Date(dto.endDate),
  //       status: dto.status,
  //     },
  //   });
  // }  alohida rout

  async findAll(page = 1, limit = 20, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { book: { title: { contains: search, mode: 'insensitive' } } },
        { member: { user: { firstName: { contains: search, mode: 'insensitive' } } } },
        { member: { user: { lastName: { contains: search, mode: 'insensitive' } } } },
        { member: { user: { phone: { contains: search } } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.memberState.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: 'desc' },
        include: {
          member: { include: { user: true } },
          book: { include: { author: true } },
        },
      }),
      this.prisma.memberState.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(id: number) {  
    const state = await this.prisma.memberState.findUnique({
      where: { id },
      include: {
        member: true,
        book: true,
      },
    });

    if (!state) {
      throw new NotFoundException('MemberState not found');
    }

    return state;
  }

async archive(id:number){  
  const member = await this.prisma.member.findMany({where:{userId:id}})
  const memberIds = member.map(m => m.id);
  const memberstate = await this.prisma.memberState.findMany({
    where:{
      status: 'RETURNED',
      memberId:{in:memberIds}
    }
  })
  return memberstate
}

  async current(id: number) {
    const members = await this.prisma.member.findMany({ where: { userId: id } });
    const memberIds = members.map(m => m.id);
    return this.prisma.memberState.findMany({
      where: {
        status: { in: [bookState.BOOKED, bookState.BORROWED, bookState.RETURNED] },
        memberId: { in: memberIds },
      },
      orderBy: { id: 'desc' },
      include: {
        book: {
          include: { author: true, category: true },
        },
      },
    });
  }

  async update(id: number, dto: UpdateMemberStatDto) {
    return this.prisma.$transaction(async (tx) => {
      const state = await tx.memberState.findUnique({
        where: { id },
        select: {
          status: true,
          book: { select: { pages: true, id:true } },
          member: { select: { userId: true } },
        },
      });

      if (!state) throw new NotFoundException('MemberState not found');

      const goingToReturned =
        state.status !== bookState.RETURNED &&
        dto.status === bookState.RETURNED;

      const updated = await tx.memberState.update({
        where: { id },
        data: {
          ...dto,
          ...(dto.startDate && { startDate: new Date(dto.startDate) }),
          ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        },
      });
      if (goingToReturned) {
        const pages = state.book.pages ?? 0;
        const addScore = Math.floor(pages / 50);

        if (addScore > 0) {
          await tx.user.update({
            where: { id: state.member.userId },
            data: { score: { increment: addScore } },
          });
        }

        // Restore book quantity and mark AVAILABLE if it was NOTAVAILABLE
        const book = await tx.book.findUnique({
          where: { id: state.book.id },
          select: { quantity: true, status: true },
        });
        if (book) {
          await tx.book.update({
            where: { id: state.book.id },
            data: {
              quantity: { increment: 1 },
              ...(book.status === 'NOTAVAILABLE' && { status: 'AVAILABLE' }),
            },
          });
        }
      }

      return updated;
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.memberState.delete({
      where: { id },
    });
  }
}

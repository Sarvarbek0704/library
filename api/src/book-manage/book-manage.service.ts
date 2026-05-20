import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookManageDto } from './dto/create-book-manage.dto';
import { bookState } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BookManageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async create(dto: CreateBookManageDto) {
    const member = await this.prisma.member.findUnique({
      where: { id: dto.memberId },
      include: { membership: true },
    });

    if (!member) throw new NotFoundException('Member not found');

    const now = Date.now();
    const membershipEnd = member.endDate?.getTime?.() ?? null;

    if (!membershipEnd) {
      throw new BadRequestException('Member endDate is missing');
    }

    if (now >= membershipEnd) {
      await this.prisma.member.update({
        where: { id: member.id },
        data: { status: 'NOTACTIVE' },
      });
      throw new ForbiddenException('Membership expired');
    }

    if (!member.isPaid) {
      throw new ForbiddenException('Membership is not paid');
    }

    // Prevent borrowing/booking the same book twice
    const alreadyHas = await this.prisma.memberState.findFirst({
      where: {
        memberId: dto.memberId,
        bookId: dto.bookId,
        status: { in: [bookState.BOOKED, bookState.BORROWED] },
      },
    });
    if (alreadyHas) {
      throw new BadRequestException('You already have this book');
    }

    let stateEndDate = new Date();

    if (dto.status === bookState.BORROWED) {
      const activeCountBorrowing = await this.prisma.memberState.count({
        where: { memberId: member.id, status: bookState.BORROWED },
      });
      if (activeCountBorrowing >= member.membership.limitBorrow) {
        throw new BadRequestException('Reached maximum borrow limit');
      }
      stateEndDate.setDate(stateEndDate.getDate() + 20);
      if (membershipEnd <= stateEndDate.getTime()) stateEndDate = new Date(membershipEnd);
    }

    if (dto.status === bookState.BOOKED) {
      const activeCountBooking = await this.prisma.memberState.count({
        where: { memberId: member.id, status: bookState.BOOKED },
      });
      if (activeCountBooking >= member.membership.limitBook) {
        throw new BadRequestException('Reached maximum booking limit');
      }
      stateEndDate.setDate(stateEndDate.getDate() + 1);
      if (membershipEnd <= stateEndDate.getTime()) stateEndDate = new Date(membershipEnd);
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: dto.bookId },
        select: { id: true, title: true, status: true, quantity: true },
      });

      if (!book) throw new NotFoundException('Book not found');

      if (book.status !== bookState.AVAILABLE) {
        throw new BadRequestException('Book is not available');
      }

      const newQuantity = book.quantity - Number(dto.quantity);

      if (newQuantity < 0) throw new BadRequestException('Requested quantity exceeds available copies');

      const updatedBook = await tx.book.update({
        where: { id: dto.bookId },
        data: {
          quantity: newQuantity,
          ...(newQuantity === 0 && { status: bookState.NOTAVAILABLE }),
        },
      });

      const state = await tx.memberState.create({
        data: {
          memberId: dto.memberId,
          bookId: dto.bookId,
          startDate: new Date(),
          endDate: stateEndDate,
          status: dto.status,
        },
      });

      return { updatedBook, state, bookTitle: book.title };
    });

    // Send notification after successful transaction
    const isBorrow = dto.status === bookState.BORROWED;
    this.notification.send(
      member.userId,
      isBorrow ? 'GENERAL' : 'GENERAL',
      isBorrow ? 'Kitob olindi' : 'Kitob band qilindi',
      isBorrow
        ? `"${result.bookTitle}" kitobini muvaffaqiyatli oldingiz. Qaytarish muddati: ${result.state.endDate.toLocaleDateString('uz-UZ')}.`
        : `"${result.bookTitle}" kitobini band qildingiz. 24 soat ichida olib keting!`,
    ).catch(() => {});

    return { updatedBook: result.updatedBook, state: result.state };
  }
}

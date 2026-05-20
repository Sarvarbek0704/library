import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { bookState } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { WaitlistService } from '../waitlist/waitlist.service';

@Injectable()
export class BookManageCron {
  private readonly logger = new Logger(BookManageCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
    private readonly waitlist: WaitlistService,
  ) {}

  // Every 30 minutes: expire overdue bookings
  @Cron('*/30 * * * *')
  async expireBookings() {
    const now = new Date();

    try {
      const expired = await this.prisma.memberState.findMany({
        where: {
          status: bookState.BOOKED,
          endDate: { lte: now },
        },
        select: { id: true, bookId: true },
        take: 500,
      });

      if (expired.length === 0) return;

      const stateIds = expired.map((x) => x.id);
      const bookIds = [...new Set(expired.map((x) => x.bookId))];

      await this.prisma.$transaction(async (tx) => {
        await tx.memberState.updateMany({
          where: { id: { in: stateIds }, status: bookState.BOOKED },
          data: { status: bookState.RETURNED },
        });

        for (const bookId of bookIds) {
          const expiredCount = expired.filter(x => x.bookId === bookId).length;
          const book = await tx.book.findUnique({
            where: { id: bookId },
            select: { quantity: true, status: true },
          });
          if (book) {
            const newQuantity = book.quantity + expiredCount;
            await tx.book.update({
              where: { id: bookId },
              data: {
                quantity: newQuantity,
                ...(book.status === bookState.NOTAVAILABLE && { status: bookState.AVAILABLE }),
              },
            });
          }
        }
      });

      // Notify next in waitlist for each freed book
      for (const bookId of bookIds) {
        this.waitlist.notifyNext(bookId).catch(() => {});
      }

      this.logger.log(`Expired bookings cleared: ${stateIds.length}, books freed: ${bookIds.length}`);
    } catch (e: any) {
      this.logger.error(`expireBookings failed: ${e?.message ?? e}`);
    }
  }

  // Every hour: mark expired memberships as NOTACTIVE
  @Cron('0 * * * *')
  async expireMemberships() {
    const now = new Date();

    try {
      const result = await this.prisma.member.updateMany({
        where: {
          status: 'ACTIVE',
          endDate: { lte: now },
        },
        data: { status: 'NOTACTIVE' },
      });

      if (result.count > 0) {
        this.logger.log(`Expired memberships: ${result.count}`);
      }
    } catch (e: any) {
      this.logger.error(`expireMemberships failed: ${e?.message ?? e}`);
    }
  }

  // Every day at 09:00: remind users with books due in 3 days
  @Cron('0 9 * * *')
  async sendBorrowReminders() {
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    try {
      const dueSoon = await this.prisma.memberState.findMany({
        where: {
          status: bookState.BORROWED,
          endDate: {
            gte: now,
            lte: in3Days,
          },
        },
        include: {
          member: { select: { userId: true } },
          book: { select: { title: true } },
        },
        take: 1000,
      });

      if (dueSoon.length === 0) return;

      let sent = 0;
      for (const state of dueSoon) {
        const daysLeft = Math.ceil((state.endDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        await this.notification.send(
          state.member.userId,
          'BORROW_REMINDER',
          'Qaytarish muddati yaqinlashmoqda',
          `"${state.book.title}" kitobini qaytarish muddati ${daysLeft} kunda tugaydi. O'z vaqtida qaytaring!`,
        ).catch(() => {});
        sent++;
      }

      this.logger.log(`Borrow reminders sent: ${sent}`);
    } catch (e: any) {
      this.logger.error(`sendBorrowReminders failed: ${e?.message ?? e}`);
    }
  }
}

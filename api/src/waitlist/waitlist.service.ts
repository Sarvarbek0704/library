import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async join(userId: number, dto: CreateWaitlistDto) {
    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');

    if (book.status === 'AVAILABLE' && book.quantity > 0) {
      throw new BadRequestException('Kitob hozir mavjud, to\'g\'ridan-to\'g\'ri olishingiz mumkin');
    }

    const existing = await this.prisma.waitlist.findUnique({
      where: { userId_bookId: { userId, bookId: dto.bookId } },
    });
    if (existing && existing.status === 'WAITING') {
      throw new BadRequestException('Siz allaqachon navbatdasiz');
    }

    const position = await this.prisma.waitlist.count({
      where: { bookId: dto.bookId, status: 'WAITING' },
    });

    const entry = await this.prisma.waitlist.upsert({
      where: { userId_bookId: { userId, bookId: dto.bookId } },
      update: { status: 'WAITING', notifiedAt: null },
      create: { userId, bookId: dto.bookId, status: 'WAITING' },
    });

    await this.notification.send(
      userId,
      'WAITLIST_READY',
      'Navbatga qo\'shildingiz',
      `"${book.title}" kitobiga navbatga qo\'shildingiz. Siz ${position + 1}-o\'rindasiz.`,
    );

    return { ...entry, position: position + 1 };
  }

  async leave(userId: number, bookId: number) {
    const entry = await this.prisma.waitlist.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    if (!entry) throw new NotFoundException('Navbatda emassiz');

    return this.prisma.waitlist.update({
      where: { userId_bookId: { userId, bookId } },
      data: { status: 'CANCELLED' },
    });
  }

  async findByBook(bookId: number) {
    return this.prisma.waitlist.findMany({
      where: { bookId, status: 'WAITING' },
      include: { user: { select: { id: true, firstName: true, lastName: true, phone: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findMine(userId: number) {
    return this.prisma.waitlist.findMany({
      where: { userId, status: 'WAITING' },
      include: { book: { select: { id: true, title: true, status: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Kitob bo'sh bo'lganda navbatdagi userni xabardor qilish
  async notifyNext(bookId: number) {
    const next = await this.prisma.waitlist.findFirst({
      where: { bookId, status: 'WAITING' },
      orderBy: { createdAt: 'asc' },
      include: { book: { select: { title: true } } },
    });
    if (!next) return;

    await this.prisma.waitlist.update({
      where: { id: next.id },
      data: { status: 'NOTIFIED', notifiedAt: new Date() },
    });

    await this.notification.send(
      next.userId,
      'WAITLIST_READY',
      'Kitob bo\'sh bo\'ldi!',
      `"${next.book.title}" kitob endi mavjud! Tezroq oling — 24 soat ichida band qilinmasa navbat o\'tib ketadi.`,
    );
  }
}

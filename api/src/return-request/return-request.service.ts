import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { bookState, Prisma, ReturnRequestStatus } from '@prisma/client';
import { PhoneReturnRequeestDto } from './dto/phone-return-request.dto';
import { NotificationService } from '../notification/notification.service';
import { WaitlistService } from '../waitlist/waitlist.service';

@Injectable()
export class ReturnRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
    private readonly waitlist: WaitlistService,
  ) {}

  async findAll(page = 1, limit = 20, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (search) {
      where.member = {
        user: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
          ],
        },
      };
    }

    const [requests, total] = await Promise.all([
      this.prisma.returnRequest.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          book: { select: { id: true, title: true } },
          member: {
            select: {
              id: true,
              user: { select: { firstName: true, phone: true } },
            },
          },
        },
      }),
      this.prisma.returnRequest.count({ where }),
    ]);

    const bookIds = requests.map(r => r.book.id);
    const images = await this.prisma.image.findMany({
      where: { ownerId: { in: bookIds }, ownerType: 'BOOK' },
    });
    const imageMap = new Map(images.map(img => [img.ownerId, img]));

    const data = requests.map(r => ({
      request: { id: r.id, status: r.status, note: r.note, createdAt: r.createdAt, decidedAt: r.decidedAt },
      user: r.member.user,
      book: { ...r.book, image: imageMap.get(r.book.id) ?? null },
      memberState: null,
    }));

    return { data, total };
  }

  async create(dto: CreateReturnRequestDto) {
    const existing = await this.prisma.returnRequest.findFirst({
      where: {
        memberId: dto.memberId,
        bookId: dto.bookId,
        status: ReturnRequestStatus.PENDING,
      },
    });
    if (existing) return existing;

    const book = await this.prisma.book.findFirst({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const isthereBook = await this.prisma.memberState.findFirst({
      where: {
        bookId: dto.bookId,
        memberId: dto.memberId,
        status: { in: [bookState.BORROWED, bookState.BOOKED] },
      },
    });
    if (!isthereBook) throw new BadRequestException('You do not have this book');

    try {
      return await this.prisma.returnRequest.create({
        data: { memberId: dto.memberId, bookId: dto.bookId },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Pending request already exists');
      }
      throw e;
    }
  }

  async findByPhone(dto: PhoneReturnRequeestDto) {
    const requests = await this.prisma.returnRequest.findMany({
      where: { member: { user: { phone: dto.phone } } },
      include: {
        book: { select: { id: true, title: true } },
        member: {
          select: {
            id: true,
            user: { select: { firstName: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const bookimg = requests.map((e) => e.book.id);
    const images = await this.prisma.image.findMany({
      where: { ownerId: { in: bookimg }, ownerType: 'BOOK' },
    });

    const imageMap = new Map<number, (typeof images)[number]>();
    for (const img of images) {
      imageMap.set(img.ownerId, img);
    }

    if (requests.length === 0) {
      const exists = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
        select: { id: true },
      });
      if (!exists) throw new NotFoundException('User not found');
      return [];
    }

    const pairMap = new Map<string, { memberId: number; bookId: number }>();
    for (const r of requests) {
      pairMap.set(`${r.memberId}:${r.bookId}`, { memberId: r.memberId, bookId: r.bookId });
    }
    const pairs = Array.from(pairMap.values());

    const states = await this.prisma.memberState.findMany({
      where: { OR: pairs },
      select: { memberId: true, bookId: true, startDate: true, endDate: true, status: true },
    });

    const stateMap = new Map(states.map(s => [`${s.memberId}:${s.bookId}`, s]));

    return requests.map(r => {
      const state = stateMap.get(`${r.memberId}:${r.bookId}`) ?? null;
      const image = imageMap.get(r.book.id) ?? null;

      return {
        request: {
          id: r.id,
          status: r.status,
          note: r.note,
          createdAt: r.createdAt,
          decidedAt: r.decidedAt,
        },
        user: r.member.user,
        book: { ...r.book, image },
        memberState: state
          ? { startDate: state.startDate, endDate: state.endDate, status: state.status }
          : null,
      };
    });
  }

  async accept(id: number, dto: UpdateReturnRequestDto) {
    const req = await this.prisma.returnRequest.findUnique({
      where: { id },
      include: {
        member: { select: { userId: true } },
        book: { select: { id: true, title: true, quantity: true, status: true, pages: true } },
      },
    });
    if (!req) throw new NotFoundException('Return request not found');
    if (req.status !== ReturnRequestStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id },
        data: { status: ReturnRequestStatus.ACCEPTED, note: dto.note ?? null, decidedAt: new Date() },
      });

      const memberState = await tx.memberState.findFirst({
        where: {
          memberId: req.memberId,
          bookId: req.bookId,
          status: { in: [bookState.BORROWED, bookState.BOOKED] },
        },
      });

      if (memberState) {
        await tx.memberState.update({
          where: { id: memberState.id },
          data: { status: bookState.RETURNED },
        });

        if (memberState.status === bookState.BORROWED) {
          const pages = req.book.pages ?? 0;
          const addScore = Math.floor(pages / 50);
          if (addScore > 0) {
            await tx.user.update({
              where: { id: req.member.userId },
              data: { score: { increment: addScore } },
            });
          }
        }
      }

      const newQuantity = req.book.quantity + 1;
      await tx.book.update({
        where: { id: req.bookId },
        data: {
          quantity: newQuantity,
          ...(req.book.status === bookState.NOTAVAILABLE && { status: bookState.AVAILABLE }),
        },
      });

      return updated;
    });

    // Notification & waitlist outside transaction — failure here won't rollback the return
    this.notification.send(
      req.member.userId,
      'RETURN_ACCEPTED',
      'Qaytarish tasdiqlandi',
      `"${req.book.title ?? 'Kitob'}" qaytarishingiz tasdiqlandi. Rahmat!`,
    ).catch(() => {});

    this.waitlist.notifyNext(req.bookId).catch(() => {});

    return result;
  }

  async reject(id: number, dto: UpdateReturnRequestDto) {
    const req = await this.prisma.returnRequest.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Return request not found');
    if (req.status !== ReturnRequestStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    return await this.prisma.returnRequest.update({
      where: { id },
      data: { status: ReturnRequestStatus.REJECTED, note: dto.note ?? null, decidedAt: new Date() },
    });
  }
}

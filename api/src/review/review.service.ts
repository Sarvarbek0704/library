import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');

    // Faqat olgan/olgan bo'lgan userlar sharh yoza oladi
    const hasBorrowed = await this.prisma.memberState.findFirst({
      where: {
        bookId: dto.bookId,
        member: { userId },
        status: { in: ['BORROWED', 'RETURNED'] },
      },
    });
    if (!hasBorrowed) {
      throw new ForbiddenException('Sharh yozish uchun avval kitobni o\'qigan bo\'lishingiz kerak');
    }

    return this.prisma.review.upsert({
      where: { userId_bookId: { userId, bookId: dto.bookId } },
      update: { rating: dto.rating, comment: dto.comment },
      create: { userId, bookId: dto.bookId, rating: dto.rating, comment: dto.comment },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findByBook(bookId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');

    const reviews = await this.prisma.review.findMany({
      where: { bookId },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const total = reviews.length;
    const avgRating = total > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
      : 0;

    const ratingDist = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
    }));

    return { avgRating, total, ratingDist, reviews };
  }

  async findByUser(userId: number) {
    return this.prisma.review.findMany({
      where: { userId },
      include: { book: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number, userId: number, isAdmin: boolean) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Sharh topilmadi');
    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException('Bu sharhni o\'chira olmaysiz');
    }
    return this.prisma.review.delete({ where: { id } });
  }
}

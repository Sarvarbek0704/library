import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookStatus } from '@prisma/client';
import { CreateArchiveBookDto } from './dto/create-archive-book.dto';
import { UpdateArchiveBookDto } from './dto/update-archive-book.dto';

@Injectable()
export class ArchiveBookService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateArchiveBookDto) {
    return this.prisma.bookHistory.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.bookHistory.findMany({
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const history = await this.prisma.bookHistory.findUnique({
      where: { id },
      include: {
        user: true,
        book: true,
      },
    });

    if (!history) {
      throw new NotFoundException('Book history not found');
    }

    return history;
  }

  findByBook(bookId: number) {
    return this.prisma.bookHistory.findMany({
      where: { bookId },
      include: {
        user: true,
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  findByUser(userId: number) {
    return this.prisma.bookHistory.findMany({
      where: { userId },
      include: {
        book: true,
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async update(id: number, dto: UpdateArchiveBookDto) {
    await this.findOne(id);

    return this.prisma.bookHistory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.bookHistory.delete({
      where: { id },
    });
  }

  /**
   * логическая операция возврата книги
   */
  returnBook(id: number) {
    return this.prisma.bookHistory.update({
      where: { id },
      data: {
        returnedAt: new Date(),
        status: BookStatus.RETURNED,
      },
    });
  }
}

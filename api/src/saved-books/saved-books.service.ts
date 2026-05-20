import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavedBookDto } from './dto/create-saved-book.dto';
import { UpdateSavedBookDto } from './dto/update-saved-book.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedBooksService {
  constructor(private readonly prisma: PrismaService) {}

  /** Toggle: if already saved → remove; if not → add. Returns { saved: boolean } */
  async toggle(bookId: number, userId: number) {
    const existing = await this.prisma.savedBook.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existing) {
      await this.prisma.savedBook.delete({
        where: { userId_bookId: { userId, bookId } },
      });
      return { saved: false };
    }

    try {
      await this.prisma.savedBook.create({ data: { userId, bookId } });
      return { saved: true };
    } catch (error) {
      if (error.code === 'P2003') throw new BadRequestException('Book not found');
      throw error;
    }
  }

  /** Current user's saved books with full book data */
  async findMine(userId: number) {
    return await this.prisma.savedBook.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
      include: {
        book: {
          include: { author: true, category: true },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.savedBook.findMany({ include: { book: true, user: true } });
  }

  async findOneUser(userId: number) {
    return await this.prisma.savedBook.findMany({
      where: { userId },
      include: {
        book: { include: { author: true, category: true } },
      },
    });
  }
  async findOneBook(bookId: number) {
    return await this.prisma.savedBook.findMany({
      where: { bookId },
      include: {
        user: true,
      },
    });
  }


    async remove(bookId: number, userId: number) {
    try {
      // delete o'rniga deleteMany ishlatish ham mumkin, 
      // lekin aynan delete xatosini tutmoqchi bo'lsangiz:
      return await this.prisma.savedBook.delete({
        where: {
          userId_bookId: {
            bookId: bookId,
            userId: userId,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Saved book not found`);
      }
      throw error;
    }
  }
}
  


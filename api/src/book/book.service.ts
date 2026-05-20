import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { bookState, ImageOwnerType } from '@prisma/client';

export interface BookFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  authorId?: number;
  libraryId?: number;
  status?: bookState;
}

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        libraryId: dto.libraryId,
        categoryId: dto.categoryId,
        authorId: dto.authorId,
        title: dto.title,
        status: dto.status,
        quantity: dto.quantity,
        description: dto.description,
        pages: dto.page,
      },
    });
  }

  async addImage(data: {
    ownerId: number;
    ownerType: ImageOwnerType;
    filename: string;
    url: string;
  }) {
    return this.prisma.image.create({ data });
  }

  async deleteImage(id: number) {
    return this.prisma.image.delete({ where: { id } });
  }

  async findAll(filter: BookFilterDto = {}) {
    const { page = 1, limit = 10, search, categoryId, authorId, libraryId, status } = filter;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (libraryId) where.libraryId = libraryId;
    if (status) where.status = status;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        skip,
        take: limit,
        where,
        include: { library: true, category: true, author: true },
        orderBy: { id: 'desc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    const images = await this.prisma.image.findMany({
      where: {
        ownerType: ImageOwnerType.BOOK,
        ownerId: { in: books.map((b) => b.id) },
      },
    });

    const imagesByBookId = images.reduce(
      (acc, img) => {
        (acc[img.ownerId] ??= []).push(img);
        return acc;
      },
      {} as Record<number, typeof images>,
    );

    const data = books.map((book) => ({
      ...book,
      images: imagesByBookId[book.id] || [],
    }));

    return { data, total };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { library: true, category: true, author: true, history: true, memberStats: true },
    });

    if (!book) throw new NotFoundException('Book not found');

    const images = await this.prisma.image.findMany({
      where: { ownerId: id, ownerType: ImageOwnerType.BOOK },
    });

    return { ...book, images };
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id },
      data: {
        libraryId: dto.libraryId,
        categoryId: dto.categoryId,
        authorId: dto.authorId,
        title: dto.title,
        status: dto.status,
        description: dto.description,
        pages: dto.page,
        quantity: dto.quantity,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}

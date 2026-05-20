import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) { }

  create(dto: CreateLibraryDto) {
    return this.prisma.library.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.library.findMany({
      include: {
        books: true,
      },
    });
  }

  async findOne(id: number) {
    const library = await this.prisma.library.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    return library;
  }

  async update(id: number, dto: UpdateLibraryDto) {
    await this.findOne(id);

    return this.prisma.library.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.library.delete({
      where: { id },
    });
  }
}

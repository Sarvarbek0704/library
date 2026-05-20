import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { name: dto.name, desc: dto.desc },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: { books: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: { name: dto.name, desc: dto.desc },
    });
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.books && category.books.length > 0) {
      throw new BadRequestException(
        `Bu kategoriyada ${category.books.length} ta kitob mavjud. Avval kitoblarni o'chiring.`,
      );
    }
    return this.prisma.category.delete({ where: { id } });
  }
}

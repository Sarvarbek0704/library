import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ImageOwnerType } from '@prisma/client';

@Injectable()
export class AuthorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAuthorDto) {
    return await this.prisma.author.create({
      data: { name: dto.name, desc: dto.desc },
    });
  }

  async addImage(data: {
    ownerId: number;
    ownerType: ImageOwnerType;
    filename: string;
    url: string;
  }) {
    return await this.prisma.image.create({ data });
  }
  async deleteImage(id: number) {
    return this.prisma.image.delete({
      where: { id },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const author = await this.prisma.author.findMany({
      skip,
      take: limit,
      include:{books:true}
    });

    const images = await this.prisma.image.findMany({
      where: {
        ownerType: ImageOwnerType.AUTHOR,
        ownerId: { in: author.map((b) => b.id) },
      },
    });

    const imagesByAuthorId = images.reduce(
      (acc, img) => {
        (acc[img.ownerId] ??= []).push(img);
        return acc;
      },
      {} as Record<number, typeof images>,
    );

    const data = author.map((author) => ({
      ...author,
      images: imagesByAuthorId[author.id] || [],
    }));
   const total = await this.prisma.author.count();
    return { data, total };
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include:{books:true,}
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const images = await this.prisma.image.findMany({
      where: {
        ownerId: id,
        ownerType: ImageOwnerType.AUTHOR,
      },
    });

    return { ...author, images }
  }

  async update(id: number, dto: UpdateAuthorDto) {
    await this.findOne(id);

    return this.prisma.author.update({
      where: { id },
      data: { name: dto.name, desc: dto.desc },
    });
  }

  async remove(id: number) {
    const author = await this.findOne(id);

    if (author.books && author.books.length > 0) {
      throw new BadRequestException(
        `Bu muallifda ${author.books.length} ta kitob mavjud. Avval kitoblarni o'chiring.`,
      );
    }

    return this.prisma.author.delete({
      where: { id },
    });
  }
}

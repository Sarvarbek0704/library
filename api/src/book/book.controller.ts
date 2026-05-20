import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/multer/config';
import { bookState, ImageOwnerType, UserRole } from '@prisma/client';
import path from 'path';
import * as fs from 'fs';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { Public } from '../common/decorators/is-public.decortor';

@ApiBearerAuth()
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBookDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('books')))
  async create(
    @Body() dto: CreateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const user = await this.bookService.create(dto);

      if (file) {
        const API_URL = process.env.API_URL;
        await this.bookService.addImage({
          ownerId: user.id,
          ownerType: ImageOwnerType.BOOK,
          filename: file.filename,
          url: `${API_URL}/uploads/books/${file.filename}`,
        });
      }

      return user;
    } catch (err) {
      if (file) {
        const filePath = path.join(
          process.cwd(),
          'uploads',
          'books',
          file.filename,
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      throw err;
    }
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'libraryId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: bookState })
  async getBooks(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('authorId') authorId?: string,
    @Query('libraryId') libraryId?: string,
    @Query('status') status?: bookState,
  ) {
    return this.bookService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
      categoryId: categoryId ? Number(categoryId) : undefined,
      authorId: authorId ? Number(authorId) : undefined,
      libraryId: libraryId ? Number(libraryId) : undefined,
      status,
    });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBookDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('books')))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const existingUser = await this.bookService.findOne(+id);
      if (!existingUser) {
        throw new NotFoundException('Book not found');
      }

      if (file) {
        if (existingUser.images && existingUser.images.length > 0) {
          const oldImg = existingUser.images[0];

          const oldPath = path.join(
            process.cwd(),
            'uploads',
            'books',
            oldImg.filename,
          );

          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

          await this.bookService.deleteImage(oldImg.id);
        }
        const API_URL = process.env.API_URL;
        await this.bookService.addImage({
          ownerId: existingUser.id,
          ownerType: ImageOwnerType.BOOK,
          filename: file.filename,
          url: `${API_URL}/uploads/books/${file.filename}`,
        });
      }

      const updatedUser = await this.bookService.update(+id, dto);

      return updatedUser;
    } catch (err) {
      if (file) {
        const filePath = path.join(
          process.cwd(),
          'uploads',
          'books',
          file.filename,
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      throw err;
    }
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}

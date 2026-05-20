import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ImageOwnerType, UserRole } from '@prisma/client';
import { multerConfig } from '../common/multer/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import path from 'path';
import * as fs from 'fs';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@ApiBearerAuth()
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAuthorDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('author')))
  async create(
    @Body() dto: CreateAuthorDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const user = await this.authorService.create(dto);

      if (file) {
        const API_URL = process.env.API_URL;
        await this.authorService.addImage({
          ownerId: user.id,
          ownerType: ImageOwnerType.AUTHOR,
          filename: file.filename,
          url: `${API_URL}/uploads/author/${file.filename}`,
        });
      }

      return user;
    } catch (err) {
      if (file) {
        const filePath = path.join(
          process.cwd(),
          'uploads',
          'author',
          file.filename,
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      throw err;
    }
  }

  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.authorService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAuthorDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('author')))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAuthorDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const existingUser = await this.authorService.findOne(+id);
      if (!existingUser) {
        throw new NotFoundException('Author not found');
      }

      if (file) {
        if (existingUser.images && existingUser.images.length > 0) {
          const oldImg = existingUser.images[0];

          const oldPath = path.join(
            process.cwd(),
            'uploads',
            'author',
            oldImg.filename,
          );

          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

          await this.authorService.deleteImage(oldImg.id);
        }
        const API_URL = process.env.API_URL;
        await this.authorService.addImage({
          ownerId: existingUser.id,
          ownerType: ImageOwnerType.AUTHOR,
          filename: file.filename,
          url: `${API_URL}/uploads/author/${file.filename}`,
        });
      }

      const updatedUser = await this.authorService.update(+id, dto);

      return updatedUser;
    } catch (err) {
      if (file) {
        const filePath = path.join(
          process.cwd(),
          'uploads',
          'author',
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
    return this.authorService.remove(+id);
  }
}

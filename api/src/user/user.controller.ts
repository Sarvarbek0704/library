import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, NotFoundException, Query, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/multer/config';
import { ImageOwnerType, UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import path from 'path';
import * as fs from 'fs';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { SelfGuard } from '../common/guards/self.guard';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return user;
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.userService.findAll(Number(page) || 1, Number(limit) || 20, search, role);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/alluser')
  findAllUser(@Query('page') page: string, @Query('limit') limit: string) {
    return this.userService.findAllUser(Number(page) || 1, Number(limit) || 10);
  }

  @Get('me')
  getMe(@Req() req: any) {
    return this.userService.findOne(req.user?.id);
  }

  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('users')))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const existingUser = await this.userService.findOne(+id);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (file) {
        if (existingUser.images && existingUser.images.length > 0) {
          const oldImg = existingUser.images[0];

          const oldPath = path.join(
            process.cwd(),
            'uploads',
            'users',
            oldImg.filename,
          );

          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

          await this.userService.deleteImage(oldImg.id);
        }
        const API_URL = process.env.API_URL;
        await this.userService.addImage({
          ownerId: existingUser.id,
          ownerType: ImageOwnerType.USER,
          filename: file.filename,
          url: `${API_URL}/uploads/users/${file.filename}`,
        });
      }

      const updatedUser = await this.userService.update(+id, dto);

      return updatedUser;
    } catch (err) {
      if (file) {
        const filePath = path.join(
          process.cwd(),
          'uploads',
          'users',
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
    return this.userService.remove(+id);
  }

  @Post('statis')
  sta(@Req() req: any){
    return this.userService.statistic(+req.user.id)
  }
}

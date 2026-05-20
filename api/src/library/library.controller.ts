import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/role.guard';

@ApiBearerAuth()
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createLibraryDto: CreateLibraryDto) {
    return this.libraryService.create(createLibraryDto);
  }
  @Get()
  findAll() {
    return this.libraryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryService.findOne(+id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.libraryService.update(+id, updateLibraryDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(+id);
  }
}

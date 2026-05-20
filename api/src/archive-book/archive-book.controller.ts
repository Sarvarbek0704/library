import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArchiveBookService } from './archive-book.service';
import { CreateArchiveBookDto } from './dto/create-archive-book.dto';
import { UpdateArchiveBookDto } from './dto/update-archive-book.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('archive-book')
export class ArchiveBookController {
  constructor(private readonly archiveBookService: ArchiveBookService) {}

  @Post()
  create(@Body() createArchiveBookDto: CreateArchiveBookDto) {
    return this.archiveBookService.create(createArchiveBookDto);
  }

  @Get()
  findAll() {
    return this.archiveBookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archiveBookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchiveBookDto: UpdateArchiveBookDto) {
    return this.archiveBookService.update(+id, updateArchiveBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archiveBookService.remove(+id);
  }
}

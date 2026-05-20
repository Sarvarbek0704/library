import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookManageService } from './book-manage.service';
import { CreateBookManageDto } from './dto/create-book-manage.dto';
import { UpdateBookManageDto } from './dto/update-book-manage.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()

@Controller('book-manage')
export class BookManageController {
  constructor(private readonly bookManageService: BookManageService) {}

  @Post()
  create(@Body() createBookManageDto: CreateBookManageDto) {
    return this.bookManageService.create(createBookManageDto);
  }

}

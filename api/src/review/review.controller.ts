import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Kitobga baho va sharh yozish' })
  create(@Req() req: any, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(+req.user.id, dto);
  }

  @Get('book/:bookId')
  @ApiOperation({ summary: 'Kitob sharhlari va o\'rtacha bahosi' })
  findByBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.reviewService.findByBook(bookId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Mening sharhlarim' })
  findMine(@Req() req: any) {
    return this.reviewService.findByUser(+req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Sharhni o\'chirish' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
    return this.reviewService.remove(id, +req.user.id, isAdmin);
  }
}

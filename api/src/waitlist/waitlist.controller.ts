import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @ApiOperation({ summary: 'Kitob navbatiga qo\'shilish' })
  join(@Req() req: any, @Body() dto: CreateWaitlistDto) {
    return this.waitlistService.join(+req.user.id, dto);
  }

  @Delete(':bookId')
  @ApiOperation({ summary: 'Navbatdan chiqish' })
  leave(@Req() req: any, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.waitlistService.leave(+req.user.id, bookId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Mening navbatlarim' })
  findMine(@Req() req: any) {
    return this.waitlistService.findMine(+req.user.id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Get('book/:bookId')
  @ApiOperation({ summary: 'Kitob navbati ro\'yxati (admin)' })
  findByBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.waitlistService.findByBook(bookId);
  }
}

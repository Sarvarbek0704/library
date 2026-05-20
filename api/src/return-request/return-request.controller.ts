import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ReturnRequestService } from './return-request.service';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';
import { PhoneReturnRequeestDto } from './dto/phone-return-request.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@Controller('return-request')
export class ReturnRequestController {
  constructor(private readonly returnRequestService: ReturnRequestService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.returnRequestService.findAll(Number(page) || 1, Number(limit) || 20, search, status);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('phone')
  findByPhone(@Body() dto: PhoneReturnRequeestDto) {
    return this.returnRequestService.findByPhone(dto);
  }

  @Post()
  create(@Body() dto: CreateReturnRequestDto) {
    return this.returnRequestService.create(dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post(':id/accept')
  accept(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReturnRequestDto,
  ) {
    return this.returnRequestService.accept(id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post(':id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReturnRequestDto,
  ) {
    return this.returnRequestService.reject(id, dto);
  }
}

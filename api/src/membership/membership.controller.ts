import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/role.guard';

@ApiBearerAuth()
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipService.findOne(+id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipService.update(+id, updateMembershipDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipService.remove(+id);
  }
}

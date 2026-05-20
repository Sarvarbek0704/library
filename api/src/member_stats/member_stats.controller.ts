import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { UpdateMemberStatDto } from './dto/update-member_stat.dto';
import { MemberStateService } from './member_stats.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@Controller('member-stats')
export class MemberStatsController {
  constructor(private readonly memberStatsService: MemberStateService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.memberStatsService.findAll(Number(page) || 1, Number(limit) || 20, search, status);
  }

  @Get('archive')
  archive(@Req() req: any) {
    return this.memberStatsService.archive(+req.user.id);
  }

  /** GET /member-stats/current OR /member-stats/my — user's active books */
  @Get('current')
  current(@Req() req: any) {
    return this.memberStatsService.current(+req.user.id);
  }

  @Get('my')
  my(@Req() req: any) {
    return this.memberStatsService.current(+req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberStatsService.findOne(+id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMemberStatDto: UpdateMemberStatDto,
  ) {
    return this.memberStatsService.update(+id, updateMemberStatDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberStatsService.remove(+id);
  }
}

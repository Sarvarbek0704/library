import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Analytics')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard statistics' })
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('book/:id')
  @ApiOperation({ summary: 'Statistics for a specific book' })
  getBookStats(@Param('id', ParseIntPipe) id: number) {
    return this.analyticsService.getBookStats(id);
  }
}

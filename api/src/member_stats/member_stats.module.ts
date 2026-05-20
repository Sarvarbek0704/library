import { Module } from '@nestjs/common';
import { MemberStateService } from './member_stats.service';
import { MemberStatsController } from './member_stats.controller';

@Module({
  controllers: [MemberStatsController],
  providers: [MemberStateService],
})
export class MemberStatsModule {}

import { Module } from '@nestjs/common';
import { ReturnRequestService } from './return-request.service';
import { ReturnRequestController } from './return-request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { WaitlistModule } from '../waitlist/waitlist.module';

@Module({
  imports: [PrismaModule, NotificationModule, WaitlistModule],
  controllers: [ReturnRequestController],
  providers: [ReturnRequestService],
})
export class ReturnRequestModule {}

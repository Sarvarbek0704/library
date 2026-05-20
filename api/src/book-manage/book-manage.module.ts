import { Module } from '@nestjs/common';
import { BookManageService } from './book-manage.service';
import { BookManageController } from './book-manage.controller';
import { BookManageCron } from './cront-book';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { WaitlistModule } from '../waitlist/waitlist.module';

@Module({
  imports: [PrismaModule, NotificationModule, WaitlistModule],
  controllers: [BookManageController],
  providers: [BookManageService, BookManageCron],
})
export class BookManageModule {}

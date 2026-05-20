import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorModule } from './author/author.module';
import { LibraryModule } from './library/library.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { MembershipModule } from './membership/membership.module';
import { MemberModule } from './member/member.module';
import { PaymentModule } from './payment/payment.module';
import { MemberStatsModule } from './member_stats/member_stats.module';
import { BookModule } from './book/book.module';

import { ArchiveBookModule } from './archive-book/archive-book.module';
import { BookManageModule } from './book-manage/book-manage.module';
import { ReturnRequestModule } from './return-request/return-request.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { SavedBooksModule } from './saved-books/saved-books.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/access-token.guard';
import { DemoGuard } from './common/guards/demo.guard';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { AnalyticsModule } from './analytics/analytics.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthorModule,
    LibraryModule,
    UserModule,
    CategoryModule,
    MembershipModule,
    MemberModule,
    PaymentModule,
    MemberStatsModule,
    BookModule,
    AuthModule,
    ArchiveBookModule,
    BookManageModule,
    ReturnRequestModule,
    ScheduleModule.forRoot(),
    SavedBooksModule,
    ReviewModule,
    NotificationModule,
    WaitlistModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: DemoGuard },
  ],
})
export class AppModule {}

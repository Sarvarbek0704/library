import { Module } from '@nestjs/common';
import { ArchiveBookService } from './archive-book.service';
import { ArchiveBookController } from './archive-book.controller';

@Module({
  controllers: [ArchiveBookController],
  providers: [ArchiveBookService],
})
export class ArchiveBookModule {}

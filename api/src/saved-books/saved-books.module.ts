import { Module } from '@nestjs/common';
import { SavedBooksService } from './saved-books.service';
import { SavedBooksController } from './saved-books.controller';

@Module({
  controllers: [SavedBooksController],
  providers: [SavedBooksService],
})
export class SavedBooksModule {}

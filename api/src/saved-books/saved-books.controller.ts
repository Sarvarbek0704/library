import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SavedBooksService } from './saved-books.service';
import { CreateSavedBookDto } from './dto/create-saved-book.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { Roles } from '../common/decorators/role.decorator';
import { RolesGuard } from '../common/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Saved Books')
@ApiBearerAuth()
@Controller('saved-books')
export class SavedBooksController {
  constructor(private readonly savedBooksService: SavedBooksService) {}

  /** POST /saved-books — toggle (add if not saved, remove if already saved) */
  @Post()
  @ApiOperation({ summary: 'Toggle saved book (add or remove)' })
  toggle(@Req() req: any, @Body() dto: CreateSavedBookDto) {
    return this.savedBooksService.toggle(+dto.bookId, +req.user.id);
  }

  /** GET /saved-books/my — current user's saved books with full book data */
  @Get('my')
  @ApiOperation({ summary: "Get current user's saved books" })
  findMine(@Req() req: any) {
    return this.savedBooksService.findMine(+req.user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Get all saved books (admin)' })
  @ApiResponse({ status: 200, description: 'List of all saved books' })
  findAll() {
    return this.savedBooksService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all saved books for a specific user' })
  @ApiResponse({ status: 200, description: 'List of saved books for user' })
  findOneUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.savedBooksService.findOneUser(userId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get('book/:bookId')
  @ApiOperation({ summary: 'Get all users who saved a specific book' })
  @ApiResponse({ status: 200, description: 'List of users who saved the book' })
  findOneBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.savedBooksService.findOneBook(bookId);
  }

  @Delete(':bookId')
  @ApiOperation({ summary: 'Remove a saved book for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Book removed successfully' })
  remove(@Param('bookId', ParseIntPipe) bookId: number, @Req() req: any) {
    return this.savedBooksService.remove(bookId, +req.user.id);
  }
}

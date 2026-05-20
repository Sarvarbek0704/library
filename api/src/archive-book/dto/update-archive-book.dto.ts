import { PartialType } from '@nestjs/swagger';
import { CreateArchiveBookDto } from './create-archive-book.dto';

export class UpdateArchiveBookDto extends PartialType(CreateArchiveBookDto) {}

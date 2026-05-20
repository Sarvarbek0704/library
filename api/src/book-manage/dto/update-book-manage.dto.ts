import { PartialType } from '@nestjs/swagger';
import { CreateBookManageDto } from './create-book-manage.dto';

export class UpdateBookManageDto extends PartialType(CreateBookManageDto) {}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateSavedBookDto {
  @ApiProperty({
    example: 5,
    description: 'Book ID',
  })
  @IsInt()
  @IsPositive()
  bookId: number;
}

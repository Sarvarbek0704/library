import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  bookId: number;

  @ApiProperty({ example: 5, description: '1 dan 5 gacha baho' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Juda zo\'r kitob, tavsiya qilaman!', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

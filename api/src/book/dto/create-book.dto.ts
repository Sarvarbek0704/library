import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { bookState } from '@prisma/client';
import { IsEnum, isEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  libraryId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  authorId: number;

  @ApiPropertyOptional({
    example: 'A Handbook of Agile Software Craftsmanship',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: bookState.AVAILABLE })
  @IsEnum(bookState)
  status: bookState;

    @ApiProperty({ example: 1 })
    @IsInt()
    quantity: number;

    
    
  
    @ApiPropertyOptional({ example: 'Best practices for writing clean code' })
    @IsOptional()
    @IsString()
    description?: string;

  @ApiProperty({example:300})
  @IsInt()
  page:number
}

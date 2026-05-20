import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'George Orwell',
    description: 'Author full name',
  })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    example: 'English novelist, essayist, journalist and critic',
    description: 'Short author description',
  })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  desc?: string;
}

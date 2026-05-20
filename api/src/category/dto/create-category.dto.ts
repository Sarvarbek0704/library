import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Science Fiction',
        description: 'Unique category name',
    })
    @IsString()
    @Length(2, 50)
    name: string;

    @ApiPropertyOptional({
        example: 'Books related to science, future and technology',
        description: 'Category description',
    })
    @IsOptional()
    @IsString()
    @Length(5, 255)
    desc?: string;
}

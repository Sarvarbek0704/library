import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateLibraryDto {
    @ApiProperty({
        example: 'Central Library',
        description: 'Library name',
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        example: '+998901234567',
        description: 'Contact phone or email',
    })
    @IsOptional()
    @IsString()
    contact?: string;

    @ApiPropertyOptional({
        example: 'Tashkent, Amir Temur street 12',
        description: 'Library address',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        example: 'Tashkent',
        description: 'Location / district',
    })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({
        example: 41.3111,
        description: 'Latitude',
    })
    @IsOptional()
    @IsNumber()
    lat?: number;

    @ApiPropertyOptional({
        example: 69.2797,
        description: 'Longitude',
    })
    @IsOptional()
    @IsNumber()
    lon?: number;
}

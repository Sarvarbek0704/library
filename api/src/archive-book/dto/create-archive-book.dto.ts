import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { BookStatus } from '@prisma/client';

export class CreateArchiveBookDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    userId: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    bookId: number;

    @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
    @IsDateString()
    borrowedAt: Date;

    @ApiPropertyOptional({ example: '2026-01-20T10:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    returnedAt?: Date;

    @ApiProperty({ enum: BookStatus, example: 'BORROWED' })
    @IsEnum(BookStatus)
    status: BookStatus;
}

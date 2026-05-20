import { ApiProperty } from '@nestjs/swagger';
import { bookState } from '@prisma/client';
import { IsEnum, IsInt, IsISO8601, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookManageDto {
    @ApiProperty({ example: 1, description: 'ID книги' })
    @Type(() => Number)
    @IsInt()
    bookId: number;

    @ApiProperty({ example: 4, description: 'ID участника (member)' })
    @Type(() => Number)
    @IsInt()
    memberId: number;

    // @ApiProperty({
    //     example: '2026-02-01T00:00:00.000Z',
    //     description: 'Дата, когда книгу нужно вернуть (due date)',
    //     required: false,
    // })
    // @IsOptional()
    // @IsISO8601()
    // endDate?: string;

    @ApiProperty({
        enum: bookState,
        example: bookState.BOOKED,
        description: 'BOOKED (бронь) или TAKEN (взял домой)',
    })
    @IsEnum(bookState)
    status: bookState;

    @ApiProperty({
        example: 1,
        description: "how many>?",
    })
    @Type(() => Number)
    @IsInt()
    quantity: number;
}

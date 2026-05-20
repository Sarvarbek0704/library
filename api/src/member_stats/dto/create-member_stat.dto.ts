import { ApiProperty } from '@nestjs/swagger';
import { bookState } from '@prisma/client';
import { IsInt, IsDateString, IsEnum } from 'class-validator';
// import { BookStatus } from '@prisma/client';

export class CreateMemberStateDto {
    @ApiProperty({ example: 1, description: 'Member ID' })
    @IsInt()
    memberId: number;

    @ApiProperty({ example: 1, description: 'Book ID' })
    @IsInt()
    bookId: number;

    @ApiProperty({
        example: '2026-01-16',
        description: 'Borrow start date',
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({
        example: '2026-01-30',
        description: 'Borrow end date',
    })
    @IsDateString()
    endDate: string;

    @ApiProperty({
        enum: bookState,
        example: bookState.BOOKED,
    })
    @IsEnum(bookState)
    status: bookState;
}

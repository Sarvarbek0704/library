import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReturnRequestDto {
    @ApiProperty({ example: 4, description: 'ID участника (Member)' })
    @Type(() => Number)
    @IsInt()
    memberId: number;

    @ApiProperty({ example: 12, description: 'ID книги (Book)' })
    @Type(() => Number)
    @IsInt()
    bookId: number;
}

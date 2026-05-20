import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReturnRequestDto } from './create-return-request.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReturnRequestDto extends PartialType(CreateReturnRequestDto) {
    @ApiProperty({
        example: 'Книга принята / причина отказа',
        required: false,
        description: 'Комментарий staff (необязательно)',
    })
    @IsOptional()
    @IsString()
    note?: string;
}

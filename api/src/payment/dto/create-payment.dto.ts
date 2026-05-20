import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

// User-facing: only membershipId + optional method required.
// userId, amount, status are resolved server-side.
export class CreatePaymentDto {
    @ApiProperty({ example: 2 })
    @IsInt()
    membershipId: number;

    @ApiPropertyOptional({ enum: PaymentMethod, example: PaymentMethod.CARD })
    @IsEnum(PaymentMethod)
    @IsOptional()
    method?: PaymentMethod;
}

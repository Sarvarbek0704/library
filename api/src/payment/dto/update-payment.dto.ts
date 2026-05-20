import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentDto {
  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}

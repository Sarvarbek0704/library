import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PhoneReturnRequeestDto {
    @ApiProperty({ example: "+998901234567", description: 'Phone Number' })
    @IsString()
    phone: string
}
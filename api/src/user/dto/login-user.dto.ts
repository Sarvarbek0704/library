import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginUser {
  @ApiProperty({
    example: '+998901234567',
    description: 'Unique phone number',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  @IsString()
  @Length(6, 100)
  password: string;
}
export class SendOtpDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Unique phone number',
  })
  @IsString()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Unique phone number',
  })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}

export class VerifyChangePassOtpDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  otp: string;
}

export class NewPasswordDto {
  @ApiProperty({ example: 'NewStrongPassword123' })
  @IsString()
  password: string;
}

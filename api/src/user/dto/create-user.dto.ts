import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
  })
  @IsString()
  @Length(2, 50)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
  })
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Unique phone number',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
  })
  // @IsOptional()
  // @IsEnum(UserRole)
  // role: UserRole;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'User avatar (optional)',
  })
  @IsOptional()
  avatar?: string;
}

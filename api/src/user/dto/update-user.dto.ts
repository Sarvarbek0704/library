import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'newPassword123', description: 'New password' })
  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'User avatar' })
  @IsOptional()
  avatar?: string;
}

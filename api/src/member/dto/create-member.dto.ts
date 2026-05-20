import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsDateString, IsBoolean } from 'class-validator';
import { MemberStatus } from '@prisma/client';

export class CreateMemberDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 2,
    description: 'Membership ID',
  })
  @IsInt()
  membershipId: number;

  @ApiProperty({
    example: '2026-01-01',
    description: 'Membership start date',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2026-01-31',
    description: 'Membership end date',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    enum: MemberStatus,
    example: MemberStatus.ACTIVE,
    description: 'Membership status',
  })
  @IsEnum(MemberStatus)
  status: MemberStatus;


  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isPaid: boolean
}

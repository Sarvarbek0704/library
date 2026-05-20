import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMembershipDto {
    @ApiProperty({
        example: 'Premium',
        description: 'Membership name (any string)',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 199000,
        description: 'Membership price',
    })
    @Min(0)
    price: number;

    @ApiProperty({
        example: 30,
        description: 'Duration in days',
    })
    @IsInt()
    @Min(1)
    durationDays: number;

    @ApiPropertyOptional({
        example: 'Access to 5 books for 30 days',
        description: 'Membership description',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 5,
        description: 'Book borrow limit',
    })
    @IsInt()
    @Min(1)
    limitBorrow: number;

    @ApiProperty({
        example: 5,
        description: 'Book rent limit',
    })
    @IsInt()
    @Min(1)
    limitBook: number;
}

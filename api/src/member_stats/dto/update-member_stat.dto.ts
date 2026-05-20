import { PartialType } from '@nestjs/swagger';
import { CreateMemberStateDto } from './create-member_stat.dto';
// import { CreateMemberStatDto } from './create-member_stat.dto';

export class UpdateMemberStatDto extends PartialType(CreateMemberStateDto) {}

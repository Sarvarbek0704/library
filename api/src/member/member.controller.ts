import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /** GET /member/my — returns the current user's active membership */
  @Get('my')
  findMy(@Req() req: any) {
    return this.memberService.findByUser(+req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('membershipId') membershipId?: string,
  ) {
    return this.memberService.findAll(
      Number(page) || 1,
      Number(limit) || 20,
      search,
      status,
      membershipId ? Number(membershipId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}

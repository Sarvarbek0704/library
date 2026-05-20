import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUser, NewPasswordDto, SendOtpDto, VerifyChangePassOtpDto, VerifyOtpDto } from '../user/dto/login-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { Public } from '../common/decorators/is-public.decortor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/send-otp  — original route */
  @Public()
  @Post('send-otp')
  async sendOtp(@Body() dto: CreateUserDto) {
    return this.authService.SenOpt(dto);
  }

  /** POST /auth/register — alias used by the frontend Register page */
  @Public()
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.SenOpt(dto);
  }

  /** POST /auth/otp — alias for send-otp (legacy frontend route) */
  @Public()
  @Post('otp')
  async sendOtpAlias(@Body() dto: CreateUserDto) {
    return this.authService.SenOpt(dto);
  }

  /** POST /auth/verify-otp — original route */
  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return await this.authService.VerfyOtp(dto.otp, dto.phone);
  }

  /** POST /auth/confirm-otp — alias used by the frontend OTP page */
  @Public()
  @Post('confirm-otp')
  async confirmOtp(@Body() dto: VerifyOtpDto) {
    return await this.authService.VerfyOtp(dto.otp, dto.phone);
  }

  @Public()
  @Post('login')
  async login(
    @Body() logDto: LoginUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(logDto, res);
  }

  @Post('change-pass')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send OTP for change password' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  sendOtpForPass(@Req() req: any) {
    return this.authService.changePassword(+req.user.id);
  }

  @Post('change-password/verify-otp')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified' })
  verifyChangePassword(@Req() req: any, @Body() dto: VerifyChangePassOtpDto) {
    console.log(dto);
    return this.authService.verifyChangePassword(dto.otp, +req.user.id);
  }

  @Post('new-password')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set new password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  newPassword(@Req() req: any, @Body() dto: NewPasswordDto) {
    return this.authService.newPassword(+req.user.id, dto.password);
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OtpService } from './otp/otp.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from '../common/strategies';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'access-jwt' }),
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [OtpService, AuthService,AccessTokenStrategy],
})
export class AuthModule {}

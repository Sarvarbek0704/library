import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp/otp.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginUser } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly otp: OtpService,
  ) {}

  generateTokens(user: User) {
    const payload = {
      id: user.id,
      role: user.role,
      name: user.firstName,
      isDemo: (user as any).isDemo ?? false,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME as any,
    });

    return { accessToken };
  }

  async onModuleInit() {
    const phoneA = process.env.SUPER_ADMIN_PHONE;
    const password = process.env.SUPER_ADMIN_SECRET;

    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          firstName: 'SUPER',
          lastName: 'ADMIN',
          isActive: true,
          phone: phoneA!,
          password: hashedPassword,
          role: 'SUPER_ADMIN',
        },
      });
      console.log('SuperAdmin created');
    }
  }

  async SenOpt(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existingUser && existingUser.isActive) {
      throw new BadRequestException('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan');
    }

    if (!existingUser) {
      if (!dto.password || !dto.firstName) {
        throw new BadRequestException('Ism va parol kiritilishi shart');
      }
      const hashedPassword = await bcrypt.hash(dto.password, 7);
      await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName ?? '',
          password: hashedPassword,
          phone: dto.phone,
          role: UserRole.USER,
          isActive: false,
        },
      });
    }

    // Generate and store OTP in memory
    const otpCode = await this.otp.sendOtp(dto.phone);

    // Since SMS is not configured, return OTP in response (dev/demo mode)
    // In production: remove devOtp and enable SMS sending in otp.service.ts
    return {
      message: 'Tasdiqlash kodi yaratildi',
      devOtp: otpCode,    // ← remove this line when real SMS is connected
    };
  }

  async VerfyOtp(otp: string, phone: string) {
    const isValid = this.otp.verifyOtp(phone, otp);
    if (!isValid) {
      throw new BadRequestException('Noto\'g\'ri yoki muddati o\'tgan kod');
    }

    const user = await this.prisma.user.update({
      where: { phone },
      data: { isActive: true },
    });

    const token = this.generateTokens(user);
    return {
      message: 'Ro\'yxatdan o\'tish muvaffaqiyatli!',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(logDto: LoginUser, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { phone: logDto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect phone or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is not verified');
    }

    const isPasswordValid = await bcrypt.compare(logDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect phone or password');
    }

    const token = this.generateTokens(user);
    return { message: 'Signed in successfully', token, user };
  }

  async changePassword(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.otp.sendOtp(user.phone);

    // Upsert to avoid duplicate key on repeated change-password requests
    await this.prisma.passwordReset.upsert({
      where: { phone: user.phone },
      update: { used: false, createdAt: new Date() },
      create: { phone: user.phone },
    });

    return { message: 'OTP sent' };
  }

  async verifyChangePassword(otp: string, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = this.otp.verifyOtp(user.phone, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.passwordReset.update({
      where: { phone: user.phone },
      data: { used: true },
    });

    return { message: 'OTP verified' };
  }

  async newPassword(id: number, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const pass = await this.prisma.passwordReset.findUnique({
      where: { phone: user.phone },
    });

    if (!pass || !pass.used) {
      throw new BadRequestException('Please verify OTP first');
    }

    const hashedPass = await bcrypt.hash(password, 7);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPass },
    });

    await this.prisma.passwordReset.delete({ where: { phone: user.phone } });

    return { message: 'Password changed successfully' };
  }
}

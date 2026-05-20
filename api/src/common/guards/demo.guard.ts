import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DemoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Faqat autentifikatsiya qilingan demo userlar uchun ishlaydi
    if (!user || !user.isDemo) return true;

    const method = request.method?.toUpperCase();
    const writeMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];

    if (writeMethods.includes(method)) {
      throw new ForbiddenException(
        'Demo hisob faqat ma\'lumotlarni ko\'rish uchun. O\'zgartirish mumkin emas.',
      );
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = request.params.id;

    if (!user) throw new ForbiddenException('The token is invalid or does not exist');

    if (user.id == paramId || user.role == UserRole.SUPER_ADMIN) {
      return true;
    }

    throw new ForbiddenException('You are not allowed');
  }
}

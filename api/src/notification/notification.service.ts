import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async send(userId: number, type: NotificationType, title: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, type, title, message },
    });
  }

  async sendMany(userIds: number[], type: NotificationType, title: string, message: string) {
    return this.prisma.notification.createMany({
      data: userIds.map(userId => ({ userId, type, title, message })),
    });
  }

  async findMine(userId: number) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { notifications, unreadCount };
  }

  async markRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async remove(id: number, userId: number) {
    return this.prisma.notification.deleteMany({ where: { id, userId } });
  }

  async clearAll(userId: number) {
    return this.prisma.notification.deleteMany({ where: { userId } });
  }
}

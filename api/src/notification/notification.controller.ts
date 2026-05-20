import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Mening bildirishnomalarim' })
  findMine(@Req() req: any) {
    return this.notificationService.findMine(+req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Bildirishnomani o\'qildi deb belgilash' })
  markRead(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.notificationService.markRead(id, +req.user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Hammasini o\'qildi deb belgilash' })
  markAllRead(@Req() req: any) {
    return this.notificationService.markAllRead(+req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Bildirishnomani o\'chirish' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.notificationService.remove(id, +req.user.id);
  }

  @Delete()
  @ApiOperation({ summary: 'Barcha bildirishnomalarni o\'chirish' })
  clearAll(@Req() req: any) {
    return this.notificationService.clearAll(+req.user.id);
  }
}

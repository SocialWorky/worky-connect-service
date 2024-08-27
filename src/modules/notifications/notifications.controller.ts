/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Param, Patch, Put } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Put(':id')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationsService.markAsRead(id);
  }
}

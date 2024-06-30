import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  createNotification(
    notificationData: Partial<Notification>,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create(notificationData);
    return this.notificationsRepository.save(notification);
  }

  getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  markAsRead(notificationId: string): Promise<void> {
    return this.notificationsRepository
      .update(notificationId, { read: true })
      .then(() => {});
  }
}

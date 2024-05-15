import { Module } from '@nestjs/common';
import { WorkyNotificationsGateway } from './worky-notificationsComment.gateway';

@Module({
  providers: [WorkyNotificationsGateway],
})
export class WorkyNotificationsModule {}

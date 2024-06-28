import { Module } from '@nestjs/common';
import { WorkyCommentsGateway } from './workyComment.gateway';
import { WorkyUsersGateway } from './workyUsers.gateway';
import { WorkyEntireAppGateway } from './workyEntireApp.gateway';

@Module({
  providers: [WorkyCommentsGateway, WorkyUsersGateway, WorkyEntireAppGateway],
})
export class WorkyNotificationsModule {}

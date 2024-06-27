import { Module } from '@nestjs/common';
import { WorkyCommentsGateway } from './workyComment.gateway';
import { WorkyUsersGateway } from './workyUsers.gateway';

@Module({
  providers: [WorkyCommentsGateway, WorkyUsersGateway],
})
export class WorkyNotificationsModule {}

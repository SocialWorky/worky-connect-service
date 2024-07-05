import { Module } from '@nestjs/common';
import { WorkyCommentsGateway } from './workyComment.gateway';
import { WorkyUsersGateway } from './workyUsers.gateway';
import { WorkyEntireAppGateway } from './workyEntireApp.gateway';
import { WorkyMessageChatGateway } from './workyMessageChat.gateway';

@Module({
  providers: [
    WorkyCommentsGateway,
    WorkyUsersGateway,
    WorkyEntireAppGateway,
    WorkyMessageChatGateway,
  ],
})
export class WorkyNotificationsModule {}

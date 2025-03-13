import { Module } from '@nestjs/common';
import { WorkyCommentsGateway } from './workyComment.gateway';
import { WorkyUsersGateway } from './workyUsers.gateway';
import { WorkyEntireAppGateway } from './workyEntireApp.gateway';
import { WorkyMessageChatGateway } from './workyMessageChat.gateway';
import { WorkyPublicationsGateway } from './workyPublication.gateway';

@Module({
  providers: [
    WorkyCommentsGateway,
    WorkyUsersGateway,
    WorkyEntireAppGateway,
    WorkyMessageChatGateway,
    WorkyPublicationsGateway,
  ],
})
export class WorkyNotificationsModule {}

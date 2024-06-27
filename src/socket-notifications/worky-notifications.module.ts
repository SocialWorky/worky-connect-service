import { Module } from '@nestjs/common';
import { WorkyCommentsGateway } from './workyComment.gateway';

@Module({
  providers: [WorkyCommentsGateway],
})
export class WorkyNotificationsModule {}

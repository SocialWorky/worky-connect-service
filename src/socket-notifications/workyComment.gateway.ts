import { SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CommentI } from 'src/interfaces/comments/comments.interface';
import { BaseGateway } from './base.gateway';

export class WorkyCommentsGateway extends BaseGateway {
  @SubscribeMessage('newComment')
  handleNewComment(@MessageBody() payload: CommentI) {
    this.server.emit('newComment', payload);
  }
}

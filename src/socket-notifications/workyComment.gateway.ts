import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NewComment } from 'src/interfaces/comments/comments.interface';
import { Logger } from '@nestjs/common';

const WORKY_NOTIFICATIONS_PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(WORKY_NOTIFICATIONS_PORT, { cors: { origin: '*' } })
export class WorkyCommentsGateway {
  private logger: Logger = new Logger('WorkyCommentGateway');

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('newComment')
  handleNewComment(@MessageBody() payload: NewComment) {
    this.server.emit('newComment', payload);
  }
}

import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CommentI } from 'src/interfaces/comments/comments.interface';

const WORKY_NOTIFICATIONS_PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(WORKY_NOTIFICATIONS_PORT, { cors: { origin: '*' } })
export class WorkyCommentsGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('newComment')
  handleNewComment(@MessageBody() payload: CommentI) {
    this.server.emit('newComment', payload);
  }
}

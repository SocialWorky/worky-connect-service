import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CommentI } from 'src/interfaces/comments/comments.interface';

@WebSocketGateway({ port: Number(process.env.WS_PORT), cors: { origin: '*' } })
export class WorkyNotificationsGateway {
  constructor() {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newComment')
  handleNewComment(@MessageBody() payload: CommentI) {
    this.server.emit('newComment', payload);
  }
}

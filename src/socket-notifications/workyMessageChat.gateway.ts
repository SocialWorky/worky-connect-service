import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

const WORKY_NOTIFICATIONS_PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(WORKY_NOTIFICATIONS_PORT, { cors: { origin: '*' } })
export class WorkyMessageChatGateway {
  private logger: Logger = new Logger('newMessageChat');

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('newMessageChat')
  handleNewComment(@MessageBody() payload: any) {
    this.server.emit('newMessageChat', payload);
  }
}

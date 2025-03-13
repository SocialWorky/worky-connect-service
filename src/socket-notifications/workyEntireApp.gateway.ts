import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

const WORKY_NOTIFICATIONS_PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(WORKY_NOTIFICATIONS_PORT, { cors: { origin: '*' } })
export class WorkyEntireAppGateway {
  private logger: Logger = new Logger('WorkyEntireAppGateway');

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('generalNotification')
  handleNewComment(@MessageBody() payload?: any) {
    this.server.emit('generalNotification', payload);
  }

  @SubscribeMessage('updateConfig')
  handleUpdateConfig(@MessageBody() payload?: any) {
    this.server.emit('updateConfig', payload);
  }
}

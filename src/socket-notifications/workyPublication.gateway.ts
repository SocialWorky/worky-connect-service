import {
  SubscribeMessage,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
//import { NewComment } from 'src/interfaces/comments/comments.interface';
import { Logger } from '@nestjs/common';

const WORKY_NOTIFICATIONS_PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(WORKY_NOTIFICATIONS_PORT, { cors: { origin: '*' } })
export class WorkyPublicationsGateway {
  private logger: Logger = new Logger('WorkyPublicationGateway');

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('newPublication')
  handleNewPublication(@MessageBody() payload: any) {
    this.server.emit('newPublication', payload);
  }

  @SubscribeMessage('deletePublication')
  handleDeletePublication(@MessageBody() payload: any) {
    this.server.emit('deletePublication', payload);
  }

  @SubscribeMessage('updatePublication')
  handleUpdatePublication(@MessageBody() payload: any) {
    this.server.emit('updatePublication', payload);
  }

}

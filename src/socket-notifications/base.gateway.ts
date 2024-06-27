import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

const WORKY_NOTIFICATIONS_PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(WORKY_NOTIFICATIONS_PORT, { cors: { origin: '*' } })
export class BaseGateway {
  @WebSocketServer()
  server: Server;
}

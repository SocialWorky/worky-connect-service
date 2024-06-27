import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(parseInt(process.env.WS_PORT), { cors: { origin: '*' } })
export class WorkyUsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private onlineUsers = [];

  private logger: Logger = new Logger('WorkyUsersGateway');

  handleConnection(client: Socket) {
    const userId = client.handshake.query.id as string;
    const avatar = client.handshake.query.avatar as string;
    const name = client.handshake.query.name as string;
    const role = client.handshake.query.role as string;
    const email = client.handshake.query.email as string;
    const username = client.handshake.query.username as string;
    if (userId) {
      const user = this.onlineUsers.find((user) => user._id === userId);
      if (user) {
        return;
      }
      const dataUser = {
        _id: userId,
        avatar,
        name,
        role,
        email,
        username,
        status: 'online',
      };
      this.onlineUsers.push(dataUser);
      this.server.emit('userStatus', this.usersOnline());
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.id as string;
    if (userId) {
      const user = this.onlineUsers.find((user) => user._id === userId);
      if (!user) {
        return;
      }
      const index = this.onlineUsers.findIndex((user) => user._id === userId);
      this.onlineUsers.splice(index, 1);

      this.server.emit('userStatus', this.usersOnline());
    }
  }

  @SubscribeMessage('refreshUserStatuses')
  handleRefreshUserStatuses() {
    this.logger.log('Refresh user statuses');
    this.server.emit('userStatus', this.usersOnline());
  }

  @SubscribeMessage('logoutUser')
  handleLogoutUser(client: Socket) {
    const userId = client.handshake.query.id as string;
    if (userId) {
      const user = this.onlineUsers.find((user) => user._id === userId);
      if (!user) {
        return;
      }
      const index = this.onlineUsers.findIndex((user) => user._id === userId);
      this.onlineUsers.splice(index, 1);

      this.server.emit('userStatus', this.usersOnline());
    }
  }

  @SubscribeMessage('loginUser')
  handleLoginUser(client: Socket) {
    const userId = client.handshake.query.id as string;
    const avatar = client.handshake.query.avatar as string;
    const name = client.handshake.query.name as string;
    const role = client.handshake.query.role as string;
    const email = client.handshake.query.email as string;
    const username = client.handshake.query.username as string;
    if (userId) {
      const user = this.onlineUsers.find((user) => user._id === userId);
      if (user) {
        return;
      }
      const dataUser = {
        _id: userId,
        avatar,
        name,
        role,
        email,
        username,
        status: 'online',
      };
      this.onlineUsers.push(dataUser);
      this.server.emit('userStatus', this.usersOnline());
    }
  }

  usersOnline() {
    return this.onlineUsers;
  }
}

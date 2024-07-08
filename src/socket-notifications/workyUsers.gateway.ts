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
      this.addOrUpdateUser({
        _id: userId,
        avatar,
        name,
        role,
        email,
        username,
        status: 'online',
      });
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.id as string;
    if (userId) {
      this.removeUser(userId);
    }
  }

  @SubscribeMessage('refreshUserStatuses')
  handleRefreshUserStatuses() {
    this.server.emit('initialUserStatuses', this.usersOnline());
  }

  @SubscribeMessage('logoutUser')
  handleLogoutUser(client: Socket) {
    const userId = client.handshake.query.id as string;
    if (userId) {
      this.removeUser(userId);
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
      this.addOrUpdateUser({
        _id: userId,
        avatar,
        name,
        role,
        email,
        username,
        status: 'online',
      });
    }
  }

  private addOrUpdateUser(user: any) {
    const index = this.onlineUsers.findIndex((u) => u._id === user._id);
    if (index === -1) {
      this.onlineUsers.push(user);
    } else {
      this.onlineUsers[index] = user;
    }
    this.server.emit('userStatus', this.usersOnline());
  }

  private removeUser(userId: string) {
    const index = this.onlineUsers.findIndex((u) => u._id === userId);
    if (index !== -1) {
      this.onlineUsers.splice(index, 1);
      this.server.emit('userStatus', this.usersOnline());
    }
  }

  usersOnline() {
    return this.onlineUsers;
  }
}

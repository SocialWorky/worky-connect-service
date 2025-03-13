import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { TokenData } from 'src/interfaces/tokenData.interface';

@WebSocketGateway(parseInt(process.env.WS_PORT), { cors: { origin: '*' } })
export class WorkyUsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private onlineUsers = [];
  private inactivityTimers = new Map<string, NodeJS.Timeout>();

  private readonly INACTIVITY_TIME = 5 * 60 * 1000;

  private logger: Logger = new Logger('WorkyUsersGateway');

  handleConnection(client: Socket) {
    this.removeInactiveUsers();

    const userId = client.handshake.query.id as string;
    const avatar = client.handshake.query.avatar as string;
    const name = client.handshake.query.name as string;
    const role = client.handshake.query.role as string;
    const email = client.handshake.query.email as string;
    const username = client.handshake.query.username as string;

    if (userId) {
      const user = this.onlineUsers.find((user) => user._id === userId);
      if (!user) {
        const dataUser = {
          _id: userId,
          avatar,
          name,
          role,
          email,
          username,
          status: 'online',
          lastActivity: new Date(),
        };
        this.onlineUsers.push(dataUser);
      }
      this.resetInactivityTimer(userId, client);
      this.server.emit('initialUserStatuses', this.usersOnline());
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.id as string;
    if (userId) {
      this.clearInactivityTimer(userId);
      this.logoutUser(userId);
      this.server.emit('initialUserStatuses', this.usersOnline());
    }
  }

  @SubscribeMessage('loginUser')
  handleLoginUser(@MessageBody() payload: TokenData) {
    if (payload.id) {
      const user = this.onlineUsers.find((user) => user._id === payload.id);
      if (!user) {
        const dataUser = {
          _id: payload.id,
          avatar: payload.avatar,
          name: payload.name,
          role: payload.role,
          email: payload.email,
          username: payload.username,
          status: 'online',
          lastActivity: new Date(),
        };
        this.onlineUsers.push(dataUser);
        this.resetInactivityTimer(payload.id);
        this.server.emit('initialUserStatuses', this.usersOnline());
      }
    }
  }

  @SubscribeMessage('logoutUser')
  handleLogoutUser(@MessageBody() payload: TokenData) {
    const userId = payload.id;
    if (userId) {
      this.clearInactivityTimer(userId);
      this.logoutUser(userId);
      this.server.emit('initialUserStatuses', this.usersOnline());
    }
  }

  @SubscribeMessage('userInactive')
  handleUserInactive(@MessageBody() payload: TokenData) {
    if (!payload || !payload.id) return;
    const userId = payload.id;
    if (userId) {
      this.clearInactivityTimer(userId);
      const user = this.onlineUsers.find((user) => user._id === userId);
      if (user) {
        user.status = 'inactive';
        this.server.emit('initialUserStatuses', this.usersOnline());
      }
    }
  }

  @SubscribeMessage('userActive')
  handleUserActive(@MessageBody() payload: TokenData) {
    if (!payload || !payload.id) return;
    const userId = payload.id;
    if (userId) {
      const user = this.onlineUsers.find((user) => user._id === userId);
      if (user) {
        user.status = 'online';
        this.resetInactivityTimer(userId);
        this.server.emit('initialUserStatuses', this.usersOnline());
      }
    }
  }

  @SubscribeMessage('refreshUserStatuses')
  handleRefreshUserStatuses() {
    this.server.emit('initialUserStatuses', this.usersOnline());
  }

  usersOnline() {
    return this.onlineUsers;
  }

  private removeInactiveUsers() {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - this.INACTIVITY_TIME);

    this.onlineUsers = this.onlineUsers.filter((user) => {
      return user.lastActivity >= cutoffTime;
    });

    this.server.emit('initialUserStatuses', this.usersOnline());
  }

  private resetInactivityTimer(userId: string, client?: Socket) {
    if (this.inactivityTimers.has(userId)) {
      clearTimeout(this.inactivityTimers.get(userId));
    }

    const timeout = setTimeout(() => {
      this.handleLogoutDueToInactivity(userId, client);
    }, this.INACTIVITY_TIME);

    this.inactivityTimers.set(userId, timeout);
  }

  private clearInactivityTimer(userId: string) {
    if (this.inactivityTimers.has(userId)) {
      clearTimeout(this.inactivityTimers.get(userId));
      this.inactivityTimers.delete(userId);
    }
  }

  private logoutUser(userId: string) {
    const index = this.onlineUsers.findIndex((user) => user._id === userId);
    if (index !== -1) {
      this.onlineUsers.splice(index, 1);
    }
  }

  private handleLogoutDueToInactivity(userId: string, client?: Socket) {
    this.clearInactivityTimer(userId);
    this.logoutUser(userId);
    if (client) {
      client.disconnect();
    }
    this.server.emit('initialUserStatuses', this.usersOnline());
  }
}

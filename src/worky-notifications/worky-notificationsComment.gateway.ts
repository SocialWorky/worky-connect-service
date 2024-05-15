import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { Server } from "socket.io";
import { CommentI } from 'src/interfaces/comments/comments.interface';

@WebSocketGateway(81, {cors: {origin: '*'}})
export class WorkyNotificationsGateway {
  constructor() {}
  @WebSocketServer()
    server: Server
  
  @SubscribeMessage('newComment')
  handleNewComment(
    @MessageBody() payload: CommentI,){
    const commentId = payload.commentId;
    const publicacionId = payload.publicacionId;
    const userEmittedId = payload.userEmittedId;
    const authorPublicationId = payload.userReceiveId;

    //this.workyNotificationsService.sendNotificationToUser(userReceiveId, userEmittedId, publicacionId, commentId);
    this.server.emit('newComment', payload);
}

}

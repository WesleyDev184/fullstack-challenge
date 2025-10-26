import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {
    return 'Hello world!'
  }
}

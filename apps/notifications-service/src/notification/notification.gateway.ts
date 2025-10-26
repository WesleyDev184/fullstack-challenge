import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationGateway {
  @WebSocketServer()
  server: Server
}

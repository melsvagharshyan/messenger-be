// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  constructor(private chatService: ChatService) {}

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { sender: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.createMessage(
      data.sender,
      data.content,
    );
    client.emit('receive_message', message);
  }

  @SubscribeMessage('get_messages')
  async handleGetMessages(@ConnectedSocket() client: Socket) {
    const messages = await this.chatService.findAll();
    client.emit('receive_messages', messages);
  }
}

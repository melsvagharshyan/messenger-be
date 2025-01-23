import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './schemas/chat-message.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  async handleConnection(client: Socket) {
    const messages = await this.chatMessageModel.find().sort({ timestamp: 1 });
    client.emit('previous-messages', messages);
  }

  @SubscribeMessage('create-message')
  async handleCreateMessage(
    @MessageBody() dto: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const newMessage = await this.chatMessageModel.create(dto);
    const allMessages = await this.chatMessageModel
      .find()
      .sort({ timestamp: 1 });

    client.emit('client-path', allMessages);
    client.broadcast.emit('client-path', allMessages);

    return newMessage;
  }

  @SubscribeMessage('update-message')
  async handleUpdateMessage(
    @MessageBody()
    dto: {
      messageId: string;
      updatedMessage: { message?: string };
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { messageId, updatedMessage } = dto;

    const updatedMessageDoc = await this.chatMessageModel.findByIdAndUpdate(
      messageId,
      updatedMessage,
      { new: true },
    );

    const allMessages = await this.chatMessageModel
      .find()
      .sort({ timestamp: 1 });

    client.emit('client-path', allMessages);
    client.broadcast.emit('client-path', allMessages);

    return updatedMessageDoc;
  }

  @SubscribeMessage('delete-message')
  async handleDeleteMessage(
    @MessageBody() dto: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { messageId } = dto;

    await this.chatMessageModel.findByIdAndDelete(messageId);

    const allMessages = await this.chatMessageModel
      .find()
      .sort({ timestamp: 1 });

    client.emit('client-path', allMessages);
    client.broadcast.emit('client-path', allMessages);

    return { deleted: true, messageId };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './schemas/chat-message.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  // Send previous messages when a new client connects
  async handleConnection(client: any) {
    console.log('CONNECTED');

    // Get all previous messages from MongoDB
    const messages = await this.chatMessageModel.find().sort({ timestamp: 1 });

    // Send the previous messages to the client
    client.emit('previous-messages', messages);
  }

  @SubscribeMessage('create-message')
  async handleEvent(
    @MessageBody() dto: { sender: string; message: string },
    @ConnectedSocket() client: any,
  ) {
    console.log(dto);

    // Save the message to the database
    await this.chatMessageModel.create(dto);

    // Get the updated list of all messages, including the new one
    const allMessages = await this.chatMessageModel
      .find()
      .sort({ timestamp: 1 });

    // Emit the entire message list (including new message) to the client
    client.emit('client-path', allMessages); // Send to the sender
    client.broadcast.emit('client-path', allMessages); // Send to other clients
  }
}

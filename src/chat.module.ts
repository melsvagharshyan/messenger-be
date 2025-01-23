import {
  ChatMessage,
  ChatMessageSchema,
} from './socket/schemas/chat-message.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ChatModule {}

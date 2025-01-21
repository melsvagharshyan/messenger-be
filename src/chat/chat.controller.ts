import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Endpoint to retrieve all messages
  @Get('messages')
  async getMessages(): Promise<ChatMessage[]> {
    return this.chatService.findAll();
  }

  // Endpoint to send a message
  @Post('send-message')
  async sendMessage(
    @Body() messageData: { sender: string; content: string },
  ): Promise<ChatMessage> {
    return this.chatService.createMessage(
      messageData.sender,
      messageData.content,
    );
  }
}

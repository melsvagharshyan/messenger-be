import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  // Save a message to the database
  async createMessage(sender: string, content: string): Promise<ChatMessage> {
    const newMessage = new this.chatMessageModel({
      sender,
      content,
      timestamp: new Date(),
    });
    return newMessage.save();
  }

  // Retrieve all messages from the database
  async findAll(): Promise<ChatMessage[]> {
    return this.chatMessageModel.find().exec();
  }
}

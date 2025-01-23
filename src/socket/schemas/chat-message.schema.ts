import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatMessage extends Document {
  //   @Prop({ required: true })
  //   sender: string;

  @Prop({ required: true })
  message: string;

  //   @Prop({ default: Date.now })
  //   timestamp: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

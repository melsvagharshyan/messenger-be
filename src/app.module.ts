import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketService } from './socket/socket.service';
import { ChatModule } from './chat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://melsvagharshyan18:mels7878@cluster0.jedxf.mongodb.net/',
    ),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketService],
})
export class AppModule {}

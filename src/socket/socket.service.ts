import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection {
  @SubscribeMessage('server-path')
  handleEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
    console.log(dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = { type: 'semeType', dto };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    client.emit('client-path', res);
  }

  handleConnection(client: any) {
    console.log(client);
    console.log('CONNECTED');
  }
}

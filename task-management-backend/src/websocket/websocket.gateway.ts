import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/auth.dto';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: JwtPayload;
  };
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private configService: ConfigService) {}

  handleConnection(client: AuthenticatedSocket) {
    const token = (client.handshake.auth as { token?: string })?.token;
    if (!token) return client.disconnect();

    try {
      const decoded = jwt.verify(
        token,
        this.configService.getOrThrow('jwt.secret'),
      ) as JwtPayload;

      const userId = decoded.sub;
      client.data.user = decoded;

      if (typeof userId === 'string') {
        client.join(userId);
      }
      console.log(`✅ ${decoded?.email} connected and joined room ${userId}`);
    } catch (err) {
      console.log('❌ Invalid token', err);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const user = client.data.user;
    console.log(`🔌 ${user?.email ?? 'Unknown user'} disconnected`);
  }

  emitTaskEvent(
    event: 'created' | 'updated' | 'deleted',
    payload: Record<string, any>,
    userId?: string,
  ) {
    if (userId) {
      this.server.to(userId).emit(`task.${event}`, payload);
      console.log(`Emitting task.${event} to user ${userId}`, payload);
    } else {
      console.log('------');
    }
  }
}

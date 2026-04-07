import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { StateService } from '../services/state.service';

@WebSocketGateway({
  namespace: '/simulation',
  cors: {
    origin: '*', // Customize this for production
  },
})
export class SimulationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SimulationGateway.name);

  constructor(private readonly stateService: StateService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Immediately send current state to newly connected client
    client.emit('train_positions', this.stateService.getAllPositions());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinLine')
  handleJoinLine(@ConnectedSocket() client: Socket, @MessageBody() lineId: string) {
    client.join(lineId);
    this.logger.log(`Client ${client.id} joined line: ${lineId}`);
    
    // Send current positions for this line immediately
    const linePositions = this.stateService.getPositionsByLine(lineId);
    client.emit('train_positions_line', linePositions);
  }

  @SubscribeMessage('leaveLine')
  handleLeaveLine(@ConnectedSocket() client: Socket, @MessageBody() lineId: string) {
    client.leave(lineId);
    this.logger.log(`Client ${client.id} left line: ${lineId}`);
  }

  // Called periodically by SimulationService
  broadcastPositions() {
    const allPositions = this.stateService.getAllPositions();
    
    // Broadcast to all clients in the default namespace room
    this.server.emit('train_positions', allPositions);

    // Optional: Broadcast delta or specific line data to rooms here
    // Example: group positions by lineId and send to respective rooms
    /*
    const positionsByLine = new Map<string, any[]>();
    allPositions.forEach(pos => {
      if (!positionsByLine.has(pos.lineId)) {
        positionsByLine.set(pos.lineId, []);
      }
      positionsByLine.get(pos.lineId).push(pos);
    });

    positionsByLine.forEach((positions, lineId) => {
      this.server.to(lineId).emit('train_positions_line', positions);
    });
    */
  }
}

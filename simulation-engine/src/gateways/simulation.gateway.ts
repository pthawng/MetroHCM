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
    origin: '*', 
  },
})
export class SimulationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SimulationGateway.name);
  private versionId = 1; // Monotonic Version ID

  constructor(private readonly stateService: StateService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Elite Standard: Send versioned snapshot on connect
    client.emit('snapshot', {
      v: this.versionId,
      ts: Date.now(),
      state: this.stateService.getAllPositions()
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinLine')
  handleJoinLine(@ConnectedSocket() client: Socket, @MessageBody() lineId: string) {
    client.join(lineId);
    this.logger.log(`Client ${client.id} joined line: ${lineId}`);
    
    // Versioned line snapshot
    const linePositions = this.stateService.getPositionsByLine(lineId);
    client.emit('snapshot_line', {
      v: this.versionId,
      lineId,
      state: linePositions
    });
  }

  @SubscribeMessage('leaveLine')
  handleLeaveLine(@ConnectedSocket() client: Socket, @MessageBody() lineId: string) {
    client.leave(lineId);
    this.logger.log(`Client ${client.id} left line: ${lineId}`);
  }

  // Called periodically by SimulationService
  broadcastPositions() {
    const allPositions = this.stateService.getAllPositions();
    this.versionId++; // Increment version on every state change

    // Elite Standard: The Telemetry Bundle
    const bundle = {
      v: this.versionId,
      ts: Date.now(),
      trains: allPositions
    };

    // Broadcast bundle to all clients (Elite Standard)
    this.server.emit('train_telemetry', bundle);

    // Legacy/Debug standard for simple tools
    this.server.emit('train_positions', allPositions);
  }
}

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { TimeService } from './time.service';
import { Station, StopTime, Trip, TrainState, TrainPosition } from '../models/simulation.types';
import { BackendClientService } from './backend-client.service';
import { StateService } from './state.service';
import { SimulationGateway } from '../gateways/simulation.gateway';

@Injectable()
export class SimulationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SimulationService.name);
  private stationsMap: Map<string, Station> = new Map();
  private activeTrips: Trip[] = [];
  private tickInterval: NodeJS.Timeout;
  private syncInterval: NodeJS.Timeout;

  constructor(
    private readonly timeService: TimeService,
    private readonly backendClient: BackendClientService,
    private readonly stateService: StateService,
    private readonly gateway: SimulationGateway
  ) {}

  async onModuleInit() {
    await this.syncStations();
    await this.syncActiveTrips();

    // The Tick Engine (1000ms)
    this.tickInterval = setInterval(() => this.tick(), 1000);

    // Sync trips from Backend every 30 seconds
    this.syncInterval = setInterval(() => this.syncActiveTrips(), 30000);
  }

  onModuleDestroy() {
    clearInterval(this.tickInterval);
    clearInterval(this.syncInterval);
  }

  async syncStations() {
    const stations = await this.backendClient.fetchStations();
    this.stationsMap = new Map(stations.map((s: Station) => [s.id, s]));
    this.logger.log(`Synced ${this.stationsMap.size} stations from backend.`);
  }

  async syncActiveTrips() {
    try {
      this.activeTrips = await this.backendClient.fetchActiveTrips();
      this.logger.log(`Synced ${this.activeTrips.length} active trips from backend.`);
    } catch (e) {
      this.logger.error('Failed to sync active trips', e);
    }
  }

  private tick() {
    if (this.stationsMap.size === 0 || this.activeTrips.length === 0) return;

    // Calculate all positions
    const positions = this.activeTrips.map(trip => this.getTrainPosition(trip));
    
    // Update State
    this.stateService.updatePositions(positions);

    // Broadcast
    this.gateway.broadcastPositions();
  }

  // Backward compatibility alias for Rest API if needed
  async getActiveTrainPositions(): Promise<TrainPosition[]> {
    return this.stateService.getAllPositions();
  }

  private findTrainState(trip: Trip, now: number): TrainState {
    for (let i = 0; i < trip.stopTimes.length; i++) {
        const currentList = trip.stopTimes[i];
        
        // 1. Đang dừng ở trạm nào đó (dwelling)
        if (now >= currentList.arrivalTime && now <= currentList.departureTime) {
            return { status: 'STOPPED', stationId: currentList.stationId };
        }

        // 2. Đang di chuyển tới trạm tiếp theo
        const nextList = trip.stopTimes[i + 1];
        if (nextList && now > currentList.departureTime && now < nextList.arrivalTime) {
            return { status: 'MOVING', from: currentList, to: nextList };
        }
    }
    return { status: 'OFFLINE' };
  }

  private interpolatePosition(stationA: Station, stationB: Station, fromTime: number, toTime: number, now: number) {
    const progress = (now - fromTime) / (toTime - fromTime);
    return {
      lat: stationA.lat + (stationB.lat - stationA.lat) * progress,
      lng: stationA.lng + (stationB.lng - stationA.lng) * progress,
      progress 
    };
  }

  getTrainPosition(trip: Trip): TrainPosition {
    const now = this.timeService.getNowSeconds();
    const state = this.findTrainState(trip, now);

    if (state.status === 'OFFLINE') {
      return { tripId: trip.id, lineId: trip.lineId, status: 'OFFLINE', position: null };
    }

    if (state.status === 'STOPPED' && state.stationId) {
      const station = this.stationsMap.get(state.stationId);
      return { 
          tripId: trip.id, 
          lineId: trip.lineId, 
          status: 'STOPPED', 
          position: { lat: station!.lat, lng: station!.lng }
      };
    }

    if (state.status === 'MOVING' && state.from && state.to) {
      const stationA = this.stationsMap.get(state.from.stationId);
      const stationB = this.stationsMap.get(state.to.stationId);
      
      const interp = this.interpolatePosition(
        stationA!, stationB!, 
        state.from.departureTime, state.to.arrivalTime, now
      );

      return {
        tripId: trip.id,
        lineId: trip.lineId,
        status: 'MOVING',
        nextStationId: state.to.stationId,
        progress: interp.progress,
        position: { lat: interp.lat, lng: interp.lng }
      }
    }

    return { tripId: trip.id, lineId: trip.lineId, status: 'OFFLINE', position: null };
  }
}

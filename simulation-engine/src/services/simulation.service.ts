import { Injectable, Logger } from '@nestjs/common';
import { TimeService } from './time.service';
import { Station, StopTime, Trip, TrainState, TrainPosition } from '../models/simulation.types';

@Injectable()
export class SimulationService {
  private readonly logger = new Logger(SimulationService.name);
  
  // MOCK DATA cho 3 trạm đầu tiên tuyến số 1
  private readonly stationsMap: Map<string, Station> = new Map([
    ['S1', { id: 'S1', name: 'Bến Thành', lat: 10.7716, lng: 106.6976 }],
    ['S2', { id: 'S2', name: 'Nhà hát TP', lat: 10.7766, lng: 106.7032 }],
    ['S3', { id: 'S3', name: 'Ba Son', lat: 10.7831, lng: 106.7073 }],
  ]);

  constructor(private readonly timeService: TimeService) {}

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

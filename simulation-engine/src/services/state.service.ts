import { Injectable } from '@nestjs/common';
import { TrainPosition } from '../models/simulation.types';

@Injectable()
export class StateService {
  // Single Source of Truth for all active train positions
  private trainPositions: Map<string, TrainPosition> = new Map();

  updatePositions(positions: TrainPosition[]) {
    positions.forEach(pos => {
      this.trainPositions.set(pos.tripId, pos);
    });
    
    // Optional: Clean up offline trips
    for (const [tripId, pos] of this.trainPositions.entries()) {
      if (pos.status === 'OFFLINE' || !positions.find(p => p.tripId === tripId)) {
        this.trainPositions.delete(tripId);
      }
    }
  }

  getAllPositions(): TrainPosition[] {
    return Array.from(this.trainPositions.values());
  }

  getPositionsByLine(lineId: string): TrainPosition[] {
    return this.getAllPositions().filter(pos => pos.lineId === lineId);
  }
}

import { Train } from './train.service';
import { Station } from './station.service';

export interface PulseStatus {
  virtualTime: string;
  activeTrains: number;
  systemLoad: number;
  targetHeadway: number; // minutes
}

/**
 * Metro Pulse Engine - Real-time Edition
 * Synchronizes fleet movement with the actual system clock.
 */
class PulseService {
  private headway = 10; // Default 10 mins (Normal hours)
  private totalKm = 19.7;
  private avgSpeedKmH = 35; // Including stops
  private roundTripTimeMin = (this.totalKm / this.avgSpeedKmH) * 60 * 2; // ~68 minutes RTT
  
  // Real-time synchronization
  getPulseStatus(): PulseStatus {
    const now = new Date();
    const hours = now.getHours();
    
    // Peak hour logic (6-9h, 16-19h)
    const isPeak = (hours >= 6 && hours <= 9) || (hours >= 16 && hours <= 19);
    const currentHeadway = isPeak ? 5 : 10;
    
    // Exactly 19.7km / 35km/h = 33.7 mins per way. 
    // Total cycle is ~68 mins.
    const trainsRequired = Math.ceil(this.roundTripTimeMin / currentHeadway);

    return {
      virtualTime: now.toLocaleTimeString('vi-VN', { hour12: false }),
      activeTrains: trainsRequired,
      systemLoad: isPeak ? 85 : 45,
      targetHeadway: currentHeadway
    };
  }

  /**
   * Calculates the exact real-time position [0-1] for a train
   * based on its unique index in the dispatch cycle.
   */
  getTrainPosition(index: number, totalTrains: number): { position: number; direction: number } {
    const now = Date.now();
    const cycleMs = this.roundTripTimeMin * 60 * 1000;
    const offsetMs = (index / totalTrains) * cycleMs;
    
    // Operational position in the 0-1 cycle
    const rawProgress = ((now + offsetMs) % cycleMs) / cycleMs;
    
    // Map to 2-way traffic
    // 0 -> 0.5 is Outbound (Ben Thanh -> Suoi Tien)
    // 0.5 -> 1 is Inbound (Suoi Tien -> Ben Thanh)
    const isOutbound = rawProgress < 0.5;
    const position = isOutbound ? rawProgress * 2 : (1 - rawProgress) * 2;
    const direction = isOutbound ? 1 : -1;

    return { position, direction };
  }
}

export const pulseService = new PulseService();

import { pulseService } from './pulse.service';

export interface Train {
  id: string; // TS-01 to TS-17
  carCount: 3 | 6;
  position: number; // 0 to 1 (normalized distance)
  direction: 1 | -1; // 1: Outbound, -1: Inbound
  status: 'MOVING' | 'STOPPED';
}

const TOTAL_FLEET = 17;

export const trainService = {
  getLiveFleet: (): Train[] => {
    const pulse = pulseService.getPulseStatus();
    const fleet: Train[] = [];

    // Dispatcher logic: activate trains based on real-time headway
    const activeCount = Math.min(pulse.activeTrains, TOTAL_FLEET);

    for (let i = 0; i < activeCount; i++) {
        const id = `TS-${String(i + 1).padStart(2, '0')}`;
        const carCount = i < 10 ? 3 : 6; 
        
        const { position, direction: rawDirection } = pulseService.getTrainPosition(i, activeCount);
        const direction = rawDirection as 1 | -1;
        
        // Precise Real-time Stopping Logic
        // Simulation of 30-second dwelling at each of the 14 stations
        const isNearStation = Math.abs(Math.sin(position * Math.PI * 13)) < 0.08;

        fleet.push({
            id,
            carCount,
            position,
            direction,
            status: isNearStation ? 'STOPPED' : 'MOVING'
        });
    }

    return fleet;
  }
};

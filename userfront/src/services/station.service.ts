import { ATOMIC_STATIONS } from '../features/booking/constants/map.constants';

export interface Station {
  id: string;
  name: string;
  kmFromStart: number;
  x: number;
  y: number;
  type: 'UNDERGROUND' | 'ELEVATED';
  description?: string;
}

export const STATIONS: Station[] = ATOMIC_STATIONS.map(s => ({
  id: s.id,
  name: s.name,
  kmFromStart: s.km,
  x: s.x,
  y: s.y,
  type: s.id <= 'ST-03' ? 'UNDERGROUND' : 'ELEVATED'
}));

export const stationService = {
  getStations: (): Promise<Station[]> => {
    return Promise.resolve(STATIONS);
  },
  
  getRoute: (fromId: string, toId: string) => {
    const from = STATIONS.find(s => s.id === fromId);
    const to = STATIONS.find(s => s.id === toId);
    
    if (!from || !to) return null;
    
    const distance = Math.abs(to.kmFromStart - from.kmFromStart);
    // Real-world pricing: 12.000 (standard) + distance-based increments
    const basePrice = 12000;
    const price = distance === 0 ? 0 : basePrice + Math.round(distance * 1500);
    
    return {
      distance: Number(distance.toFixed(1)),
      price: Math.max(12000, price),
      estimatedMinutes: Math.ceil(distance * 2 + 3) // ~2min per km + 3min overhead
    };
  }
};

import { create } from 'zustand';
import { type Line, type Station, type Segment, type InfraData, type Train } from '../model/types';

interface InfraState {
  version: string | null;
  lines: Record<string, Line>;
  stations: Record<string, Station>;
  segments: Record<string, Segment>;
  trains: Record<string, Train>;
  tripToTrain: Record<string, string | null>;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  
  fetchInfra: () => Promise<void>;
  retry: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useInfraStore = create<InfraState>((set, get) => ({
  version: null,
  lines: {},
  stations: {},
  segments: {},
  trains: {},
  tripToTrain: {},
  status: 'idle',
  error: null,

  fetchInfra: async () => {
    if (get().status === 'loading' || get().status === 'ready') return;

    set({ status: 'loading', error: null });

    try {
      const response = await fetch(`${API_URL}/infra`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const data: InfraData = await response.json();
      
      set({
        version: data.version,
        lines: data.lines,
        stations: data.stations,
        segments: data.segments,
        trains: data.trains,
        tripToTrain: data.tripToTrain,
        status: 'ready',
        error: null,
      });
    } catch (err: any) {
      console.error('Failed to fetch infrastructure:', err);
      set({ 
        status: 'error', 
        error: err.message || 'Unknown network error' 
      });
    }
  },

  retry: async () => {
    set({ status: 'idle' });
    await get().fetchInfra();
  },
}));

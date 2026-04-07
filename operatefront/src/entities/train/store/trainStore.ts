import { create } from 'zustand';
import type { Train } from '../model/schema';

interface TrainState {
  trains: Record<string, Train>;
  // Called at throttled intervals from the buffer
  batchUpdate: (updates: Record<string, Train>) => void;
  // Get canonical state
  getTrain: (id: string) => Train | undefined;
}

export const useTrainStore = create<TrainState>((set, get) => ({
  trains: {},
  batchUpdate: (updates) => {
    set((state) => ({
      trains: {
        ...state.trains,
        ...updates,
      },
    }));
  },
  getTrain: (id) => get().trains[id],
}));

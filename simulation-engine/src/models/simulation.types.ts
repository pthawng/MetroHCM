export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface StopTime {
  stationId: string;
  arrivalTime: number; // seconds
  departureTime: number; // seconds
}

export interface Trip {
  id: string;
  lineId: string;
  stopTimes: StopTime[];
}

export type TrainStatus = 'MOVING' | 'STOPPED' | 'OFFLINE';

export interface TrainState {
  status: TrainStatus;
  stationId?: string; // If STOPPED
  from?: StopTime; // If MOVING
  to?: StopTime; // If MOVING
}

export interface TrainPosition {
  tripId: string;
  lineId: string;
  status: TrainStatus;
  position: {
    lat: number;
    lng: number;
  } | null;
  nextStationId?: string;
  progress?: number;
}

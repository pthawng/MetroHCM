import { BaseEntity } from '../../../shared/types';

export interface Segment extends BaseEntity {
  lineId: string;
  fromStationId: string;
  toStationId: string;
  distanceKm: number;
  geometry?: [number, number][]; // Array of [lng, lat]
  travelTimeSec: number;
  maxSpeedKmh?: number;
  trackType: string;
}

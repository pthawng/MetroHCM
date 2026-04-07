export interface Station {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  lat: number;
  lng: number;
  type: 'underground' | 'elevated' | 'surface';
}

export interface Line {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  color: string;
  status: string;
}

export interface Segment {
  id: string;
  lineId: string;
  fromStationId: string;
  toStationId: string;
  distanceKm: number;
  geometry?: [number, number][]; // [lng, lat]
}

export interface Train {
  id: string;
  code: string;
  lineId: string;
  carCount: number;
  capacityPerCar: number;
  status: string;
}

export interface InfraData {
  version: string;
  lines: Record<string, Line>;
  stations: Record<string, Station>;
  segments: Record<string, Segment>;
  trains: Record<string, Train>;
  tripToTrain: Record<string, string | null>;
}

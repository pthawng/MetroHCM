export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EntityId = string;

export enum LineStatus {
  ACTIVE = 'active',
  UNDER_CONSTRUCTION = 'under_construction',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export enum StationType {
  UNDERGROUND = 'underground',
  ELEVATED = 'elevated',
  AT_GRADE = 'at_grade',
}

export enum StationStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  UNDER_CONSTRUCTION = 'under_construction',
}

export enum TransferType {
  SAME_STATION = 'same_station',
  NEARBY_STATION = 'nearby_station',
}

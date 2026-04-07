export interface ITransitLine {
  line: {
    code: string;
    name: string;
    nameEn?: string;
    color: string;
    totalLengthKm: number;
    status: string;
  };
  stations: {
    code: string;
    name: string;
    nameEn?: string;
    lat: number;
    lng: number;
    type: string;
    sequence: number;
    km: number;
  }[];
  depots: {
    code: string;
    name: string;
    lat: number;
    lng: number;
    capacity: number;
  }[];
  trains: {
    code: string;
    carCount: number;
    capacityPerCar: number;
    status: string;
  }[];
}

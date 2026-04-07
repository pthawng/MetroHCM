import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Station, Trip } from '../models/simulation.types';

@Injectable()
export class BackendClientService {
  private readonly logger = new Logger(BackendClientService.name);
  private readonly backendUrl = 'http://localhost:3000';

  constructor(private readonly httpService: HttpService) {}

  async fetchStations(): Promise<Station[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.backendUrl}/stations`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch stations from backend', error);
      return [];
    }
  }

  async fetchActiveTrips(): Promise<Trip[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.backendUrl}/trips/active`)
      );
      // Map backend StopTime to Simulation StopTime (PlannedArrival -> arrivalTime)
      return response.data.map((trip: any) => ({
        id: trip.id,
        lineId: trip.lineId,
        stopTimes: trip.stopTimes.map((st: any) => ({
          stationId: st.stationId,
          // Convert ISO Date to seconds timestamp
          arrivalTime: new Date(st.plannedArrivalAt).getTime() / 1000,
          departureTime: new Date(st.plannedDepartureAt).getTime() / 1000,
        })),
      }));
    } catch (error) {
      this.logger.error('Failed to fetch active trips from backend', error);
      return [];
    }
  }
}

import { Controller, Get } from '@nestjs/common';
import { TripRepository } from './infrastructure/trip.repository';

@Controller('trips')
export class TripController {
  constructor(private readonly tripRepository: TripRepository) {}

  @Get('active')
  async findActive() {
    return this.tripRepository.findActiveTripsWithStopTimes();
  }
}

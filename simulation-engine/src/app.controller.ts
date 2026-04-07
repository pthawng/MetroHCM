import { Controller, Get, Query } from '@nestjs/common';
import { SimulationService } from './services/simulation.service';
import { Trip } from './models/simulation.types';
import { TimeService } from './services/time.service';

@Controller('simulation')
export class AppController {
  constructor(
    private readonly simulationService: SimulationService,
    private readonly timeService: TimeService
  ) {}

  @Get('trains/positions')
  getPositions() {
    const mockTrip: Trip = {
      id: 'TRIP-01',
      lineId: 'LINE-1',
      stopTimes: [
        { stationId: 'S1', arrivalTime: this.timeService.getNowSeconds() - 100, departureTime: this.timeService.getNowSeconds() + 10 }, 
        { stationId: 'S2', arrivalTime: this.timeService.getNowSeconds() + 130, departureTime: this.timeService.getNowSeconds() + 160 }, 
        { stationId: 'S3', arrivalTime: this.timeService.getNowSeconds() + 260, departureTime: this.timeService.getNowSeconds() + 290 },
      ]
    };

    return [this.simulationService.getTrainPosition(mockTrip)];
  }

  // API ẩn dùng để tua nhanh thời gian test hệ thống (Fast Forward)
  @Get('time/config')
  setTimeConfig(@Query('multiplier') multiplier: string, @Query('offset') offset: string) {
    const mult = multiplier ? parseFloat(multiplier) : 1;
    const off = offset ? parseFloat(offset) : 0;
    this.timeService.setVirtualTimeConfig(mult, off);
    return { success: true, message: `Time config updated: speed x${mult}, offset ${off}s`, currentFakeTime: this.timeService.getNowSeconds() };
  }
}

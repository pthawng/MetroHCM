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
  async getPositions() {
    return this.simulationService.getActiveTrainPositions();
  }

  @Get('sync/stations')
  async syncStations() {
    await this.simulationService.syncStations();
    return { success: true };
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

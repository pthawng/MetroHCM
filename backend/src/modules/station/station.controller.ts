import { Controller, Get } from '@nestjs/common';
import { StationRepository } from './infrastructure/station.repository';

@Controller('stations')
export class StationController {
  constructor(private readonly stationRepository: StationRepository) {}

  @Get()
  async findAll() {
    return this.stationRepository.findAll();
  }
}

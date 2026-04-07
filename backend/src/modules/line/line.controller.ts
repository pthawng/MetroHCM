import { Controller, Get } from '@nestjs/common';
import { LineRepository } from './infrastructure/line.repository';

@Controller('lines')
export class LineController {
  constructor(private readonly lineRepository: LineRepository) {}

  @Get()
  async findAll() {
    return this.lineRepository.findAll();
  }
}

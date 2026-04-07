import { Controller, Get, Query } from '@nestjs/common';
import { SegmentRepository } from './infrastructure/segment.repository';

@Controller('segments')
export class SegmentController {
  constructor(private readonly segmentRepository: SegmentRepository) {}

  @Get()
  async findAll(@Query('lineId') lineId?: string) {
    if (lineId) {
      return this.segmentRepository.findByLineId(lineId);
    }
    return this.segmentRepository.findAll();
  }
}

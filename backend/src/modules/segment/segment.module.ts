import { Module } from '@nestjs/common';
import { SegmentRepository } from './infrastructure/segment.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [SegmentRepository],
  exports: [SegmentRepository],
})
export class SegmentModule {}

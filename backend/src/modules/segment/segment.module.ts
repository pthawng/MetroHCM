import { Module } from '@nestjs/common';
import { SegmentRepository } from './infrastructure/segment.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { SegmentController } from './segment.controller';

@Module({
  imports: [InfrastructureModule],
  providers: [SegmentRepository],
  controllers: [SegmentController],
  exports: [SegmentRepository],
})
export class SegmentModule {}

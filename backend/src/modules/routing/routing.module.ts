import { Module } from '@nestjs/common';
import { GraphBuilderService } from './application/graph-builder.service';
import { RoutingService } from './application/routing.service';
import { SegmentModule } from '../segment/segment.module';
import { TransferModule } from '../transfer/transfer.module';
import { StationModule } from '../station/station.module';
import { LineModule } from '../line/line.module';

@Module({
  imports: [StationModule, LineModule, SegmentModule, TransferModule],
  providers: [GraphBuilderService, RoutingService],
  exports: [RoutingService],
})
export class RoutingModule {}

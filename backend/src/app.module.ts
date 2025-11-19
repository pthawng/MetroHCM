import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { StationModule } from './modules/station/station.module';
import { LineModule } from './modules/line/line.module';
import { SegmentModule } from './modules/segment/segment.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { RoutingModule } from './modules/routing/routing.module';

@Module({
  imports: [
    InfrastructureModule,
    StationModule,
    LineModule,
    SegmentModule,
    TransferModule,
    RoutingModule,
  ],
})
export class AppModule {}

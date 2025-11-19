import { Module } from '@nestjs/common';
import { StationRepository } from './infrastructure/station.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [StationRepository],
  exports: [StationRepository],
})
export class StationModule {}

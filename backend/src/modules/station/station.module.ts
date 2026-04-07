import { Module } from '@nestjs/common';
import { StationRepository } from './infrastructure/station.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { StationController } from './station.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [StationController],
  providers: [StationRepository],
  exports: [StationRepository],
})
export class StationModule {}

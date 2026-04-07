import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripRepository } from './infrastructure/trip.repository';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  controllers: [TripController],
  providers: [TripRepository],
  exports: [TripRepository],
})
export class TripModule {}

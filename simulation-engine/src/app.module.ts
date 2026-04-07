import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SimulationService } from './services/simulation.service';
import { TimeService } from './services/time.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SimulationService, TimeService],
})
export class AppModule {}

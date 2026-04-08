import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { SimulationService } from './services/simulation.service';
import { TimeService } from './services/time.service';
import { BackendClientService } from './services/backend-client.service';
import { StateService } from './services/state.service';
import { SimulationGateway } from './gateways/simulation.gateway';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    TimeService, 
    BackendClientService, 
    StateService, 
    SimulationGateway,
    SimulationService
  ],
})
export class AppModule {}

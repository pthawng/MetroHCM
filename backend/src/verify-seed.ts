import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoutingService } from './modules/routing/application/routing.service';
import { StationRepository } from './modules/station/infrastructure/station.repository';

async function verify() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const routingService = app.get(RoutingService);
  const stationRepo = app.get(StationRepository);

  const stations = await stationRepo.findAll();
  console.log('Total stations:', stations.length);

  const bt = stations.find(s => s.code === 'BT');
  const bxmde = stations.find(s => s.code === 'BXMDE');

  if (bt && bxmde) {
    const path = await routingService.findPath(bt.id, bxmde.id);
    if (path) {
      console.log('Path found!');
      console.log('Total Duration:', path.totalDurationSec, 'seconds');
      console.log('Transfer Count:', path.transferCount);
    } else {
      console.log('Path NOT found!');
    }
  } else {
    console.log('Stations BT or BXMDE not found in DB!');
  }

  await app.close();
}

verify();

import { PrismaClient } from '@prisma/client';
import { activeLines } from './data';
import { fareData } from './data/fare.data';
import { transferData } from './data/transfer.data';
import { ITransitLine } from './types';

export type SeedMode = 'reset' | 'upsert';

export class SeedOrchestrator {
  constructor(private readonly prisma: PrismaClient) {}

  async run(mode: SeedMode) {
    console.log(`🚀 Starting seed in ${mode.toUpperCase()} mode...`);

    return await this.prisma.$transaction(async (tx) => {
      if (mode === 'reset') {
        await this.cleanDatabase(tx);
      }

      // 1. Seed Fare Zones & Rules
      await this.seedFare(tx);

      // 2. Iterate through Registered Lines
      for (const transitLine of activeLines) {
        console.log(`🚆 Seeding Line: ${transitLine.line.code} - ${transitLine.line.name}`);
        
        // 2.1 Seed Line
        const line = await tx.line.upsert({
          where: { code: transitLine.line.code },
          update: transitLine.line,
          create: transitLine.line,
        });

        // 2.2 Seed Stations and handle Ghost Object mitigation
        const stationMap = await this.seedStations(tx, line.id, transitLine);

        // 2.3 Seed Segments (Bi-directional)
        await this.seedSegments(tx, line.id, stationMap, transitLine);

        // 2.4 Seed Depot & Trains
        await this.seedTrains(tx, line.id, transitLine);

        // 2.5 Seed Trips & StopTimes
        await this.seedTrips(tx, line.id, stationMap, transitLine);
      }

      // 3. Seed Inter-line Transfers
      // We do this globally after all lines are loaded
      await this.seedTransfers(tx);

      console.log('✅ Seeding completed successfully.');
    }, {
      timeout: 60000, // Increased timeout to 60s for FAANG scale batch inserts
    });
  }

  private async cleanDatabase(tx: any) {
    console.log('🧹 Cleaning database...');
    await tx.routeSegment.deleteMany();
    await tx.route.deleteMany();
    await tx.stopTime.deleteMany();
    await tx.trip.deleteMany();
    await tx.schedule.deleteMany();
    await tx.transfer.deleteMany();
    await tx.segment.deleteMany();
    await tx.lineStation.deleteMany();
    await tx.train.deleteMany();
    await tx.depot.deleteMany();
    await tx.stationFareZone.deleteMany();
    await tx.fareRule.deleteMany();
    await tx.fareZone.deleteMany();
    await tx.station.deleteMany();
    await tx.line.deleteMany();
  }

  private async seedFare(tx: any) {
    await Promise.all(fareData.zones.map(zone => 
      tx.fareZone.upsert({
        where: { code: zone.code },
        update: zone,
        create: zone,
      })
    ));

    // Handle FareRule without @unique schema by checking first
    // Note: Concurrency here is okay because data boundaries are distinct per rule
    await Promise.all(fareData.rules.map(async (rule) => {
      const existingRule = await tx.fareRule.findFirst({ where: { name: rule.name } });
      if (existingRule) {
        return tx.fareRule.update({
          where: { id: existingRule.id },
          data: { basePrice: rule.price },
        });
      } else {
        return tx.fareRule.create({
          data: { name: rule.name, basePrice: rule.price },
        });
      }
    }));
  }

  private async seedStations(tx: any, lineId: string, transitLine: ITransitLine): Promise<Map<string, string>> {
    const stationMap = new Map<string, string>();
    const seenStationCodes = new Set<string>();

    // Concurrently upsert stations
    await Promise.all(transitLine.stations.map(async (s) => {
      seenStationCodes.add(s.code);
      const station = await tx.station.upsert({
        where: { code: s.code },
        update: { name: s.name, nameEn: s.nameEn, type: s.type, status: 'active' },
        create: { code: s.code, name: s.name, nameEn: s.nameEn, type: s.type, status: 'active' },
      });
      // 🚀 POSTGIS UPDATE
      await tx.$executeRaw`UPDATE stations SET location = ST_SetSRID(ST_MakePoint(${s.lng}, ${s.lat}), 4326) WHERE code = ${s.code}`;
      stationMap.set(s.code, station.id);

      await tx.lineStation.upsert({
        where: { lineId_stationId: { lineId, stationId: station.id } },
        update: { sequenceOrder: s.sequence, kmFromStart: s.km },
        create: { lineId, stationId: station.id, sequenceOrder: s.sequence, kmFromStart: s.km },
      });
    }));

    // GHOST OBJECT MITIGATION: Find stations previously associated with this line but no longer in the seed file
    const existingLineStations = await tx.lineStation.findMany({
      where: { lineId },
      include: { station: true },
    });

    const ghostStations = existingLineStations.filter(
      (ls: any) => !seenStationCodes.has(ls.station.code)
    );

    // Soft delete ghost stations
    if (ghostStations.length > 0) {
      await Promise.all(ghostStations.map((ghost: any) => 
        tx.station.update({
          where: { id: ghost.station.id },
          data: { status: 'closed' } // Soft Delete
        })
      ));
      console.log(`👻 Soft deleted ${ghostStations.length} ghost stations for line ${transitLine.line.code}`);
    }

    return stationMap;
  }

  private async seedSegments(tx: any, lineId: string, stationMap: Map<string, string>, transitLine: ITransitLine) {
    const stations = transitLine.stations;
    const segmentsToUpsert = [];

    for (let i = 0; i < stations.length - 1; i++) {
      const from = stations[i];
      const to = stations[i + 1];
      const fromId = stationMap.get(from.code)!;
      const toId = stationMap.get(to.code)!;
      const distance = to.km - from.km;
      const time = Math.round(distance * 120); 

      // Push Forward direction
      segmentsToUpsert.push(
        tx.segment.upsert({
          where: { lineId_fromStationId_toStationId: { lineId, fromStationId: fromId, toStationId: toId } },
          update: { distanceKm: distance, travelTimeSec: time },
          create: { lineId, fromStationId: fromId, toStationId: toId, distanceKm: distance, travelTimeSec: time },
        })
      );

      // Push Backward direction
      segmentsToUpsert.push(
        tx.segment.upsert({
          where: { lineId_fromStationId_toStationId: { lineId, fromStationId: toId, toStationId: fromId } },
          update: { distanceKm: distance, travelTimeSec: time },
          create: { lineId, fromStationId: toId, toStationId: fromId, distanceKm: distance, travelTimeSec: time },
        })
      );
    }
    
    // Concurrently execute segment upserts
    await Promise.all(segmentsToUpsert);
  }

  private async seedTrains(tx: any, lineId: string, transitLine: ITransitLine) {
    // Upsert Depots
    await Promise.all(transitLine.depots.map(async (depotData) => {
      const depot = await tx.depot.upsert({
        where: { code: depotData.code },
        update: { capacity: depotData.capacity },
        create: { code: depotData.code, name: depotData.name, capacity: depotData.capacity, lineId },
      });
      // 🚀 POSTGIS UPDATE
      if (depotData.lng && depotData.lat) {
        await tx.$executeRaw`UPDATE depots SET location = ST_SetSRID(ST_MakePoint(${depotData.lng}, ${depotData.lat}), 4326) WHERE code = ${depotData.code}`;
      }

      // Upsert Trains concurrent batch
      await Promise.all(transitLine.trains.map(t => 
        tx.train.upsert({
          where: { code: t.code },
          update: { carCount: t.carCount, capacityPerCar: t.capacityPerCar, depotId: depot.id, status: t.status },
          create: { code: t.code, lineId, depotId: depot.id, carCount: t.carCount, capacityPerCar: t.capacityPerCar, status: t.status },
        })
      ));
    }));
  }

  private async seedTransfers(tx: any) {
    // Optional: Seed mock Line 2 if it doesn't exist for transferring
    await tx.line.upsert({
      where: { code: 'L2' },
      update: {},
      create: { code: 'L2', name: 'Tuyến số 2 (Dự kiến)', color: '#FF0000' },
    });

    const stationRows = await tx.station.findMany({ select: { id: true, code: true } });
    const lineRows = await tx.line.findMany({ select: { id: true, code: true } });
    
    const stationIdByCode = new Map(stationRows.map((r: any) => [r.code, r.id]));
    const lineIdByCode = new Map(lineRows.map((r: any) => [r.code, r.id]));

    await Promise.all(transferData.map(async (t) => {
      const fromStationId = stationIdByCode.get(t.fromStationCode);
      const toStationId = stationIdByCode.get(t.toStationCode);
      const fromLineId = lineIdByCode.get(t.fromLineCode);
      const toLineId = lineIdByCode.get(t.toLineCode);
      
      if (fromStationId && toStationId && fromLineId && toLineId) {
        await tx.transfer.upsert({
          where: {
            fromStationId_toStationId_fromLineId_toLineId: {
              fromStationId,
              toStationId,
              fromLineId,
              toLineId,
            }
          },
          update: { walkingTimeSec: t.walkingTimeSec, walkingDistanceM: t.walkingDistanceM },
          create: {
            fromStationId,
            toStationId,
            fromLineId,
            toLineId,
            walkingTimeSec: t.walkingTimeSec,
            walkingDistanceM: t.walkingDistanceM,
            transferType: t.type,
          },
        });
      }
    }));
  }

  private async seedTrips(tx: any, lineId: string, stationMap: Map<string, string>, transitLine: ITransitLine) {
    const activeTrains = await tx.train.findMany({
      where: { lineId, status: 'active' },
      take: 9,
    });

    console.log(`🔍 Found ${activeTrains.length} active trains for line ${lineId}`);
    if (activeTrains.length === 0) {
      console.warn('⚠️ No active trains found. Skipping trip seeding!');
      return;
    }

    // Create a default schedule for today
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const schedule = await tx.schedule.create({
      data: {
        lineId,
        name: `Lịch trình ngày ${todayStr}`,
        dayType: 'weekday',
        headwayPeakSec: 300,
        headwayOffpeakSec: 600,
        firstDeparture: new Date(`${todayStr}T06:00:00Z`),
        lastDeparture: new Date(`${todayStr}T23:00:00Z`),
        effectiveFrom: new Date(`${todayStr}T00:00:00Z`),
      },
    });
    console.log(`📅 Created schedule: ${schedule.id}`);

    const stations = transitLine.stations; // Bến Thành -> Suối Tiên
    const stationsReverse = [...stations].reverse(); // Suối Tiên -> Bến Thành

    // Split 9 trains: 5 forward, 4 backward
    for (let i = 0; i < activeTrains.length; i++) {
      const train = activeTrains[i];
      const directionValue = i < 5 ? 0 : 1; // 0: Forward, 1: Backward
      const routeStations = directionValue === 0 ? stations : stationsReverse;
      
      for (let runIndex = 0; runIndex < 10; runIndex++) {
        // Start time: 6:00 AM + staggered offset (15 mins each) + 90 mins per trip cycle
        const startTime = new Date(`${todayStr}T06:00:00Z`);
        startTime.setMinutes(startTime.getMinutes() + i * 15 + runIndex * 90);

        const trip = await tx.trip.create({
          data: {
            lineId,
            trainId: train.id,
            scheduleId: schedule.id,
            status: 'active',
            direction: directionValue,
            serviceDate: new Date(`${todayStr}T00:00:00Z`),
            plannedDepartureAt: startTime,
          },
        });

        let currentTime = new Date(startTime);
        const stopTimesData = [];

        for (let j = 0; j < routeStations.length; j++) {
          const sData = routeStations[j];
          const stationId = stationMap.get(sData.code)!;
          
          // Travel time from previous station
          if (j > 0) {
            const prevSData = routeStations[j - 1];
            const dist = Math.abs(sData.km - prevSData.km);
            const travelSec = Math.round((dist / 35) * 3600); // 35km/h
            currentTime = new Date(currentTime.getTime() + travelSec * 1000);
          }

          const arrivalTime = new Date(currentTime);
          // Dwell time: 30 seconds (except for last station)
          const dwellSec = j === routeStations.length - 1 ? 0 : 30;
          const departureTime = new Date(currentTime.getTime() + dwellSec * 1000);
          
          stopTimesData.push({
            tripId: trip.id,
            stationId,
            sequenceOrder: j + 1,
            plannedArrivalAt: arrivalTime,
            plannedDepartureAt: departureTime,
          });

          currentTime = departureTime;
        }

        await tx.stopTime.createMany({ data: stopTimesData });
      }
    }
    
    console.log(`✅ Seeded ${activeTrains.length * 10} active trips for Line 1 (Bidirectional)`);
  }
}

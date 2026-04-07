import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class TripRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveTripsWithStopTimes() {
    const activeTrips = await this.prisma.trip.findMany({
      where: {
        status: 'active',
      },
      include: {
        stopTimes: {
          orderBy: { sequenceOrder: 'asc' },
        },
      },
    });

    if (activeTrips.length > 0) return activeTrips;

    // 🚀 MOCK Fallback: Nếu DB trống, tự tạo 1 chuyến ảo dựa trên thời gian thực để test
    const stations = await this.prisma.station.findMany({ 
      orderBy: { code: 'asc' },
      take: 3 
    });
    
    if (stations.length < 2) return [];

    const now = new Date();
    return [{
      id: 'MOCK-TRIP-AUTO',
      lineId: 'L1',
      status: 'active',
      stopTimes: [
        { 
          stationId: stations[0].id, 
          plannedArrivalAt: new Date(now.getTime() - 100000), 
          plannedDepartureAt: new Date(now.getTime() + 10000) 
        },
        { 
          stationId: stations[1].id, 
          plannedArrivalAt: new Date(now.getTime() + 130000), 
          plannedDepartureAt: new Date(now.getTime() + 160000) 
        },
        { 
          stationId: stations[2]?.id || stations[1].id, 
          plannedArrivalAt: new Date(now.getTime() + 260000), 
          plannedDepartureAt: new Date(now.getTime() + 290000) 
        },
      ]
    }];
  }
}

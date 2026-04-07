import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { Station } from '../domain/station.entity';
import { StationStatus, StationType } from '../../../shared/types';

@Injectable()
export class StationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Station | null> {
    const stations = await this.prisma.$queryRaw<any[]>`
      SELECT 
        id, code, name, "name_en", address, type, 
        "has_elevator", "has_parking", status, 
        "created_at", "updated_at",
        ST_Y(location::geometry) as lat, 
        ST_X(location::geometry) as lng 
      FROM stations 
      WHERE id = ${id}::uuid
    `;
    if (!stations || stations.length === 0) return null;
    return this.mapToDomain(stations[0]);
  }

  async findAll(): Promise<Station[]> {
    const stations = await this.prisma.$queryRaw<any[]>`
      SELECT 
        id, code, name, "name_en", address, type, 
        "has_elevator", "has_parking", status, 
        "created_at", "updated_at",
        ST_Y(location::geometry) as lat, 
        ST_X(location::geometry) as lng 
      FROM stations
    `;
    return stations.map(s => this.mapToDomain(s));
  }

  private mapToDomain(station: any): Station {
    return {
      id: station.id,
      code: station.code,
      name: station.name,
      nameEn: station.nameEn || station.name_en,
      lat: station.lat,
      lng: station.lng,
      address: station.address,
      type: station.type as StationType,
      hasElevator: station.hasElevator,
      hasParking: station.hasParking,
      status: station.status as StationStatus,
      createdAt: station.createdAt || station.created_at,
      updatedAt: station.updatedAt || station.updated_at,
    };
  }
}

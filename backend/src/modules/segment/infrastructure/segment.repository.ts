import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { Segment } from '../domain/segment.entity';

@Injectable()
export class SegmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByLineId(lineId: string): Promise<Segment[]> {
    const segments = await this.prisma.$queryRaw<any[]>`
      SELECT 
        id, line_id as "lineId", from_station_id as "fromStationId", to_station_id as "toStationId", 
        distance_km as "distanceKm", travel_time_sec as "travelTimeSec", max_speed_kmh as "maxSpeedKmh", 
        track_type as "trackType", created_at as "createdAt",
        ST_AsGeoJSON(geometry)::json as geometry
      FROM segments
      WHERE line_id = ${lineId}::uuid
    `;
    return segments.map(this.mapToDomain);
  }

  async findAll(): Promise<Segment[]> {
    const segments = await this.prisma.$queryRaw<any[]>`
      SELECT 
        id, line_id as "lineId", from_station_id as "fromStationId", to_station_id as "toStationId", 
        distance_km as "distanceKm", travel_time_sec as "travelTimeSec", max_speed_kmh as "maxSpeedKmh", 
        track_type as "trackType", created_at as "createdAt",
        ST_AsGeoJSON(geometry)::json as geometry
      FROM segments
    `;
    return segments.map(this.mapToDomain);
  }

  private mapToDomain(segment: any): Segment {
    return {
      id: segment.id,
      lineId: segment.lineId,
      fromStationId: segment.fromStationId,
      toStationId: segment.toStationId,
      distanceKm: segment.distanceKm,
      travelTimeSec: segment.travelTimeSec,
      maxSpeedKmh: segment.maxSpeedKmh,
      trackType: segment.trackType,
      createdAt: segment.createdAt,
      geometry: segment.geometry?.coordinates,
    } as Segment;
  }
}

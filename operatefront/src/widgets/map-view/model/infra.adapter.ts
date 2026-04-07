import type { FeatureCollection, LineString, Point } from 'geojson';
import { type Station, type Segment } from '../../../entities/infra/model/types';

export function toLineGeoJSON(segments: Record<string, Segment>): FeatureCollection<LineString> {
  const features = Object.values(segments).map((seg) => ({
    type: 'Feature' as const,
    properties: {
      id: seg.id,
      lineId: seg.lineId,
    },
    geometry: {
      type: 'LineString' as const,
      coordinates: seg.geometry || [], // Backend provides [lng, lat][]
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
  };
}

export function toStationGeoJSON(stations: Record<string, Station>): FeatureCollection<Point> {
  const features = Object.values(stations).map((s) => ({
    type: 'Feature' as const,
    properties: {
      id: s.id,
      code: s.code,
      name: s.name,
      type: s.type,
    },
    geometry: {
      type: 'Point' as const,
      coordinates: [s.lng, s.lat],
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
  };
}

import type { FeatureCollection } from 'geojson';
import type { Position } from '../../../features/realtime-tracking/model/interpolationEngine';
import type { Train } from '../../../entities/infra/model/types';

export function toGeoJSON(
  trains: Record<string, Position>,
  trainsMeta: Record<string, Train> = {}
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: Object.values(trains).map((pos) => {
      const meta = trainsMeta[pos.id];
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [pos.lng, pos.lat],
        },
        properties: {
          id: pos.id,
          lineId: pos.lineId,
          heading: pos.heading,
          carCount: meta?.carCount || 3, // Default to 3 for fallback
        },
      };
    }),
  };
}

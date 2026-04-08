import type { FeatureCollection, Feature, Point } from 'geojson';
import type { Position } from '../../../features/realtime-tracking/model/interpolationEngine';
import type { Train } from '../../../entities/infra/model/types';

/**
 * High-performance GeoJSON updater.
 * Mutates an existing FeatureCollection to avoid GC thrashing.
 */
export function updateGeoJSON(
  existing: FeatureCollection,
  trains: Record<string, Position>,
  trainsMeta: Record<string, Train> = {}
): FeatureCollection {
  const trainIds = Object.keys(trains);
  
  // 1. Sync length of features array
  if (existing.features.length !== trainIds.length) {
    if (existing.features.length < trainIds.length) {
      // Grow pool
      for (let i = existing.features.length; i < trainIds.length; i++) {
        existing.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: {},
        });
      }
    } else {
      // Shrink pool
      existing.features.length = trainIds.length;
    }
  }

  // 2. In-place update
  trainIds.forEach((id, index) => {
    const pos = trains[id];
    const meta = trainsMeta[pos.trainId];
    const feature = existing.features[index] as Feature<Point>;
    
    // Mutate geometry
    feature.geometry.coordinates[0] = pos.lng;
    feature.geometry.coordinates[1] = pos.lat;
    
    // Mutate properties (don't recreate the object if possible)
    const props = feature.properties!;
    props.id = pos.trainId; // Use Train ID as the identifying prop
    props.code = meta?.code || pos.id.substring(0, 4);
    props.lineId = pos.lineId;
    props.heading = pos.heading;
    props.carCount = meta?.carCount || 3;
    props.status = meta?.status || 'active';
  });

  return existing;
}

/**
 * Initial empty collection
 */
export function createEmptyFeatureCollection(): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

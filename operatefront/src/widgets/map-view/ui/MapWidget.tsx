import React, { useEffect, useRef, useMemo, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getInterpolatedState } from '../../../features/realtime-tracking/model/interpolationEngine';
import { updateGeoJSON, createEmptyFeatureCollection } from '../model/geojson.adapter';
import { metrics } from '../../../shared/lib/metrics';
import { useInfraStore } from '../../../entities/infra/store/infraStore';
import { toLineGeoJSON, toStationGeoJSON } from '../model/infra.adapter';
import { useFilterStore } from '../../../features/alert-system/store/filterStore';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// --- Elite SVG Iconography ---
const SVG_METRO_UNDERGROUND = `data:image/svg+xml;base64,${btoa(`
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="white" stroke-width="4" fill="#020617" />
    <path d="M14 34V14L24 24L34 14V34" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`)}`;

const SVG_METRO_ELEVATED = `data:image/svg+xml;base64,${btoa(`
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="40" height="40" rx="8" stroke="white" stroke-width="4" fill="#020617" />
    <path d="M14 34V14L24 24L34 14V34" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`)}`;

const SVG_METRO_TRAIN = `data:image/svg+xml;base64,${btoa(`
  <svg width="64" height="128" viewBox="0 0 64 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 110C12 115.523 16.4772 120 22 120H42C47.5228 120 52 115.523 52 110V30C52 15 42 4 32 4C22 4 12 15 12 30V110Z" fill="white" stroke="#020617" stroke-width="2"/>
    <rect x="20" y="20" width="24" height="12" rx="2" fill="#020617" />
  </svg>
`)}`;

export const MapWidget: React.FC = () => {
  const mapRef = useRef<MapRef | null>(null);
  const rafRef = useRef<number | null>(null);
  const [iconsLoaded, setIconsLoaded] = useState(false);
  
  const trainGeoJsonRef = useRef(createEmptyFeatureCollection());
  const { status, stations, segments, trains, fetchInfra } = useInfraStore();
  const { statusFilter } = useFilterStore();

  useEffect(() => {
    fetchInfra();
  }, []);

  const lineData = useMemo(() => toLineGeoJSON(segments), [segments]);
  const stationData = useMemo(() => toStationGeoJSON(stations), [stations]);

  const onMapLoad = async () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const loadIcon = (id: string, url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!map.hasImage(id)) map.addImage(id, img);
          resolve();
        };
        img.src = url;
      });
    };

    await Promise.all([
      loadIcon('st-underground', SVG_METRO_UNDERGROUND),
      loadIcon('st-elevated', SVG_METRO_ELEVATED),
      loadIcon('train-icon', SVG_METRO_TRAIN),
    ]);

    setIconsLoaded(true);
  };

  useEffect(() => {
    const tick = () => {
      metrics.tickFps();
      const map = mapRef.current?.getMap();
      if (map && map.isStyleLoaded() && status === 'ready' && iconsLoaded) {
        const source = map.getSource('trains') as mapboxgl.GeoJSONSource;
        if (source) {
          const interpolatedState = getInterpolatedState();
          
          // Apply status filters to map visualization
          const filteredState: Record<string, any> = {};
          for (const id in interpolatedState) {
            const pos = interpolatedState[id];
            const train = trains[id];
            if (statusFilter === 'all' || (statusFilter === 'delayed' && train?.status === 'delayed')) {
              filteredState[id] = pos;
            }
          }

          const geoJson = updateGeoJSON(trainGeoJsonRef.current, filteredState, trains);
          source.setData(geoJson as any); 
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [status, trains, iconsLoaded, statusFilter]);

  if (status === 'loading') return null; // Handled by Dashboard background

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        initialViewState={{ longitude: 106.74, latitude: 10.82, zoom: 11.5 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Elite Route Rendering */}
        <Source id="metro-infra-path" type="geojson" data={lineData}>
          <Layer
            id="infra-line-layer"
            type="line"
            paint={{
              'line-color': '#0ea5e9',
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 14, 4],
              'line-opacity': 0.3,
            }}
          />
          <Layer
            id="infra-line-glow"
            type="line"
            paint={{
              'line-color': '#0ea5e9',
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 14, 12],
              'line-blur': 8,
              'line-opacity': 0.1,
            }}
          />
        </Source>
        
        {iconsLoaded && (
          <>
            <Source id="metro-infra-stations" type="geojson" data={stationData}>
              <Layer
                id="infra-station-icons"
                type="symbol"
                layout={{
                  'icon-image': ['match', ['get', 'type'], 'underground', 'st-underground', 'elevated', 'st-elevated', 'st-underground'],
                  'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.3, 15, 0.6],
                  'icon-allow-overlap': true,
                  'text-field': ['get', 'name'],
                  'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
                  'text-size': 10,
                  'text-offset': [0, 1.5],
                  'text-anchor': 'top',
                }}
                paint={{
                  'text-color': '#ffffff',
                  'text-opacity': ['interpolate', ['linear'], ['zoom'], 11, 0, 12, 1],
                  'text-halo-color': '#020617',
                  'text-halo-width': 1
                }}
              />
            </Source>

            <Source id="trains" type="geojson" data={trainGeoJsonRef.current}>
              <Layer
                id="trains-layer"
                type="symbol"
                layout={{
                  'icon-image': 'train-icon',
                  'icon-size': 0.3,
                  'icon-rotate': ['get', 'heading'],
                  'icon-rotation-alignment': 'map',
                  'icon-allow-overlap': true,
                  'text-field': ['get', 'code'], 
                  'text-size': 9,
                  'text-offset': [0, 2.8],
                  'text-anchor': 'top',
                  'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold']
                }}
                paint={{
                  'text-color': [
                    'match',
                    ['get', 'status'],
                    'delayed', '#f59e0b',
                    'stopped', '#ef4444',
                    '#ffffff'
                  ],
                  'text-halo-color': '#020617',
                  'text-halo-width': 1.5,
                  'icon-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 12, 1],
                }}
              />
            </Source>
          </>
        )}
      </Map>
    </div>
  );
};

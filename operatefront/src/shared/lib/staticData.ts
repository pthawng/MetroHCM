import type { FeatureCollection, LineString, Point } from 'geojson';

export const stationsData = [
  { code: 'BT', name: 'Bến Thành', lat: 10.7712, lng: 106.6981 },
  { code: 'NHTP', name: 'Nhà hát TP', lat: 10.7766, lng: 106.7032 },
  { code: 'BS', name: 'Ba Son', lat: 10.7818, lng: 106.7077 },
  { code: 'TC', name: 'Tân Cảng', lat: 10.7935, lng: 106.7210 },
  { code: 'TD', name: 'Thảo Điền', lat: 10.8015, lng: 106.7305 },
  { code: 'AP', name: 'An Phú', lat: 10.8068, lng: 106.7402 },
  { code: 'RC', name: 'Rạch Chiếc', lat: 10.8165, lng: 106.7538 },
  { code: 'PL', name: 'Phước Long', lat: 10.8245, lng: 106.7645 },
  { code: 'BTH', name: 'Bình Thái', lat: 10.8305, lng: 106.7725 },
  { code: 'TDU', name: 'Thủ Đức', lat: 10.8425, lng: 106.7845 },
  { code: 'KCNC', name: 'Khu CNC', lat: 10.8545, lng: 106.7965 },
  { code: 'DHQG', name: 'Đại học QG', lat: 10.8655, lng: 106.8075 },
  { code: 'ST', name: 'Suối Tiên', lat: 10.8755, lng: 106.8175 },
  { code: 'BXMDE', name: 'Bến xe Miền Đông', lat: 10.8855, lng: 106.8275 },
];

export const stationsGeoJson: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: stationsData.map(s => ({
    type: 'Feature',
    properties: { code: s.code, name: s.name },
    geometry: { type: 'Point', coordinates: [s.lng, s.lat] }
  }))
};

export const line1GeoJson: FeatureCollection<LineString> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { code: 'L1', name: 'Line 1', color: '#005596' },
      geometry: { type: 'LineString', coordinates: stationsData.map(s => [s.lng, s.lat]) }
    }
  ]
};

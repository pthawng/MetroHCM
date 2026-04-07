import React from 'react';
import { MapWidget } from '../../widgets/map-view/ui/MapWidget';
import { MetricsPanel } from '../../widgets/map-view/ui/MetricsPanel';
import { TrainListPanel } from '../../widgets/train-panel/ui/TrainListPanel';
import { SocketProvider } from '../../app/providers/SocketProvider';

export const Dashboard = () => {
  return (
    <SocketProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
        {/* Mapbox is the base layer (z-index 0) */}
        <MapWidget />
        
        {/* Pure CSS Overlays (z-index 100) */}
        <TrainListPanel />
        <MetricsPanel />
      </div>
    </SocketProvider>
  );
};

import { MapWidget } from '../../widgets/map-view/ui/MapWidget';
import { MetricsPanel } from '../../widgets/map-view/ui/MetricsPanel';
import { TrainListPanel } from '../../widgets/train-panel/ui/TrainListPanel';
import { GlobalStatusBar } from '../../widgets/global-status/ui/GlobalStatusBar';
import { AlertPanel } from '../../widgets/alert-panel/ui/AlertPanel';
import { SocketProvider } from '../../app/providers/SocketProvider';
import { StressTest } from '../../shared/lib/StressTest';
import { LoginOverlay } from '../../features/operator-id/ui/LoginOverlay';

export const Dashboard = () => {
  return (
    <SocketProvider>
      <LoginOverlay />
      
      <main className="mission-control-root" style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        position: 'relative',
        background: '#000' /* True deep background for map transparency */
      }}>
        {/* Layer 0: Map Base */}
        <MapWidget />

        {/* Layer 1: Global SitRep (Top) */}
        <GlobalStatusBar />

        {/* Layer 2: Mission Overlays (HUD) */}
        <div className="hud-layer">
          <AlertPanel />
          <TrainListPanel />
          <MetricsPanel />
        </div>

        {/* Layer 3: Engineering / Dev Tools */}
        <StressTest />
      </main>
    </SocketProvider>
  );
};

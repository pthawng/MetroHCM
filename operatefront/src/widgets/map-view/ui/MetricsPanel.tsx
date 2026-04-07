import { useEffect, useState } from 'react';
import { metrics } from '../../../shared/lib/metrics';

export const MetricsPanel = () => {
  const [currentMetrics, setCurrentMetrics] = useState(metrics.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetrics(metrics.getMetrics());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      padding: '16px',
      borderRadius: '8px',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 1000,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#ffcc00' }}>System Metrics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
        <span>FPS:</span> <strong>{currentMetrics.fps}</strong>
        <span>Dropped:</span> <strong>{currentMetrics.droppedFrames}</strong>
        <span>Latency:</span> <strong>{currentMetrics.updateLatency.toFixed(1)}ms</strong>
        <span>Invalid:</span> <strong style={{ color: currentMetrics.invalidPayloads > 0 ? '#ff4444' : 'inherit'}}>{currentMetrics.invalidPayloads}</strong>
      </div>
    </div>
  );
};

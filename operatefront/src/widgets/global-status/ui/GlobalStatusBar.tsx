import React, { useEffect, useState, useMemo } from 'react';
import { HealthEngine } from '../../../shared/lib/HealthEngine';
import { useTrainStore } from '../../../entities/train/store/trainStore';
import { useAlertStore } from '../../../features/alert-system/store/alertStore';
import { Badge } from '../../../shared/ui/Badge/Badge';
import { useOperatorStore } from '../../../features/operator-id/store/operatorStore';
import { getLatencyMetrics } from '../../../features/realtime-tracking/model/interpolationEngine';
import './GlobalStatusBar.css';

export const GlobalStatusBar: React.FC = () => {
  const trainsMap = useTrainStore(state => state.trains);
  const trains = useMemo(() => Object.values(trainsMap), [trainsMap]);
  const alerts = useAlertStore(state => state.alerts);
  const activeOperator = useOperatorStore(state => state.activeOperator);
  const [time, setTime] = useState(new Date());
  const [latency, setLatency] = useState(getLatencyMetrics());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const latentTimer = setInterval(() => setLatency(getLatencyMetrics()), 2000);
    return () => {
      clearInterval(timer);
      clearInterval(latentTimer);
    };
  }, []);

  const health = useMemo(() => {
    const criticalIncidents = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;
    const warningIncidents = alerts.filter(a => a.severity === 'warning' && !a.resolved).length;
    
    return HealthEngine.evaluate(trains, {
      criticalIncidents,
      warningIncidents
    });
  }, [trains, alerts]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL': return <Badge variant="error" dot>Critical Failure</Badge>;
      case 'DEGRADED': return <Badge variant="warning" dot>Degraded Ops</Badge>;
      default: return <Badge variant="success" dot>Normal Ops</Badge>;
    }
  };

  return (
    <div className={`global-status-bar glass status-${health.status.toLowerCase()}`}>
      <div className="status-left">
        <div className="system-logo">METRO-OPS</div>
        <div className="divider" />
        {getStatusBadge(health.status)}
      </div>

      <div className="status-center">
        <div className="metric-group">
          <span className="label">Active Units</span>
          <span className="value">{health.totalActive}</span>
        </div>
        <div className="metric-group">
          <span className="label">Delayed</span>
          <span className={`value ${health.delayedCount > 0 ? 'text-warning' : ''}`}>
            {health.delayedCount}
          </span>
        </div>
        <div className="metric-group">
          <span className="label">Incidents</span>
          <span className={`value ${health.criticalIncidentCount > 0 ? 'text-error' : ''}`}>
            {health.criticalIncidentCount + health.warningIncidentCount}
          </span>
        </div>
      </div>

      <div className="status-right">
        <div className="network-metrics">
          <span className="label">Jitter Buffer</span>
          <span className="value">{Math.round(latency.currentDelay)}ms</span>
        </div>
        <div className="divider" />
        <div className="operator-display">
          <span className="op-id">{activeOperator?.id}</span>
          <span className="op-name">{activeOperator?.name}</span>
        </div>
        <div className="divider" />
        <div className="clock">
          {time.toLocaleTimeString('en-GB', { hour12: false })}
          <span className="timezone">UTC+7</span>
        </div>
      </div>
    </div>
  );
};

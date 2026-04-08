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

  return (
    <div className={`sitrep-bar glass ${health.status.toLowerCase()}`}>
      {/* Top Edge Health Indicator */}
      <div className={`health-line ${health.status.toLowerCase()}`} />

      <div className="sitrep-left">
        <span className="system-monogram">MTS</span>
        <div className="sitrep-divider" />
        <Badge variant={health.status === 'NORMAL' ? 'success' : health.status === 'DEGRADED' ? 'warning' : 'error'} dot>
          {health.status}
        </Badge>
      </div>

      <div className="sitrep-center">
        <div className="sitrep-metric">
          <span className="label">ACTIVE</span>
          <span className="value">{health.totalActive}</span>
        </div>
        <div className="sitrep-divider" />
        <div className="sitrep-metric">
          <span className="label">DELAYED</span>
          <span className={`value ${health.delayedCount > 0 ? 'text-warning' : ''}`}>{health.delayedCount}</span>
        </div>
        <div className="sitrep-divider" />
        <div className="sitrep-metric">
          <span className="label">INCIDENTS</span>
          <span className={`value ${health.criticalIncidentCount > 0 ? 'text-error' : ''}`}>
            {health.criticalIncidentCount + health.warningIncidentCount}
          </span>
        </div>
      </div>

      <div className="sitrep-right">
        <div className="sitrep-network">
          <span className="label">JITTER</span>
          <span className="value">{Math.round(latency.currentDelay)}ms</span>
        </div>
        
        <div className="sitrep-divider" />

        <div className="sitrep-operator" title={activeOperator?.role}>
          <span className="op-id">{activeOperator?.id}</span>
          <span className="op-name">{activeOperator?.name.split(' ')[0]}</span>
        </div>

        <div className="sitrep-clock">
          <span className="time">{time.toLocaleTimeString('en-GB', { hour12: false })}</span>
        </div>
      </div>
    </div>
  );
};

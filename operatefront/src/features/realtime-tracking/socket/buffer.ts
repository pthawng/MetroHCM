import { metrics } from '../../../shared/lib/metrics';
import { type TrainPayload } from '../../../entities/train/model/schema';
import { useTrainStore } from '../../../entities/train/store/trainStore';
import { updateInterpolationTarget } from '../model/interpolationEngine';
import { useAlertStore } from '../../alert-system/store/alertStore';
import { z } from 'zod';

// Buffer variables
let incomingBuffer: Record<string, TrainPayload> = {};
let lastStoreSync = performance.now();
const STORE_SYNC_INTERVAL_MS = 1000;

// Anti-fatigue / Cooldown logic
const cooldowns: Record<string, number> = {};
const MIN_ALERT_INTERVAL = 5000; // 5s

const RawSocketTrainSchema = z.object({
  tripId: z.string(),
  trainId: z.string(),
  lineId: z.string(),
  status: z.enum(['MOVING', 'STOPPED', 'OFFLINE']),
  position: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  delaySeconds: z.number().optional(),
  direction: z.string().optional(),
});

const TelemetryBundleSchema = z.object({
  v: z.number(),
  ts: z.number(), // Server timestamp
  trains: z.array(RawSocketTrainSchema)
});

const SnapshotSchema = z.object({
  v: z.number(),
  ts: z.number(),
  state: z.array(RawSocketTrainSchema)
});

let currentVersion = 0;

export function processSnapshot(raw: unknown) {
  const result = SnapshotSchema.safeParse(raw);
  if (!result.success) return;
  
  currentVersion = result.data.v;
  // Clear buffer and apply full state
  incomingBuffer = {};
  processRawList(result.data.state, Date.now() - result.data.ts);
}

export function processSocketPayload(rawPayload: unknown) {
  const result = TelemetryBundleSchema.safeParse(rawPayload);
  
  if (!result.success) {
    metrics.recordInvalidPayload();
    return;
  }

  const { v, ts, trains } = result.data;

  // Elite Guard: Discard old packets
  if (v < currentVersion) {
    metrics.recordDroppedFrame();
    return;
  }
  currentVersion = v;

  const latency = Date.now() - ts;
  processRawList(trains, latency);
}

function processRawList(rawList: any[], latency: number) {
  const payloads: TrainPayload[] = rawList
    .filter(p => p.position !== null)
    .map(p => ({
      version: 'v1' as const,
      id: p.tripId,
      trainId: p.trainId,
      lineId: p.lineId,
      status: (p.delaySeconds || 0) > 60 ? 'delayed' : (p.status === 'MOVING' ? 'active' : p.status === 'STOPPED' ? 'stopped' : 'maintenance'),
      location: p.position!,
      speed: 0,
      heading: 0,
      timestamp: performance.now(),
      delaySeconds: p.delaySeconds,
      direction: p.direction,
    }));

  for (const payload of payloads) {
    detectStateChanges(payload);
    incomingBuffer[payload.id] = payload;
    updateInterpolationTarget(payload, latency);
  }
}

function detectStateChanges(newPayload: TrainPayload) {
  const previous = useTrainStore.getState().trains[newPayload.id];
  if (!previous) return;

  const now = Date.now();
  const lastAlert = cooldowns[newPayload.id] || 0;
  
  if (now - lastAlert < MIN_ALERT_INTERVAL) return;

  // 1. Critical Delay Detection
  if (newPayload.status === 'delayed' && previous.status !== 'delayed') {
    useAlertStore.getState().addAlert({
      trainId: newPayload.id,
      type: 'DELAY_START',
      message: `Train ${newPayload.id.substring(0,6)} is now DELAYED (+${newPayload.delaySeconds}s)`,
      severity: (newPayload.delaySeconds || 0) > 120 ? 'critical' : 'warning',
    });
    cooldowns[newPayload.id] = now;
  }

  // 2. Status Change Detection (Stopped in tunnel etc)
  if (newPayload.status === 'stopped' && previous.status === 'active') {
    useAlertStore.getState().addAlert({
      trainId: newPayload.id,
      type: 'UNEXPECTED_STOP',
      message: `Train ${newPayload.id.substring(0,6)} has STOPPED unexpectedly`,
      severity: 'warning',
    });
    cooldowns[newPayload.id] = now;
  }
}

export function startBufferFlushLoop() {
  const tick = () => {
    let now = performance.now();
    if (now - lastStoreSync >= STORE_SYNC_INTERVAL_MS) {
      const trainsToUpdate = Object.keys(incomingBuffer);
      if (trainsToUpdate.length > 0) {
        const clientTimestamp = Date.now();
        const storeUpdates = Object.fromEntries(
          Object.values(incomingBuffer).map((t) => [
            t.id, 
            { ...t, lastUpdatedClient: clientTimestamp }
          ])
        );
        useTrainStore.getState().batchUpdate(storeUpdates);
        incomingBuffer = {};
      }
      lastStoreSync = now;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

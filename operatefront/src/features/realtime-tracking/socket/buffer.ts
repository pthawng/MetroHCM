import { metrics } from '../../../shared/lib/metrics';
import { type TrainPayload } from '../../../entities/train/model/schema';
import { useTrainStore } from '../../../entities/train/store/trainStore';
import { updateInterpolationTarget } from '../model/interpolationEngine';

// Buffer variables
let incomingBuffer: Record<string, TrainPayload> = {};
let lastStoreSync = performance.now();
const STORE_SYNC_INTERVAL_MS = 1000; // 1Hz canonical update

import { z } from 'zod';

const RawSocketTrainSchema = z.object({
  tripId: z.string(),
  lineId: z.string(),
  status: z.enum(['MOVING', 'STOPPED', 'OFFLINE']),
  position: z.object({ lat: z.number(), lng: z.number() }).nullable(),
});

export function processSocketPayload(rawPayload: unknown) {
  // 1. Validate real backend schema
  const schema = z.array(RawSocketTrainSchema).or(RawSocketTrainSchema);
  const result = schema.safeParse(rawPayload);
  
  if (!result.success) {
    metrics.recordInvalidPayload();
    console.warn('Invalid socket payload:', (result as any).error?.issues || result.error);
    return;
  }

  const rawPayloads = Array.isArray(result.data) ? result.data : [result.data];

  // Map to internal domain model
  const payloads: TrainPayload[] = rawPayloads
    .filter(p => p.position !== null) // Drop items without physical location
    .map(p => ({
      version: 'v1',
      id: p.tripId,
      lineId: p.lineId,
      status: p.status === 'MOVING' ? 'active' : p.status === 'STOPPED' ? 'stopped' : 'maintenance',
      location: p.position!,
      speed: 0, // Fallback, could be calculated in engine
      heading: 0, // Fallback
      timestamp: Date.now(), // Fallback since simulation doesn't emit precise timestamps yet
    }));

  for (const payload of payloads) {
    // 2. Metrics (Latency Compensation)
    // Server doesn't send time, we assume 0 latency for now, wait for backend upgrade
    const latency = 0; 
    
    // 3. Update Buffer 
    const existing = incomingBuffer[payload.id];
    if (existing && existing.timestamp > payload.timestamp) {
      metrics.recordDroppedFrame();
      continue;
    }
    
    incomingBuffer[payload.id] = payload;

    // 4. Update Interpolation
    updateInterpolationTarget(payload, latency);
  }
}

// Fixed tick to flush to Canonical Store (throttled)
export function startBufferFlushLoop() {
  const tick = () => {
    let now = performance.now();
    if (now - lastStoreSync >= STORE_SYNC_INTERVAL_MS) {
      const trainsToUpdate = Object.keys(incomingBuffer);
      if (trainsToUpdate.length > 0) {
        // Transform Payload -> Store Entity
        const clientTimestamp = Date.now();
        const storeUpdates = Object.fromEntries(
          Object.values(incomingBuffer).map((t) => [
            t.id, 
            { ...t, lastUpdatedClient: clientTimestamp }
          ])
        );
        
        // Batch flush
        useTrainStore.getState().batchUpdate(storeUpdates);
        
        // Clear buffer
        incomingBuffer = {};
      }
      lastStoreSync = now;
    }
    requestAnimationFrame(tick);
  };
  
  requestAnimationFrame(tick);
}

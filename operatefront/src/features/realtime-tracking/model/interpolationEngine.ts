import type { TrainPayload } from '../../../entities/train/model/schema';

// Pure position state
export interface Position {
  lng: number;
  lat: number;
  heading: number;
  id: string; // Train ID
  lineId: string;
}

interface TrainPhysics {
  startPos: Position;
  targetPos: Position;
  startTimeMs: number; // local performance.now() when target arrived
  durationMs: number;  // expected time to reach target
}

// Memory structure (Ephemeral State)
const physicsState: Record<string, TrainPhysics> = {};
const POSITION_UPDATE_INTERVAL_MS = 1000; // Assuming 1 tick every sec

export function updateInterpolationTarget(payload: TrainPayload, latencyMs: number) {
  const now = performance.now();
  const id = payload.id;

  const newTarget: Position = {
    id: payload.id,
    lineId: payload.lineId,
    lng: payload.location.lng,
    lat: payload.location.lat,
    heading: payload.heading,
  };

  const existing = physicsState[id];

  if (!existing) {
    // First time seeing this train
    physicsState[id] = {
      startPos: { ...newTarget },
      targetPos: { ...newTarget },
      startTimeMs: now,
      durationMs: POSITION_UPDATE_INTERVAL_MS, // fallback
    };
    return;
  }

  // Update physics for movement
  // To avoid train jumping backwards, we use current interpolated position as new start
  const currentInterpolated = getTrainInterpolatedPosition(id, now);
  
  physicsState[id] = {
    startPos: currentInterpolated || existing.targetPos,
    targetPos: newTarget,
    startTimeMs: now,
    // Decrease duration by latency to 'catch up' if the payload arrived late
    durationMs: Math.max(200, POSITION_UPDATE_INTERVAL_MS - latencyMs), 
  };
}

function getTrainInterpolatedPosition(id: string, now: number): Position | null {
  const physics = physicsState[id];
  if (!physics) return null;

  const elapsed = now - physics.startTimeMs;
  let progress = elapsed / physics.durationMs;
  
  if (progress >= 1) progress = 1; // Cap at target

  return {
    id: physics.targetPos.id,
    lineId: physics.targetPos.lineId,
    lng: physics.startPos.lng + (physics.targetPos.lng - physics.startPos.lng) * progress,
    lat: physics.startPos.lat + (physics.targetPos.lat - physics.startPos.lat) * progress,
    // Linear heading interpolation (simplistic - ignores 360 wrap around for now)
    heading: physics.targetPos.heading,
  };
}

// Pure function returning current computed state for all trains
export function getInterpolatedState(): Record<string, Position> {
  const state: Record<string, Position> = {};
  const now = performance.now();
  
  for (const id in physicsState) {
    const pos = getTrainInterpolatedPosition(id, now);
    if (pos) {
      state[id] = pos;
    }
  }
  
  return state;
}

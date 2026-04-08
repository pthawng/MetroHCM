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
  lastMessageTimeMs?: number; // for adaptive duration
}

// Memory structure (Ephemeral State)
const physicsState: Record<string, TrainPhysics> = {};
const FALLBACK_INTERVAL_MS = 1000;
const MIN_DURATION_MS = 200;

/**
 * Elite Latency Tracker
 * Calculates rolling Avg + 3σ for jitter-resistant playback
 */
class LatencyTracker {
  private history: number[] = [];
  private readonly WINDOW_SIZE = 30;

  add(latency: number) {
    this.history.push(latency);
    if (this.history.length > this.WINDOW_SIZE) this.history.shift();
  }

  getMetrics() {
    if (this.history.length < 2) return { mean: 100, stdDev: 0 };
    
    const mean = this.history.reduce((a, b) => a + b) / this.history.length;
    const variance = this.history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.history.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean, stdDev };
  }

  getRecommendedDelay() {
    const { mean, stdDev } = this.getMetrics();
    // Elite Heuristic: Avg + 3 Sigma (covers 99.7% of jitter cases)
    // Clamp between 50ms (ultra-fast) and 2000ms (satellite/failed link)
    const raw = mean + (3 * stdDev);
    return Math.min(2000, Math.max(50, raw));
  }
}

const globalLatencyTracker = new LatencyTracker();
let smoothedDelay = 100; // Global jitter buffer offset

/**
 * Shortest path angle interpolation (0-360 wrapping)
 */
function lerpHeading(a: number, b: number, t: number) {
  let diff = (b - a + 180) % 360 - 180;
  if (diff < -180) diff += 360;
  return (a + diff * t + 360) % 360;
}

export function updateInterpolationTarget(payload: TrainPayload, latencyMs: number) {
  const now = performance.now();
  const id = payload.id;

  // Track the arrival latency of this specific packet
  globalLatencyTracker.add(latencyMs);
  
  // Smooth the recommendation to prevent visual "snapping"
  const targetDelay = globalLatencyTracker.getRecommendedDelay();
  smoothedDelay = smoothedDelay * 0.9 + targetDelay * 0.1;

  const newTarget: Position = {
    id: payload.id,
    lineId: payload.lineId,
    lng: payload.location.lng,
    lat: payload.location.lat,
    heading: payload.heading,
  };

  const existing = physicsState[id];

  if (!existing) {
    physicsState[id] = {
      startPos: { ...newTarget },
      targetPos: { ...newTarget },
      startTimeMs: now,
      durationMs: FALLBACK_INTERVAL_MS,
      lastMessageTimeMs: now,
    };
    return;
  }

  // 1. Adaptive Duration Detection
  let detectedInterval = FALLBACK_INTERVAL_MS;
  if (existing.lastMessageTimeMs) {
    detectedInterval = now - existing.lastMessageTimeMs;
  }

  // 2. Continuous Movement (prevent jumping backwards)
  const currentInterpolated = getTrainInterpolatedPosition(id, now);
  
  physicsState[id] = {
    startPos: currentInterpolated || existing.targetPos,
    targetPos: newTarget,
    startTimeMs: now,
    lastMessageTimeMs: now,
    // Add safety margin based on our global smoothed delay
    durationMs: Math.max(MIN_DURATION_MS, detectedInterval * 1.05), 
  };
}

function getTrainInterpolatedPosition(id: string, now: number): Position | null {
  const physics = physicsState[id];
  if (!physics) return null;

  // Render at: now - smoothedDelay (The Jitter Buffer)
  const renderNow = now - smoothedDelay;
  const elapsed = renderNow - physics.startTimeMs;
  let progress = elapsed / physics.durationMs;
  
  if (progress >= 1) progress = 1;
  if (progress < 0) progress = 0; // Don't render "future" positions

  return {
    id: physics.targetPos.id,
    lineId: physics.targetPos.lineId,
    lng: physics.startPos.lng + (physics.targetPos.lng - physics.startPos.lng) * progress,
    lat: physics.startPos.lat + (physics.targetPos.lat - physics.startPos.lat) * progress,
    heading: lerpHeading(physics.startPos.heading, physics.targetPos.heading, progress),
  };
}

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

// Export for observability in MetricsPanel
export function getLatencyMetrics() {
  return {
    ...globalLatencyTracker.getMetrics(),
    currentDelay: smoothedDelay
  };
}

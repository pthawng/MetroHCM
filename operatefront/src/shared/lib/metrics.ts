// src/shared/lib/metrics.ts
export interface SystemMetrics {
  droppedFrames: number;
  invalidPayloads: number;
  fps: number;
  updateLatency: number;
}

class MetricsLogger {
  private metrics: SystemMetrics = {
    droppedFrames: 0,
    invalidPayloads: 0,
    fps: 60,
    updateLatency: 0,
  };
  private lastFrameTime = performance.now();
  private frameCount = 0;

  recordDroppedFrame() {
    this.metrics.droppedFrames++;
  }

  recordInvalidPayload() {
    this.metrics.invalidPayloads++;
  }

  recordLatency(latencyMs: number) {
    // Exponential moving average for smooth latency tracking
    this.metrics.updateLatency = this.metrics.updateLatency * 0.9 + latencyMs * 0.1;
  }

  tickFps() {
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFrameTime >= 1000) {
      this.metrics.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;
      // You can add logic here to emit metrics to an analytics endpoint if needed
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

export const metrics = new MetricsLogger();

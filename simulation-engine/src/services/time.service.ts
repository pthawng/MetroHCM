import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  private speedMultiplier = 1;
  private offsetSeconds = 0;
  
  // Fake time for debugging / time travel
  setVirtualTimeConfig(multiplier: number, offset: number) {
    this.speedMultiplier = multiplier;
    this.offsetSeconds = offset;
  }

  getNowSeconds(): number {
    const realNow = Date.now() / 1000;
    return (realNow + this.offsetSeconds) * this.speedMultiplier;
  }
}

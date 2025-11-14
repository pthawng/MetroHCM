'use client';

import { useState, useEffect } from 'react';
import { Train, trainService } from '@/services/train.service';
import { PulseStatus, pulseService } from '@/services/pulse.service';

export const useFleet = () => {
  const [fleet, setFleet] = useState<Train[]>([]);
  const [pulse, setPulse] = useState<PulseStatus | null>(null);

  useEffect(() => {
    // Initial fetch
    setFleet(trainService.getLiveFleet());
    setPulse(pulseService.getPulseStatus());

    // Update at 60fps for buttery smooth movement
    const interval = setInterval(() => {
      setFleet(trainService.getLiveFleet());
      setPulse(pulseService.getPulseStatus());
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return { fleet, pulse };
};

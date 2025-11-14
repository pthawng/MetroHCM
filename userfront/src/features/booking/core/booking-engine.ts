import { Station, Route } from '@/services/station.service';

/**
 * BookingEngine handles the core domain logic for ticket calculations,
 * route validation, and pricing strategy.
 */
export const BookingEngine = {
  calculatePrice: (distance: number, stopCount: number): number => {
    const basePrice = 10000; // VND
    const perKmPrice = 2000;
    const perStopPrice = 1000;
    
    return basePrice + (distance * perKmPrice) + (stopCount * perStopPrice);
  },

  validateRoute: (origin: Station | null, destination: Station | null): { 
    isValid: boolean; 
    error?: string;
  } => {
    if (!origin || !destination) {
      return { isValid: false, error: 'Vui lòng chọn ga đi và ga đến' };
    }
    
    if (origin.id === destination.id) {
      return { isValid: false, error: 'Ga đi và ga đến không thể trùng nhau' };
    }

    return { isValid: true };
  },

  estimateArrivalTime: (departureTime: Date, durationMinutes: number): Date => {
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes);
    return arrivalTime;
  }
};

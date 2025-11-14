import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookingState {
  fromStationId: string | null;
  toStationId: string | null;
  guestEmail: string | null;
  ticketType: 'SINGLE' | 'DAY' | 'MONTH' | null;
  
  setFromStation: (id: string | null) => void;
  setToStation: (id: string | null) => void;
  setGuestEmail: (email: string | null) => void;
  setTicketType: (type: 'SINGLE' | 'DAY' | 'MONTH' | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      fromStationId: null,
      toStationId: null,
      guestEmail: null,
      ticketType: null,

      setFromStation: (id) => set({ fromStationId: id }),
      setToStation: (id) => set({ toStationId: id }),
      setGuestEmail: (email) => set({ guestEmail: email }),
      setTicketType: (type) => set({ ticketType: type }),
      
      resetBooking: () => set({ 
        fromStationId: null, 
        toStationId: null, 
        guestEmail: null,
        ticketType: null 
      }),
    }),
    {
      name: 'metro-booking-storage',
    }
  )
);

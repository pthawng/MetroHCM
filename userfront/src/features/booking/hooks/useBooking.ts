import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '@/store/useBookingStore';
import { stationService } from '@/services/station.service';
import { BookingEngine } from '../core/booking-engine';

export const useBooking = () => {
    const { 
        fromStationId, 
        toStationId, 
        guestEmail,
        setFromStation,
        setToStation,
        setGuestEmail,
        resetBooking
    } = useBookingStore();

    // Fetch stations list
    const { data: stations = [], isLoading: isLoadingStations } = useQuery({
        queryKey: ['stations'],
        queryFn: () => stationService.getStations()
    });

    // Fetch route info
    const { data: route = null, isLoading: isLoadingRoute } = useQuery({
        queryKey: ['route', fromStationId, toStationId],
        queryFn: () => stationService.getRoute(fromStationId!, toStationId!),
        enabled: !!fromStationId && !!toStationId
    });

    const validation = BookingEngine.validateRoute(
        stations.find(s => s.id === fromStationId) || null,
        stations.find(s => s.id === toStationId) || null
    );

    return {
        stations,
        fromStationId,
        toStationId,
        guestEmail,
        route,
        isLoading: isLoadingStations || isLoadingRoute,
        isValid: validation.isValid,
        error: validation.error,
        actions: {
            setFromStation,
            setToStation,
            setGuestEmail,
            resetBooking
        }
    };
};

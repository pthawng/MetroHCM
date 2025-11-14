'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '../hooks/useBooking';
import { useFleet } from '../hooks/useFleet';
import { cn } from '@/lib/utils/cn';
import { MapPin, Mail, ArrowRightLeft, TrainFront, Clock } from 'lucide-react';

export const BookingForm: React.FC = () => {
    const router = useRouter();
    const { stations, fromStationId, toStationId, guestEmail, actions, error } = useBooking();
    const { fleet } = useFleet();

    const fromStation = stations.find(s => s.id === fromStationId);
    
    // Logic to find the nearest train to 'fromStation'
    const nearestTrain = React.useMemo(() => {
        if (!fromStation) return null;
        const stationIdx = stations.indexOf(fromStation);
        const stationPos = stationIdx / (stations.length - 1);
        
        return fleet
            .filter(t => (t.direction === 1 && t.position < stationPos) || (t.direction === -1 && t.position > stationPos))
            .sort((a, b) => Math.abs(a.position - stationPos) - Math.abs(b.position - stationPos))[0];
    }, [fromStation, fleet, stations]);

    const arrivalMinutes = nearestTrain 
        ? Math.max(1, Math.ceil(Math.abs(nearestTrain.position - stations.indexOf(fromStation!) / (stations.length - 1)) * 20)) 
        : null;

    const handleBooking = () => {
        if (!fromStationId || !toStationId) return;
        router.push('/ticket');
    };

    return (
        <div className={cn(
            "w-full max-w-xl p-8 rounded-3xl",
            "bg-white/5 backdrop-blur-2xl border border-white/10",
            "shadow-[0_24px_48px_rgba(0,0,0,0.4)]",
            "flex flex-col gap-6"
        )}>
            <div className="flex items-center gap-3">
                <TrainFront className="text-secondary w-6 h-6" />
                <h2 className="text-xl font-bold text-white tracking-tight">Mua vé nhanh</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* From Station */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-1">Ga đi</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:text-secondary transition-colors" />
                        <select 
                            value={fromStationId || ''} 
                            onChange={(e) => actions.setFromStation(e.target.value)}
                            className={cn(
                                "w-full pl-11 pr-4 py-3.5 bg-white/10 hover:bg-white/15 rounded-2xl",
                                "text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none"
                            )}
                        >
                            <option value="" disabled className="bg-elite-space">Chọn ga đi...</option>
                            {stations.map(s => (
                                <option key={s.id} value={s.id} className="bg-elite-space">{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* To Station */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-1">Ga đến</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                        <select 
                            value={toStationId || ''} 
                            onChange={(e) => actions.setToStation(e.target.value)}
                            className={cn(
                                "w-full pl-11 pr-4 py-3.5 bg-white/10 hover:bg-white/15 rounded-2xl",
                                "text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-secondary/50 transition-all cursor-pointer appearance-none"
                            )}
                        >
                            <option value="" disabled className="bg-elite-space">Chọn ga đến...</option>
                            {stations.map(s => (
                                <option key={s.id} value={s.id} className="bg-elite-space">{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 top-[58px] -translate-x-1/2 w-8 h-8 rounded-full bg-elite-space border border-white/10 items-center justify-center text-white/50 z-10">
                    <ArrowRightLeft className="w-4 h-4" />
                </div>
            </div>

            {/* Guest Email Field */}
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-1">Email nhận vé điện tử</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="email" 
                        placeholder="example@email.com"
                        value={guestEmail || ''}
                        onChange={(e) => actions.setGuestEmail(e.target.value)}
                        className={cn(
                          "w-full pl-11 pr-4 py-3.5 bg-white/10 hover:bg-white/15 rounded-2xl",
                          "text-white outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary/50 transition-all"
                        )}
                    />
                </div>
                <p className="text-[10px] text-slate-500 px-1 font-medium italic">
                  * Vé sẽ được gửi trực tiếp qua email này sau khi thanh toán thành công
                </p>
            </div>

            {/* Next Train Status (Idea 2 Refresh) */}
            {nearestTrain && (
                <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-between animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tiếp theo</p>
                            <p className="text-sm font-bold text-white">
                                {nearestTrain.id} ({nearestTrain.carCount} toa)
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dự kiến</p>
                        <p className="text-lg font-black text-secondary">{arrivalMinutes} min</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <button 
                onClick={handleBooking}
                className={cn(
                    "w-full py-4 mt-2 rounded-2xl font-bold text-white uppercase tracking-widest transition-all",
                    "bg-metro-gradient hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20",
                    (!fromStationId || !toStationId) && "opacity-50 grayscale cursor-not-allowed"
                )}
            >
                Mua vé ngay
            </button>
        </div>
    );
};

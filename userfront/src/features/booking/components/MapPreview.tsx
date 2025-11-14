'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../hooks/useBooking';
import { useFleet } from '../hooks/useFleet';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Activity, Mail, Loader2, Gauge, Train, ArrowRight } from 'lucide-react';
import { ATOMIC_STATIONS, SAIGON_RIVER_PATH, MAP_CONFIG, DISTRICT_METADATA } from '../constants/map.constants';

export const MapPreview: React.FC = () => {
  const router = useRouter();
  const { stations, fromStationId, toStationId, guestEmail, route, actions, isValid } = useBooking();
  const { fleet, pulse } = useFleet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromStation = stations.find(s => s.id === fromStationId);
  const toStation = stations.find(s => s.id === toStationId);

  const handleNodeClick = (stationId: string) => {
    if (!fromStationId || (fromStationId && toStationId)) {
      actions.setFromStation(stationId);
      actions.setToStation(null);
    } else if (fromStationId && !toStationId) {
      if (stationId === fromStationId) return;
      actions.setToStation(stationId);
    }
  };

  const handleBookNow = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    router.push('/ticket/success');
  };

  const upTrackD = useMemo(() => {
    return ATOMIC_STATIONS.reduce((path, s, i) => {
      return path + (i === 0 ? `M ${s.x} ${s.y - MAP_CONFIG.trackOffset}` : ` L ${s.x} ${s.y - MAP_CONFIG.trackOffset}`);
    }, "");
  }, []);

  const downTrackD = useMemo(() => {
    return ATOMIC_STATIONS.reduce((path, s, i) => {
      return path + (i === 0 ? `M ${s.x} ${s.y + MAP_CONFIG.trackOffset}` : ` L ${s.x} ${s.y + MAP_CONFIG.trackOffset}`);
    }, "");
  }, []);

  const getTrainCoords = (position: number, direction: number) => {
    const currentKm = position * MAP_CONFIG.totalKm;
    let startS = ATOMIC_STATIONS[0], endS = ATOMIC_STATIONS[1];
    
    for (let i = 0; i < ATOMIC_STATIONS.length - 1; i++) {
        if (currentKm >= ATOMIC_STATIONS[i].km && currentKm <= ATOMIC_STATIONS[i+1].km) {
            startS = ATOMIC_STATIONS[i];
            endS = ATOMIC_STATIONS[i+1];
            break;
        }
    }

    const segKm = endS.km - startS.km;
    const progress = segKm === 0 ? 0 : (currentKm - startS.km) / segKm;
    const yOff = direction === 1 ? -MAP_CONFIG.trackOffset : MAP_CONFIG.trackOffset;

    return {
      x: startS.x + (endS.x - startS.x) * progress,
      y: (startS.y + (endS.y - startS.y) * progress) + yOff,
      angle: Math.atan2(endS.y - startS.y, endS.x - startS.x) * (180 / Math.PI)
    };
  };

  const selectedPathD = useMemo(() => {
    if (!fromStationId || !toStationId) return "";
    const startS = ATOMIC_STATIONS.find(s => s.id === fromStationId);
    const endS = ATOMIC_STATIONS.find(s => s.id === toStationId);
    if (!startS || !endS) return "";
    const startIdx = ATOMIC_STATIONS.indexOf(startS);
    const endIdx = ATOMIC_STATIONS.indexOf(endS);
    const minIdx = Math.min(startIdx, endIdx);
    const maxIdx = Math.max(startIdx, endIdx);
    const isOutbound = startIdx < endIdx;
    const yOff = isOutbound ? -MAP_CONFIG.trackOffset : MAP_CONFIG.trackOffset;
    const segment = ATOMIC_STATIONS.slice(minIdx, maxIdx + 1);
    return segment.reduce((path, s, i) => {
      return path + (i === 0 ? `M ${s.x} ${s.y + yOff}` : ` L ${s.x} ${s.y + yOff}`);
    }, "");
  }, [fromStationId, toStationId]);

  return (
    <div className="w-full h-screen relative bg-[#000000] overflow-hidden">
      {/* 🚀 ELITE DIGITAL TWIN BACKGROUND GRID */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]" />
          
          {/* Moving Scan Line */}
          <motion.div 
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[2px] bg-primary/10 blur-sm z-10"
          />
      </div>
      
      {/* SENIOR FE: INTEGRATED COMMAND SURFACE HUD */}
      <div className="absolute inset-0 z-30 pointer-events-none p-6 md:p-12 overflow-hidden">
          
          {/* ZONE A: INTEGRATED COMMAND SIDEBAR (Floating) */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute left-20 top-40 z-40 flex flex-col gap-6 hidden md:flex pointer-events-none"
          >
             {/* Unified Time & Environment Post */}
             <div className="flex items-start gap-10">
                {/* 1. System Clock */}
                <div className="space-y-1">
                   <div className="text-2xl font-black font-outfit text-white/90 tracking-tighter">
                      {new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-[1px] bg-white/20" />
                      <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/40 italic leading-none pt-0.5">Saigon_Standard</span>
                   </div>
                </div>

                {/* 2. Vertical Divider */}
                <div className="w-[1px] h-10 bg-white/5 mt-1" />

                {/* 3. MOVED: HCMC Environment Station */}
                <div className="space-y-2 pt-1">
                   <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] block">HCMC_Env</span>
                   <div className="flex gap-6">
                      <div className="space-y-0.5">
                         <p className="text-sm font-black font-outfit text-white/80 tracking-tighter tabular-nums">28.4°C</p>
                         <p className="text-[6px] font-bold text-white/20 uppercase tracking-widest">Global_Avg</p>
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-sm font-black font-outfit text-white/80 tracking-tighter tabular-nums">62%</p>
                         <p className="text-[6px] font-bold text-white/20 uppercase tracking-widest">Humidity</p>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* ZONE B: TECHNICAL STATUS STRIP (Top) */}
          <div className="absolute top-4 inset-x-12 md:inset-x-64 h-8 flex items-center justify-between pointer-events-none border-b border-white/5 pb-2">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/80">GIS_Live</span>
                </div>
                <div className="w-[1px] h-3 bg-white/20" />
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">LOC: 10.7769N / 106.7009E</span>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[7px] font-black text-primary uppercase tracking-widest">Fleet_Status: Optimal</span>
                   <span className="text-[6px] font-mono text-white/40 italic tracking-tighter">Real-time Data Sync Active</span>
                </div>
                <div className="text-right border-l border-white/10 pl-6">
                   <div className="text-[10px] font-black text-white/80 font-mono tracking-tighter">1.2ms</div>
                   <div className="text-[6px] font-bold text-white/30 uppercase tracking-widest leading-none">Net_Latency</div>
                </div>
             </div>
          </div>

          {/* ZONE C: INTERACTIVE PASSENGER DOCK (Bottom-Right) */}
          <div className="absolute bottom-10 right-10 md:right-16 z-40 pointer-events-none w-[90%] md:w-[320px] max-w-sm flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                    <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 shrink-0">Telemetry_Flow</span>
                    <div className="w-24 h-[1px] bg-white/5 relative overflow-hidden">
                        <motion.div 
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                        />
                    </div>
                 </div>
                 <span className="text-[7px] font-mono text-white/20 uppercase">[+] Docked</span>
              </div>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel p-0 rounded-[24px] bg-black/95 border border-white/10 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] overflow-hidden pointer-events-auto"
              >
                  {/* Simple Tech Header */}
                  <div className="px-6 py-3 bg-white/[0.03] border-b border-white/5 flex justify-between items-center mr-2 ml-2 mt-2 rounded-t-2xl">
                     <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Terminal.E-01</span>
                     <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                        <div className="w-1 h-1 rounded-full bg-primary/20" />
                     </div>
                  </div>

                  <div className="p-6 space-y-6">
                      {/* Compact Boarding UI */}
                      <div className="space-y-4">
                          <div className="flex justify-between items-end gap-3 text-center">
                              <div className="flex-1 space-y-1">
                                  <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Origin</p>
                                  <h3 className={cn("text-sm font-black font-outfit leading-none", fromStation ? "text-white" : "text-white/70")}>
                                    {fromStation?.name || "---"}
                                  </h3>
                              </div>
                              
                              <div className="mb-1 flex flex-col items-center">
                                  <div className="w-8 h-[1px] bg-primary/30 relative">
                                     <motion.div 
                                        animate={{ left: ["0%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute top-[-2px] w-1 h-1 bg-primary rounded-full blur-[1px]" 
                                     />
                                  </div>
                                  <Train className="w-3 h-3 text-primary/20 mt-1" />
                              </div>

                              <div className="flex-1 space-y-1">
                                  <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Target</p>
                                  <h3 className={cn("text-sm font-black font-outfit leading-none", toStation ? "text-white" : "text-white/70")}>
                                    {toStation?.name || "---"}
                                  </h3>
                              </div>
                          </div>

                          {/* Compact Data Row */}
                          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                              <div className="flex-1 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                  <span className="text-[7px] font-black text-slate-600 uppercase block mb-1">Transit Fee</span>
                                  <p className="text-base font-black font-outfit text-secondary">
                                     {route ? `${route.price.toLocaleString()}đ` : "---"}
                                  </p>
                              </div>
                              {/* Minimal QR */}
                              <div className="w-12 h-12 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-center p-1.5 overflow-hidden group">
                                   <div className="w-full h-full bg-slate-900 grid grid-cols-4 gap-[1.5px] opacity-30 group-hover:opacity-60 transition-opacity">
                                        {Array.from({ length: 16 }).map((_, i) => (
                                           <div key={i} className={cn("w-full h-full", Math.random() > 0.4 ? "bg-white" : "bg-transparent")} />
                                        ))}
                                   </div>
                              </div>
                          </div>
                      </div>

                      <button 
                        onClick={handleBookNow} 
                        disabled={!isValid || isSubmitting}
                        className={cn(
                            "group relative w-full h-12 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all overflow-hidden",
                            isValid && !isSubmitting 
                              ? "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02]" 
                              : "bg-white/5 text-slate-800"
                        )}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                             <>
                                Confirm Booking
                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                             </>
                           )}
                        </span>
                      </button>
                  </div>
              </motion.div>
          </div>
      </div>

      {/* UNIFIED DIGITAL TWIN SVG LAYER */}
      <svg 
        viewBox={MAP_CONFIG.viewBox}
        className="absolute inset-0 w-full h-full z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Geographic Layer (River with Flow Particles) */}
        <g opacity="0.6">
          <path d={SAIGON_RIVER_PATH} fill="none" stroke="rgba(0,122,255,0.2)" strokeWidth="80" strokeLinecap="round" className="filter blur-3xl opacity-50" />
          <path id="river-path" d={SAIGON_RIVER_PATH} fill="none" stroke="rgba(0,122,255,0.08)" strokeWidth="40" strokeLinecap="round" />
          
          {[0, 0.25, 0.5, 0.75].map((offset, i) => (
            <motion.circle key={i} r="1.8" fill="#007AFF" className="opacity-60 filter blur-[1px]">
              <animateMotion
                dur="18s"
                repeatCount="indefinite"
                path={SAIGON_RIVER_PATH}
                calcMode="linear"
                keyPoints={`${offset};${(offset + 0.2) % 1}`}
                keyTimes="0;1"
              />
            </motion.circle>
          ))}
        </g>

        {/* Technical District Markers */}
        <g>
          {DISTRICT_METADATA.map((d, i) => (
            <g key={i} transform={`translate(${d.x}, ${d.y})`} className="opacity-40 hover:opacity-100 transition-opacity duration-700">
               <text className="fill-white font-black text-[7px] uppercase tracking-[0.2em]">{d.name}</text>
               <path d="M -3 0 L 3 0 M 0 -3 L 0 3" stroke="white" strokeWidth="0.5" className="opacity-60" />
            </g>
          ))}
        </g>

        {/* Infrastructure Layer (Tracks) */}
        <g opacity="1">
            <path d={upTrackD} fill="none" stroke="#22D3EE" strokeWidth="0.8" strokeDasharray="3 6" className="opacity-30" />
            <path d={downTrackD} fill="none" stroke="#22C55E" strokeWidth="0.8" strokeDasharray="3 6" className="opacity-30" />
        </g>

        {/* Selected Route Glow */}
        {selectedPathD && (
             <motion.path
                key={`${fromStationId}-${toStationId}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d={selectedPathD} fill="none" stroke="#007AFF" strokeWidth="4" strokeLinecap="round"
                className="filter drop-shadow-[0_0_20px_rgba(0,122,255,1)]"
             />
        )}

        {/* Fleet Layer (Trains) */}
        {fleet.map((train) => {
            const coords = getTrainCoords(train.position, train.direction);
            const segments = Array.from({ length: train.carCount });
            const x = isNaN(coords.x) ? 200 : coords.x;
            const y = isNaN(coords.y) ? 400 : coords.y;

            return (
               <g key={train.id} transform={`translate(${x} ${y}) rotate(${coords.angle || 0})`}>
                  <g transform={`translate(${train.direction === 1 ? -18 : 18} 0)`}>
                    {segments.map((_, i) => (
                        <rect
                            key={i}
                            x={i * 10 - (train.carCount * 10) / 2}
                            y="-3.5"
                            width="9.5" height="7" rx="1.5"
                            className={cn(
                                "transition-all duration-300",
                                train.direction === 1 ? "fill-cyan-400" : "fill-emerald-400",
                                "filter drop-shadow-[0_0_25px_currentColor]",
                                "stroke-white/40 stroke-[0.5px]"
                            )}
                        />
                    ))}
                  </g>
               </g>
            );
        })}

        {/* Stations Layer */}
        {ATOMIC_STATIONS.map((station, index) => {
            const isSelected = station.id === fromStationId || station.id === toStationId;
            const isOdd = index % 2 !== 0;

            return (
                <g key={station.id} onClick={() => handleNodeClick(station.id)} className="cursor-pointer group/node">
                    <circle cx={station.x} cy={station.y} r={isSelected ? "7" : "4"} 
                        className={cn(
                            "transition-all duration-300",
                            isSelected ? "fill-primary" : "fill-slate-800",
                            "stroke-white/20 stroke-1"
                        )}
                    />
                    <text x={station.x} y={isOdd ? station.y - 18 : station.y + 28} textAnchor="middle" 
                        className={cn("text-[10px] font-black uppercase transition-all duration-500 font-outfit", isSelected ? "fill-white" : "fill-white/70 group-hover/node:fill-white")}
                        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                    >
                        {station.name}
                    </text>
                </g>
            );
        })}
      </svg>

    </div>
  );
};

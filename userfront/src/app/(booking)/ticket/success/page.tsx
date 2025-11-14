'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/features/booking/hooks/useBooking';
import { useBookingStore } from '@/store/useBookingStore';
import { Container } from '@/components/layout/LayoutHelpers';
import { CheckCircle2, Download, Home, Share2, QrCode as QrCodeIcon, CreditCard, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export default function BookingSuccessPage() {
  const router = useRouter();
  const { route, stations, fromStationId, toStationId } = useBooking();
  const { ticketType } = useBookingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fromStation = stations.find(s => s.id === fromStationId);
  const toStation = stations.find(s => s.id === toStationId);

  // Generate a mock ticket ID
  const ticketId = mounted ? `METRO-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : '...';

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center py-20 overflow-hidden">
      
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[160px] -z-10" />

      <Container className="max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 text-center"
        >
          {/* Success Header */}
          <div className="space-y-4">
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
               className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto border border-secondary/30"
            >
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight leading-none">
              Đặt vé thành công!
            </h1>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">
              Hành trình xanh của bạn đã sẵn sàng. Vé điện tử đã được gửi tới email của bạn.
            </p>
          </div>

          {/* Elite Digital Ticket */}
          <div className="w-full relative group">
             {/* Glow Effect */}
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[32px] blur opacity-20 group-hover:opacity-40 transition-opacity" />
             
             <div className="relative glass-panel rounded-[28px] overflow-hidden border-white/5 flex flex-col md:flex-row">
                
                {/* QR Section */}
                <div className="p-8 md:w-1/2 bg-white/[0.03] flex items-center justify-center relative">
                    <div className="w-48 h-48 p-4 rounded-3xl bg-white flex items-center justify-center relative">
                        <QrCodeIcon className="w-full h-full text-black opacity-90" />
                        <div className="absolute inset-0 border-4 border-dashed border-elite-space/10 rounded-3xl pointer-events-none" />
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-8 md:w-1/2 flex flex-col gap-6 text-left border-t md:border-t-0 md:border-l border-white/5">
                   <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Mã vé</p>
                      <p className="font-bold text-white tracking-widest">{ticketId}</p>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-slate-300">
                             {fromStation?.name} → {toStation?.name}
                          </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Thời lượng: {route?.estimatedMinutes || 0} phút</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                          <CreditCard className="w-4 h-4" />
                          <span className="uppercase text-xs tracking-tighter">Loại: {ticketType}</span>
                      </div>
                   </div>

                   <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Hết hạn sau 24h</div>
                      <div className="bg-secondary/10 px-3 py-1 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest">VALID</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className={cn(
                    "py-4 rounded-2xl font-bold text-white uppercase tracking-widest transition-all",
                    "bg-metro-gradient flex items-center justify-center gap-2"
                )}>
                    <Download className="w-5 h-5" />
                    Tải vé (PDF)
                </button>
                <button className={cn(
                    "py-4 rounded-2xl font-bold text-white uppercase tracking-widest transition-all",
                    "bg-black border border-white/10 hover:bg-white/5 flex items-center justify-center gap-2"
                )}>
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Lưu vào Ví (Wallet)
                </button>
             </div>
             
             <button 
                onClick={() => router.push('/')}
                className={cn(
                  "py-4 rounded-2xl font-bold text-slate-400 uppercase tracking-widest border border-white/5",
                  "hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                )}
             >
                <Home className="w-5 h-5" />
                Về trang chủ
             </button>
          </div>

          <button className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-2 transition-colors">
            <Share2 className="w-4 h-4" />
            Chia sẻ hành trình này
          </button>
        </motion.div>
      </Container>
    </div>
  );
}

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/features/booking/hooks/useBooking';
import { Container, Section } from '@/components/layout/LayoutHelpers';
import { TicketOptionCard } from '@/features/booking/components/TicketOptionCard';
import { useBookingStore } from '@/store/useBookingStore';
import { Ticket, Calendar, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BookingEngine } from '@/features/booking/core/booking-engine';

export default function TicketSelectionPage() {
  const router = useRouter();
  const { route, fromStationId, toStationId, stations, actions } = useBooking();
  const { ticketType, setTicketType } = useBookingStore();

  const fromStation = stations.find(s => s.id === fromStationId);
  const toStation = stations.find(s => s.id === toStationId);

  const basePrice = route ? route.price : 0;

  const handleContinue = () => {
    if (!ticketType) return;
    router.push('/ticket/confirm');
  };

  const ticketOptions = [
    {
      id: 'SINGLE' as const,
      title: 'Vé lượt (Single)',
      description: 'Dành cho hành trình ngắn, sử dụng ngay trong ngày.',
      price: basePrice.toLocaleString('vi-VN'),
      icon: Ticket,
    },
    {
      id: 'DAY' as const,
      title: 'Vé ngày (Day Pass)',
      description: 'Đi không giới hạn trong vòng 24h trọn vẹn.',
      price: (basePrice * 3).toLocaleString('vi-VN'),
      icon: Calendar,
    },
    {
      id: 'MONTH' as const,
      title: 'Vé tháng (Monthly)',
      description: 'Dành cho cư dân đô thị, tiết kiệm đến 40% chi phí.',
      price: (basePrice * 22).toLocaleString('vi-VN'),
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-12 flex flex-col gap-10">
        
        {/* Header with Back button */}
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Quay lại</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight">
            Chọn loại vé của bạn
          </h1>
        </div>

        {/* Route Summary Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ga đi</span>
              <span className="text-xl font-bold text-white">{fromStation?.name || '---'}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ga đến</span>
              <span className="text-xl font-bold text-white">{toStation?.name || '---'}</span>
            </div>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thông tin lộ trình</span>
            <div className="flex items-center gap-3 text-sm font-bold">
              <span className="text-secondary">{route?.distance || 0} km</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-primary">{route?.estimatedMinutes || 0} phút</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-white">{route ? Math.abs(stations.indexOf(fromStation!) - stations.indexOf(toStation!)) : 0} trạm dừng</span>
            </div>
          </div>
        </div>

        {/* Ticket Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ticketOptions.map((option) => (
            <TicketOptionCard
              key={option.id}
              {...option}
              isSelected={ticketType === option.id}
              onSelect={setTicketType}
            />
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-3xl bg-secondary/5 border border-secondary/10">
          <div className="space-y-1">
            <p className="text-slate-400 text-sm font-medium italic">
              * Vé đã bao gồm bảo hiểm hành khách và phí dịch vụ hệ thống.
            </p>
            <h4 className="text-white font-bold">
              {ticketType === 'SINGLE' ? 'Vé Lượt chuẩn' : 
               ticketType === 'DAY' ? 'Thẻ 24h Không giới hạn' : 
               ticketType === 'MONTH' ? 'Thẻ Tháng Tiết kiệm' : 'Vui lòng chọn loại vé'}
            </h4>
          </div>

          <button 
            onClick={handleContinue}
            disabled={!ticketType}
            className={cn(
              "px-12 py-4 rounded-2xl font-bold text-white uppercase tracking-[0.2em] transition-all flex items-center gap-3",
              "bg-metro-gradient shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98]",
              !ticketType && "opacity-50 grayscale cursor-not-allowed"
            )}
          >
            Tiếp tục thanh toán
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </Container>
    </div>
  );
}

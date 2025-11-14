'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useFleet } from '../hooks/useFleet';
import { Zap, MapPin, Gauge, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    description: string;
    color: string;
    delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, description, color, delay = 0 }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-[40px] bg-black/60 border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all"
        >
            <div className={cn("absolute -top-12 -right-12 w-32 h-32 blur-[60px] opacity-20 transition-all group-hover:opacity-40", color)} />
            
            <div className="relative space-y-4">
                <div className={cn("p-4 w-fit rounded-2xl bg-white/5 border border-white/10 text-white/80 transition-colors", groupHoverColor(color))}>
                    {icon}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</h4>
                  <div className="text-4xl font-black text-white mt-2 font-outfit tracking-tighter">
                    {value}
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

const groupHoverColor = (color: string) => {
    if (color.includes('cyan')) return 'group-hover:text-cyan-400 group-hover:border-cyan-400/30';
    if (color.includes('emerald')) return 'group-hover:text-emerald-400 group-hover:border-emerald-400/30';
    if (color.includes('primary')) return 'group-hover:text-primary group-hover:border-primary/30';
    return '';
};

export const OperationalDash: React.FC = () => {
    const { fleet, pulse } = useFleet();
    const activeTrains = fleet.length;
    const distanceTraveled = (activeTrains * 1420).toLocaleString(); // Mock cumulative distance
    const systemLatency = "99.98%";

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
              <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
              <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative">
                <div className="max-w-3xl mb-16 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <span className="text-xs font-black text-secondary uppercase tracking-[0.3em]">HCMC METRO PULSE</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-white font-outfit tracking-tighter leading-[0.9]">
                        Sức mạnh từ dữ liệu <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">vận hành thực tế.</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl font-medium pt-4">
                      Hệ thống điều khiển Digital Twin đồng bộ hóa 100% với hạ tầng vật lý của Metro Line 1, cung cấp dữ liệu chính xác tuyệt đối từng giây.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        label="Hạm đội tàu"
                        value={`${activeTrains} Đơn vị`}
                        icon={<Gauge className="w-6 h-6" />}
                        description="Số lượng đoàn tàu đang vận hành tại thời gian thực trên toàn mạng lưới."
                        color="bg-cyan-500"
                        delay={0.1}
                    />
                    <StatCard 
                        label="Khoảng cách tích lũy"
                        value={`${distanceTraveled} KM`}
                        icon={<Activity className="w-6 h-6" />}
                        description="Tổng quãng đường hệ thống tự động đã phục vụ trong ngày hôm nay."
                        color="bg-emerald-500"
                        delay={0.2}
                    />
                    <StatCard 
                        label="Độ chính xác"
                        value={systemLatency}
                        icon={<ShieldCheck className="w-6 h-6" />}
                        description="Tỉ lệ sai số của hệ thống định vị GPS và cảm biến trục bánh xe."
                        color="bg-primary"
                        delay={0.3}
                    />
                    <StatCard 
                        label="Tần suất (Headway)"
                        value={`${pulse?.targetHeadway || 10} Phút`}
                        icon={<Zap className="w-6 h-6" />}
                        description="Thời gian chờ dự kiến giữa hai chuyến tàu liên tiếp tại mỗi ga."
                        color="bg-secondary"
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );
};

'use client';

import React from 'react';
import { Container } from '@/components/layout/LayoutHelpers';
import { MapPreview } from '@/features/booking/components/MapPreview';
import { OperationalDash } from '@/features/booking/components/OperationalDash';
import { motion } from 'framer-motion';
import { TrainFront, LayoutDashboard, Globe2, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#04060B] text-foreground flex flex-col scroll-smooth">
      
      {/* 1. HERO SECTION: PURE MINIMALIST GIS HUD */}
      <section className="relative h-screen w-full overflow-hidden border-b border-white/5 bg-black">
        {/* Absolute Background: Pure Map with zero overlaps */}
        <div className="absolute inset-0 z-0">
           <MapPreview />
        </div>

        <Container className="relative z-20 h-full pointer-events-none">
            {/* Page-level overlays removed to favor unified GIS HUD */}
            <div className="w-full h-full" />
        </Container>
      </section>

      {/* 2. OPERATIONAL PULSE DASHBOARD */}
      <OperationalDash />

      {/* 3. CORE TECHNOLOGY MODULES */}
      <section className="py-32 bg-black/40 relative">
         <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <FeatureCard 
                  icon={<Globe2 />}
                  title="Atomic GIS Mapping"
                  description="Quy trình số hóa hạ tầng với độ chính xác tọa độ tính bằng milimet, đồng bộ 1:1 với thực tế."
                  delay={0.1}
               />
               <FeatureCard 
                  icon={<ShieldCheck />}
                  title="Frictionless Booking"
                  description="Hệ thống thanh toán 1-chạm được bảo mật tối đa, xuất vé điện tử tức thì qua Email/QR."
                  delay={0.2}
               />
               <FeatureCard 
                  icon={<LayoutDashboard />}
                  title="Real-time Telemetry"
                  description="Luồng dữ liệu telemetry 60fps từ đoàn tàu giúp dự báo thời gian chờ ga chính xác tuyệt đối."
                  delay={0.3}
               />
            </div>
         </Container>
      </section>

      {/* 4. CALL TO ACTION: THE JOURNEY BEGINS */}
      <section className="py-40 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,122,255,0.05)_0%,transparent_70%)]" />
          <Container className="relative z-10 text-center space-y-12">
             <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-6"
             >
                <h2 className="text-4xl md:text-7xl font-black text-white font-outfit tracking-tighter uppercase italic">
                   Bắt đầu hành trình <br/>
                   <span className="text-secondary not-italic">Của bạn ngay.</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                  Trải nghiệm cách di chuyển hiện đại, thông minh và bền vững cùng MetroHCM. 
                  Sẵn sàng phục vụ hàng triệu cư dân thành phố mỗi ngày.
                </p>
             </motion.div>

             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-primary text-white font-black text-lg uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-primary/20 flex items-center gap-3 mx-auto transition-all hover:bg-primary/90"
             >
                Trải nghiệm ngay
                <ArrowRight className="w-6 h-6" />
             </motion.button>
          </Container>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="space-y-6 group"
    >
      <div className="p-5 w-fit rounded-2xl bg-white/5 border border-white/10 text-white/50 group-hover:text-primary group-hover:border-primary/50 transition-all duration-500">
         {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
      </div>
      <div className="space-y-3">
         <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
         <p className="text-sm text-slate-400 font-medium leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

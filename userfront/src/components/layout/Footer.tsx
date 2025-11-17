'use client';

import React from 'react';
import { Container } from './LayoutHelpers';
import { motion } from 'framer-motion';

interface FooterColumnProps {
  title: string;
  links: string[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{title}</h4>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="pt-20 border-t border-white/5 bg-black relative">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-20">
          <div className="space-y-6">
            <div className="text-2xl font-black text-white font-outfit tracking-tighter uppercase italic">
              Metro<span className="text-secondary not-italic">HCM</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs font-medium leading-relaxed">
              Nền tảng vận hành số hóa cho hệ thống đường sắt đô thị TP. Hồ Chí Minh. 
              Dự án do MAUR & đối tác công nghệ triển khai.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <FooterColumn 
              title="Hệ thống" 
              links={["Tuyến số 1", "Tuyến số 2", "Bản đồ mạng lưới", "Trạng thái vận hành"]} 
            />
            <FooterColumn 
              title="Dịch vụ" 
              links={["Đặt vé", "Thẻ tháng", "Chính sách vé", "Thanh toán"]} 
            />
            <div className="hidden lg:block space-y-6">
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Hotline</h4>
               <div className="text-xl font-bold text-white tracking-widest font-outfit">1900 1234</div>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Hỗ trợ kỹ thuật 24/7</p>
            </div>
          </div>
        </div>

        {/* Operational Stats Ticker - The "Command Center" Touch */}
        <div className="border-t border-white/5 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest italic opacity-40">
                <span>Operational_Grid // Pulse_60fps</span>
                <span>Transmission_Node_Active // 10.0.0.1</span>
                <span>Latency_ms // 0.0032</span>
             </div>
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                © 2026 MetroHCM Digital Twin Engine. All rights reserved.
             </p>
          </div>
          
          <div className="mt-8 flex justify-center md:justify-start gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Liên hệ</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

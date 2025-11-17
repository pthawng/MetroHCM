import React from 'react';
import { Container } from '@/components/layout/LayoutHelpers';
import { SystemAlertBar } from '@/components/features/news/SystemAlertBar';
import { NewsFeed } from '@/components/features/news/NewsFeed';
import { Share2 } from 'lucide-react';

export const metadata = {
  title: 'Metro Pulse | Tin tức & Vận hành MetroHCM',
  description: 'Cập nhật tin tức mới nhất về Tuyến Metro Số 1, thông báo vận hành và sự kiện đô thị tại TP. Hồ Chí Minh.',
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#04060B] pt-32 relative">
      
      {/* 0. Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[1000px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,122,255,0.08)_0%,transparent_70%)] pointer-events-none -z-10" />
      
      {/* 1. Critical Alert Bar (Sticky top) */}
      <SystemAlertBar />

      <Container>
        {/* 2. Header Section */}
        <section className="py-12 flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="w-8 h-[1px] bg-cyan-400/30" />
                Metro Intelligence
             </div>
             <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                Metro <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Pulse</span>
             </h1>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">System_Status</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 mr-[-2px]">All_Lines_Operational // 24/7</span>
             </div>
             <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />
             <button className="flex items-center gap-2 p-4 rounded-2xl glass-panel text-white/50 hover:text-white transition-all hover:scale-105">
                <Share2 size={20} />
             </button>
          </div>
        </section>

        {/* 3. News Content Feed */}
        <NewsFeed />

      </Container>
    </main>
  );
}

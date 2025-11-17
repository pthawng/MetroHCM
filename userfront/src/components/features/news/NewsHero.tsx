'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { News } from '@/services/news.service';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface NewsHeroProps {
  news: News;
}

export const NewsHero: React.FC<NewsHeroProps> = ({ news }) => {
  const isUpdate = news.type === 'update';
  const isAlert = news.type === 'alert';
  
  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden rounded-[40px] shadow-2xl border border-white/5">
      {/* Background Image with Cinematic Zoom */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "linear" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={news.imageUrl} 
          alt={news.title}
          className="w-full h-full object-cover"
        />
        {/* Multi-layered Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080F]/80 via-transparent to-transparent" />
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-end p-8 md:p-20">
        <div className="max-w-4xl space-y-8">
          
          {/* Status Badges & Category */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap items-center gap-4"
          >
             <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2",
                isUpdate ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" :
                isAlert ? "bg-red-500/20 border-red-500/30 text-red-500" :
                "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
             )}>
                {isUpdate ? <Zap size={14} /> : isAlert ? <ShieldCheck size={14} /> : <Zap size={14} />}
                {news.category}
             </div>
             
             {news.statusBadge && (
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                   {news.statusBadge}
                </div>
             )}

             <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest ml-2">
                <Calendar size={14} />
                {new Date(news.date).toLocaleDateString('vi-VN')}
             </div>
          </motion.div>

          {/* Title & Excerpt */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter uppercase italic">
              {news.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
              {news.excerpt}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
             <Link href={`/news/${news.id}`}>
               <button className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <span className="relative z-10 flex items-center gap-3">
                    Xem chi tiết <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
               </button>
             </Link>
          </motion.div>

        </div>
      </div>
      
      {/* Visual Accents */}
      <div className="absolute top-10 right-10 flex flex-col gap-2">
          <div className="w-1 h-32 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
                animate={{ y: [0, 128, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-full h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
             />
          </div>
          <span className="text-[10px] font-black vertical-text text-white/20 tracking-[0.5em] uppercase">FEATURED_STORY</span>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
};

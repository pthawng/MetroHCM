'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ShieldAlert, Zap, Ticket } from 'lucide-react';
import { News } from '@/services/news.service';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface NewsCardProps {
  news: News;
  index: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, index }) => {
  const isAlert = news.type === 'alert';
  const isUpdate = news.type === 'update';
  const isPromo = news.type === 'promo';

  // Specific accent colors based on priority and type
  const accentColor = isAlert ? 'red' : isUpdate ? 'cyan' : 'emerald';
  const glowShadow = isAlert ? 'shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                     isUpdate ? 'shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 
                     'shadow-[0_0_20px_rgba(16,185,129,0.1)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col glass-panel rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border-white/5",
        glowShadow,
        isAlert ? "hover:border-red-500/30" : isUpdate ? "hover:border-cyan-500/30" : "hover:border-emerald-500/30"
      )}
    >
      {/* Image Preview */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={news.imageUrl} 
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
        
        {/* Floating Type Badge */}
        <div className={cn(
           "absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border",
           isAlert ? "bg-red-500/20 border-red-500/40 text-red-400" :
           isUpdate ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" :
           "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
        )}>
           {isAlert ? <ShieldAlert size={14} /> : isUpdate ? <Zap size={14} /> : <Ticket size={14} />}
           {news.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
           <span>{news.category}</span>
           <div className="flex items-center gap-2"><Calendar size={12}/> {new Date(news.date).toLocaleDateString()}</div>
        </div>

        <h3 className="text-xl font-bold leading-tight group-hover:text-white transition-colors">
          {news.title}
        </h3>
        
        <p className="text-sm text-slate-400 font-medium line-clamp-3">
          {news.excerpt}
        </p>

        <div className="pt-4 mt-auto">
          <Link href={`/news/${news.id}`}>
             <button className={cn(
                "flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all",
                isAlert ? "text-red-400 group-hover:text-red-300" :
                isUpdate ? "text-cyan-400 group-hover:text-cyan-300" :
                "text-emerald-400 group-hover:text-emerald-300"
             )}>
                Chi tiết <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
             </button>
          </Link>
        </div>
      </div>

      {/* Logic for high priority glow */}
      {isAlert && (
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.div>
  );
};

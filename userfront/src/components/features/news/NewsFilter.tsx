'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NewsCategory } from '@/services/news.service';
import { cn } from '@/lib/utils/cn';

const CATEGORIES: ("All" | NewsCategory)[] = [
  "All",
  "System Updates",
  "Service Alerts",
  "Promotions",
  "City & Development",
  "Travel Guide"
];

interface NewsFilterProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const NewsFilter: React.FC<NewsFilterProps> = ({ selectedCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 py-8 border-b border-white/5 scrollbar-hide overflow-x-auto">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "relative px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
            selectedCategory === category
              ? "bg-white text-black shadow-2xl shadow-white/20 scale-105"
              : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
          )}
        >
          {category}
          {selectedCategory === category && (
             <motion.div 
               layoutId="filter-active"
               className="absolute inset-0 bg-white rounded-full -z-10"
               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
             />
          )}
        </button>
      ))}
    </div>
  );
};

export const NewsHeroSkeleton = () => (
  <div className="w-full h-[600px] md:h-[700px] rounded-[40px] bg-white/5 animate-pulse overflow-hidden relative">
     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
     <div className="absolute bottom-20 left-20 space-y-4 max-w-2xl">
        <div className="h-6 w-32 bg-white/10 rounded-full" />
        <div className="h-20 w-full bg-white/10 rounded-2xl" />
        <div className="h-10 w-48 bg-white/10 rounded-full" />
     </div>
  </div>
);

export const NewsCardSkeleton = () => (
  <div className="flex flex-col h-[450px] glass-panel rounded-3xl animate-pulse">
    <div className="h-56 w-full bg-white/5 rounded-t-3xl" />
    <div className="p-6 space-y-4">
       <div className="flex justify-between">
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-4 w-20 bg-white/5 rounded" />
       </div>
       <div className="h-8 w-full bg-white/5 rounded" />
       <div className="h-4 w-full bg-white/5 rounded" />
       <div className="h-4 w-3/4 bg-white/5 rounded" />
       <div className="h-6 w-24 bg-white/5 rounded-full mt-4" />
    </div>
  </div>
);

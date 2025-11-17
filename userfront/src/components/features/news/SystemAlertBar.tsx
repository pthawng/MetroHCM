'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, ArrowRight, BellRing } from 'lucide-react';
import { newsService, News } from '@/services/news.service';
import Link from 'next/link';

export const SystemAlertBar = () => {
  const [alerts, setAlerts] = useState<News[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    newsService.getAlerts().then(setAlerts);
  }, []);

  if (alerts.length === 0 || !isVisible) return null;

  const currentAlert = alerts[0];

  return (
    <div className="fixed top-[88px] left-0 w-full z-40 px-4 md:px-10 pointer-events-none">
      <AnimatePresence>
        <motion.div
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: -20, opacity: 0 }}
           className="max-w-[1800px] mx-auto pointer-events-auto"
        >
          <div className="relative group overflow-hidden rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.15)] flex items-center justify-between px-6 py-4">
            
            {/* Pulsing Background Logic */}
            <div className="absolute inset-0 bg-red-500/5 animate-pulse -z-10" />

            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-bounce-subtle">
                <BellRing size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    System Alert
                  </span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    Live Broadcast
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm md:text-base truncate group-hover:text-red-400 transition-colors">
                  {currentAlert.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-6 ml-4">
               <Link 
                  href={`/news/${currentAlert.id}`}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors group/link"
               >
                  Chi tiết <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
               </Link>
               <div className="h-6 w-[1px] bg-white/10" />
               <button 
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-white/5 rounded-full transition-colors text-white/30 hover:text-white"
               >
                  <X size={18} />
               </button>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

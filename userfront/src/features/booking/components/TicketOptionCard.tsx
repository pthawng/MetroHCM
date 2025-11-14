import React from 'react';
import { cn } from '@/lib/utils/cn';
import { LucideIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TicketOptionCardProps {
  id: 'SINGLE' | 'DAY' | 'MONTH';
  title: string;
  description: string;
  price: string;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: (id: 'SINGLE' | 'DAY' | 'MONTH') => void;
}

export const TicketOptionCard: React.FC<TicketOptionCardProps> = ({
  id,
  title,
  description,
  price,
  icon: Icon,
  isSelected,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(id)}
      className={cn(
        "relative cursor-pointer transition-all duration-300 p-6 rounded-3xl border-2 flex flex-col gap-4",
        "bg-white/5 backdrop-blur-xl",
        isSelected 
          ? "border-secondary bg-secondary/5 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
          : "border-white/5 hover:border-white/20"
      )}
    >
      <div className="flex justify-between items-start">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
          isSelected ? "bg-secondary text-white" : "bg-white/5 text-slate-400"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        {isSelected && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-secondary"
          >
            <CheckCircle2 className="w-6 h-6 fill-secondary text-elite-space" />
          </motion.div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className={cn(
          "text-xl font-bold font-outfit transition-colors",
          isSelected ? "text-white" : "text-slate-200"
        )}>
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-tight">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-baseline gap-1">
        <span className={cn(
          "text-2xl font-black font-outfit",
          isSelected ? "text-secondary" : "text-white"
        )}>
          {price}
        </span>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">VND</span>
      </div>
    </motion.div>
  );
};

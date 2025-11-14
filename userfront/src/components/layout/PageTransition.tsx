'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1] // Custom Elite Cubic Bezier
        }}
        className="w-full h-full flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

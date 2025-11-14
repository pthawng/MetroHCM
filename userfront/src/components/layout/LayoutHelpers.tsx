import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  as: Component = 'div' 
}) => {
  return (
    <Component className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full", className)}>
      {children}
    </Component>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className,
  id 
}) => {
  return (
    <section id={id} className={cn("py-16 md:py-24 relative overflow-hidden", className)}>
      {children}
    </section>
  );
};

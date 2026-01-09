import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'frosted' | 'clear' | 'active';
  hoverable?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className, 
  variant = 'frosted',
  hoverable = false,
  ...props 
}) => {
  const variants = {
    frosted: 'bg-glass-surface/50 backdrop-blur-xl border-border-subtle shadow-lg',
    clear: 'bg-white/5 backdrop-blur-md border-white/5',
    active: 'bg-accent-highlight/10 backdrop-blur-2xl border-accent-highlight/30 shadow-accent-highlight/10',
  };

  return (
    <motion.div
      {...props}
      className={cn(
        'rounded-3xl border transition-colors duration-300 overflow-hidden',
        variants[variant],
        hoverable && 'hover:border-border-highlight hover:bg-glass-surface/70',
        className
      )}
    >
      {/* Light Reflection Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

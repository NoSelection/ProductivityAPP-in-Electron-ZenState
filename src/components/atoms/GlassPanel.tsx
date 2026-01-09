import React, { memo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'frosted' | 'clear' | 'active' | 'neo';
  hoverable?: boolean;
}

export const GlassPanel = memo<GlassPanelProps>(function GlassPanel({
  children,
  className,
  variant = 'frosted',
  hoverable = false,
  ...props
}) {
  const variants = {
    frosted: 'bg-glass-surface backdrop-blur-2xl border-glass-border shadow-soft',
    clear: 'bg-glass-highlight backdrop-blur-md border-white/5',
    active: 'bg-accent-highlight/10 backdrop-blur-2xl border-accent-highlight/30 shadow-glow',
    neo: 'bg-glass-base backdrop-blur-3xl border-glass-border shadow-artifact',
  };

  return (
    <motion.div
      {...props}
      className={cn(
        'relative rounded-3xl border transition-all duration-500 overflow-hidden',
        variants[variant],
        hoverable && 'hover:border-white/10 hover:shadow-glow hover:-translate-y-1',
        className
      )}
    >
      {/* Top edge highlight for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-50" />

      {/* Bottom edge reflection */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none opacity-50" />

      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
});


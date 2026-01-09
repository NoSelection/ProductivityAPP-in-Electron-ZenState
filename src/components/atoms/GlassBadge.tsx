import React from 'react';
import { cn } from '../../lib/utils';

interface GlassBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  className,
  variant = 'neutral'
}) => {
  const variants = {
    info: 'bg-accent-highlight/10 text-accent-highlight border-accent-highlight/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-white/5 text-white/60 border-white/10',
  };

  return (
    <span className={cn(
      'px-2 py-0.5 rounded-full border text-[10px] font-tech uppercase tracking-wider',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

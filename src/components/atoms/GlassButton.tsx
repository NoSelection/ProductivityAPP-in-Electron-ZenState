import React, { memo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'neo';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const GlassButton = memo<GlassButtonProps>(function GlassButton({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}) {
  const variants = {
    primary: 'bg-accent-highlight text-white border-accent-highlight hover:brightness-110 shadow-glow hover:shadow-glow-lg',
    secondary: 'bg-glass-highlight text-text-main border-glass-border hover:bg-glass-surface hover:border-glass-highlight backdrop-blur-md',
    ghost: 'bg-transparent text-text-muted border-transparent hover:bg-glass-highlight hover:text-text-main',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30',
    neo: 'bg-glass-surface text-accent-primary border-glass-border shadow-artifact hover:shadow-lg hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px] rounded-lg',
    md: 'px-5 py-2 text-xs rounded-xl',
    lg: 'px-8 py-3 text-sm rounded-2xl',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
      className={cn(
        'relative border font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
});


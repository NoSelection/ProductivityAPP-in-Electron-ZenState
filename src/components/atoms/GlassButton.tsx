import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-accent-highlight/20 text-accent-highlight border-accent-highlight/30 hover:bg-accent-highlight/30 shadow-glow-subtle',
    secondary: 'bg-[var(--glass-highlight)] text-[var(--text-main)] border-border-subtle hover:bg-[var(--glass-surface)] hover:border-border-highlight',
    ghost: 'bg-transparent text-[var(--text-muted)] border-transparent hover:bg-[var(--glass-highlight)] hover:text-[var(--text-main)]',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
      className={cn(
        'relative rounded-2xl border font-tech tracking-wider transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden group',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Inner Glow for Primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-accent-highlight/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

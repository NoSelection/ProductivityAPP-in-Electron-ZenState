import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  className,
  label,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1 font-tech">
          {label}
        </span>
      )}
      <div className="relative group">
        <input
          {...props}
          className={cn(
            'w-full input-glass-bg border border-border-subtle rounded-2xl px-4 py-3 text-sm text-[var(--text-main)]',
            'placeholder:text-[var(--text-muted)] outline-none transition-all duration-300',
            'focus:border-accent-highlight/40 focus:bg-glass-base/50 focus:shadow-[0_0_20px_rgba(56,189,248,0.05)]',
            className
          )}
        />
        {/* Animated Underline or Accent */}
        <motion.div 
          className="absolute bottom-0 left-4 right-4 h-[1px] bg-accent-highlight opacity-0"
          initial={false}
          whileFocus={{ opacity: 0.5, left: '10%', right: '10%' }}
        />
      </div>
    </div>
  );
};

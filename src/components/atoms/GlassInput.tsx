import React, { memo } from 'react';
import { cn } from '../../lib/utils';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const GlassInput = memo<GlassInputProps>(function GlassInput({
  className,
  label,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1 w-full', containerClassName)}>
      {label && (
        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] ml-0.5 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          className={cn(
            'w-full bg-[var(--glass-highlight)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)]',
            'placeholder:text-[var(--text-muted)]/60 outline-none transition-all duration-200',
            'focus:border-[var(--accent-highlight)]/40 focus:bg-[var(--glass-surface)]/50',
            'focus:shadow-[0_0_0_3px_var(--glass-glow)]',
            className
          )}
        />
      </div>
    </div>
  );
});

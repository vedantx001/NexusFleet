import React from 'react';
import { Loader2 } from 'lucide-react';

export default function FormButton({ children, isLoading, disabled, className = '', variant = 'primary', ...props }) {
  const baseClass = variant === 'accent' ? 'btn-accent' : 'btn-primary';

  return (
    <button
      disabled={isLoading || disabled}
      className={`
        ${baseClass}
        relative flex w-full items-center justify-center gap-2 text-sm font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-accent)]
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

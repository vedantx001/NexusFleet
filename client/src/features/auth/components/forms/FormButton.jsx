import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FormButton({ children, isLoading, disabled, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={isLoading || disabled}
      className={`
        relative flex w-full items-center justify-center gap-2 py-3 px-4
        bg-(--brand-accent) text-black font-semibold rounded-xl
        shadow-lg shadow-(--brand-accent)/20
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111827] focus:ring-(--brand-accent)
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]
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
    </motion.button>
  );
}

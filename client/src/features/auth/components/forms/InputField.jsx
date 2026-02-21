import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InputField({ label, id, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-white/90">
          {label} {props.required ? <span className="text-(--danger)">*</span> : null}
        </label>
      ) : null}
      <div className="relative group">
        {Icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-(--brand-accent) transition-colors duration-300">
            <Icon size={18} />
          </div>
        ) : null}
        <input
          id={id}
          className={`
            w-full rounded-xl bg-[#0F172A] border px-4 py-3 text-white
            transition-all duration-300 ease-in-out placeholder:text-gray-400
            focus:outline-none focus:border-(--brand-accent) focus:ring-2 focus:ring-(--brand-accent)/30
            disabled:cursor-not-allowed disabled:opacity-50
            ${Icon ? 'pl-11' : ''}
            ${error
              ? 'border-(--danger) focus:border-(--danger) focus:ring-(--danger)/30'
              : 'border-white/10 hover:border-white/20'}
          `}
          {...props}
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute -bottom-5 left-0 text-xs text-(--danger)"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {/* Spacer for error text if needed to avoid layout shift, handled via margins usually but absolute is cleaner here with a wrapper, actually I'll just rely on the parent gap or add a conditional invisible spacer if needed, but keeping it simple */}
      {error ? <div className="h-4"></div> : null}
    </div>
  );
}

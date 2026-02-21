import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkbox({ id, label, checked, onChange, error }) {
  return (
    <div className="flex flex-col gap-1 text-white">
      <div className="flex items-center gap-3">
        <div className="relative flex h-5 w-5 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={`
              peer h-5 w-5 appearance-none rounded border-2 border-white/20 bg-[#0F172A]
              transition-all duration-300 ease-in-out cursor-pointer shrink-0
              checked:border-(--brand-accent) checked:bg-(--brand-accent)
              focus:outline-none focus:ring-2 focus:ring-(--brand-accent)/30 focus:ring-offset-1 focus:ring-offset-[#111827]
              ${error ? '!border-(--danger)' : ''}
              hover:border-white/40
            `}
          />
          <motion.svg
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="pointer-events-none absolute h-3.5 w-3.5 text-[#111827]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        </div>
        <label htmlFor={id} className="text-sm text-gray-400 cursor-pointer select-none hover:text-white/90 transition-colors duration-200">
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-(--danger) ml-8"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

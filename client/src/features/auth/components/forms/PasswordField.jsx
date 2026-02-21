import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PasswordField({ label, id, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-white/90">
          {label} {props.required ? <span className="text-(--danger)">*</span> : null}
        </label>
      ) : null}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-(--brand-accent) transition-colors duration-300">
          <Lock size={18} />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`
            w-full rounded-xl bg-[#0F172A] border px-4 py-3 pl-11 pr-11 text-white
            transition-all duration-300 ease-in-out placeholder:text-gray-400
            focus:outline-none focus:border-(--brand-accent) focus:ring-2 focus:ring-(--brand-accent)/30
            ${error
              ? 'border-(--danger) focus:border-(--danger) focus:ring-(--danger)/30'
              : 'border-white/10 hover:border-white/20'}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-300"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
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
      {error ? <div className="h-4"></div> : null}
    </div>
  );
}

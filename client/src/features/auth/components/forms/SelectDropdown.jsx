import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectDropdown({
  label,
  id,
  options,
  value,
  onChange,
  error,
  icon: Icon,
  placeholder = 'Select an option',
  required,
  className = '',
  variant = '',
}) {
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-white/90">
            {label} {required ? <span className="text-(--danger)">*</span> : null}
          </label>
        ) : null}
      </div>
      <div className="relative group">
        {Icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-(--brand-accent) transition-colors duration-300 pointer-events-none z-10">
            <Icon size={18} />
          </div>
        ) : null}
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={(() => {
            const base = [
              'w-full appearance-none',
              'rounded-xl',
              'py-3 text-sm',
              'transition-all duration-300 ease-in-out',
              'cursor-pointer shadow-sm',
              Icon ? 'pl-11 pr-11' : 'px-4 pr-11',
            ];

            if (variant === 'auth') {
              base.push('bg-[#0B1220]');
              base.push('border-white/6');
              base.push('text-white');
              base.push('focus:outline-none focus:border-(--brand-accent) focus:ring-2 focus:ring-(--brand-accent)/20');
            } else {
              base.push('bg-[#0F172A]');
              base.push('text-white');
              base.push('focus:outline-none focus:border-(--brand-accent) focus:ring-2 focus:ring-(--brand-accent)/30');
            }

            if (!value) base.push('text-gray-400');

            if (error) {
              base.push('border-(--danger)');
              base.push('focus:border-(--danger)');
              base.push('focus:ring-(--danger)/30');
            } else {
              base.push('hover:border-white/20');
            }

            return base.concat().join(' ');
          })()}
          required={required}
        >
          <option value="" disabled className="text-gray-400 bg-[#0F172A]">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id} className="text-white bg-[#0F172A] py-2">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-(--brand-accent) transition-colors duration-300">
          <ChevronDown size={18} />
        </div>
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

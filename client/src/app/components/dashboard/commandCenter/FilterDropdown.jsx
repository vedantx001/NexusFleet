import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function FilterDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonId = useId();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) setIsOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-between gap-3 min-w-[160px] px-4 py-2.5 rounded-xl bg-[#0F172A] border border-white/10 text-gray-300 hover:border-(--brand-accent)/50 hover:text-white transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-(--brand-accent)/40 focus:ring-offset-2 focus:ring-offset-[#0B1220]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium whitespace-nowrap">
          <span className="text-gray-500 mr-2">{label}:</span>
          {value === 'All' ? 'All' : value}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-(--brand-accent)' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            aria-labelledby={buttonId}
            className="absolute z-50 top-full left-0 mt-2 min-w-full w-max rounded-2xl bg-[#111827] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {options.map((option) => {
                const isSelected = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm transition-colors duration-200
                      ${isSelected ? 'bg-(--brand-accent)/10 text-(--brand-accent) font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                    `}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span>{option}</span>
                    {isSelected && <Check className="w-4 h-4 ml-3" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

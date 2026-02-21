import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-2xl bg-[var(--bg-surface)] shadow-2xl border border-[var(--border)] p-8 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Soft top border accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--info)] opacity-50" />

            <h3 id="modal-title" className="text-xl font-bold tracking-tight text-[var(--text-primary)] mb-6">{title}</h3>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

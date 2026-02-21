import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Drawer({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-screen max-w-lg pointer-events-auto"
            >
              <div className="flex h-full flex-col bg-[var(--bg-surface)] shadow-2xl border-l border-[var(--border)]">

                <header className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-main)]">
                  <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h2>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center rounded-xl p-2.5 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/5 transition-all outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)]"
                    aria-label="Close panel"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                  <div className="p-6">
                    {children}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

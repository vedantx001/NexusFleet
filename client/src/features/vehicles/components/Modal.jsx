import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-[var(--bg-surface)] shadow-2xl border border-[var(--border)] p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

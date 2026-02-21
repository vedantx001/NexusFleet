import React from 'react';

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
      {message}
    </div>
  );
}

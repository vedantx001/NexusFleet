import React from 'react';

export default function Checkbox({ id, label, checked, onChange, error }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <div className="flex h-5 items-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={`
              h-4 w-4 rounded border-[var(--border)] bg-[var(--bg-surface)]
              text-[var(--brand-primary)] accent-[var(--brand-primary)]
              focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:ring-offset-0
              transition-colors cursor-pointer
              ${error ? '!border-[var(--danger)]' : ''}
            `}
          />
        </div>
        <label htmlFor={id} className="text-sm text-[var(--text-secondary)] cursor-pointer select-none transition-colors">
          {label}
        </label>
      </div>
      {error ? <p className="text-xs text-[var(--danger)] ml-6">{error}</p> : null}
    </div>
  );
}

import React from 'react';

export default function InputField({ label, id, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)] transition-colors">
          {label} {props.required ? <span className="text-[var(--danger)]">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors">
            <Icon size={18} />
          </div>
        ) : null}
        <input
          id={id}
          className={`
            w-full rounded-lg border bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)]
            transition-all duration-200 placeholder:text-[var(--text-secondary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30
            disabled:cursor-not-allowed disabled:opacity-60
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20'
              : 'border-[var(--border)] focus:border-[var(--brand-accent)]'}
          `}
          {...props}
        />
      </div>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

import React from 'react';

export default function InputField({ label, id, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
          {label} {props.required ? <span className="text-[var(--danger)]">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        {Icon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            <Icon size={16} />
          </div>
        ) : null}
        <input
          id={id}
          className={`w-full rounded-lg border bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] transition-all placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 disabled:opacity-50 disabled:bg-[var(--bg-main)] disabled:cursor-not-allowed ${Icon ? 'pl-9' : ''} ${error ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--brand-primary)]'}`}
          {...props}
        />
      </div>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

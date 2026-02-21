import React from 'react';

export default function SelectDropdown({ label, id, options, error, required, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
          {label} {required ? <span className="text-[var(--danger)]">*</span> : null}
        </label>
      ) : null}
      <select
        id={id}
        className={`w-full appearance-none rounded-lg border bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 disabled:opacity-50 ${error ? 'border-[var(--danger)]' : 'border-[var(--border)] focus:border-[var(--brand-primary)]'}`}
        {...props}
      >
        <option value="" disabled>
          Select option...
        </option>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const labelText = typeof option === 'string' ? option : option.label;
          return (
            <option key={value} value={value}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

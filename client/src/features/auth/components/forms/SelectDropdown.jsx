import React from 'react';
import { ChevronDown } from 'lucide-react';

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
}) {
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)] transition-colors">
            {label} {required ? <span className="text-[var(--danger)]">*</span> : null}
          </label>
        ) : null}
        {selectedOption ? (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${selectedOption.color}`}>
            {selectedOption.label}
          </span>
        ) : null}
      </div>
      <div className="relative">
        {Icon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none transition-colors">
            <Icon size={18} />
          </div>
        ) : null}
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`
            w-full appearance-none rounded-lg border bg-[var(--bg-surface)] py-2.5 text-sm
            transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30
            ${Icon ? 'pl-10 pr-10' : 'px-3 pr-10'}
            ${!value ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}
            ${error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20'
              : 'border-[var(--border)] focus:border-[var(--brand-accent)]'}
          `}
          required={required}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

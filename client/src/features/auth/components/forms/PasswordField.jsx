import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordField({ label, id, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)] transition-colors">
          {label} {props.required ? <span className="text-[var(--danger)]">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors">
          <Lock size={18} />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`
            w-full rounded-lg border bg-[var(--bg-surface)] pl-10 pr-10 py-2.5 text-sm text-[var(--text-primary)]
            transition-all duration-200 placeholder:text-[var(--text-secondary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30
            ${error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20'
              : 'border-[var(--border)] focus:border-[var(--brand-accent)]'}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

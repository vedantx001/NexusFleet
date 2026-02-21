import React from 'react';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
      {footer ? <div className="mt-4 text-center text-sm text-slate-300">{footer}</div> : null}
    </div>
  );
}

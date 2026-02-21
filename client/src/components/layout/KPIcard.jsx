import React from "react";

export default function KPIcard({ title, value = "—", label, description }) {
  return (
    <div className="card p-6 md:p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-md-token border-l-4 border-l-[var(--brand-accent)] flex flex-col justify-between h-full">
      
      {/* Header Area */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-widest text-muted truncate">
            {title}
          </div>
          {description ? (
            <div className="mt-2 text-xs text-muted/80 leading-relaxed max-w-[90%]">
              {description}
            </div>
          ) : null}
        </div>

        {label ? (
          <div className="shrink-0">
            <span className="badge bg-main border-default text-muted shadow-sm-token px-2 py-1 text-[10px] uppercase tracking-wider">
              {label}
            </span>
          </div>
        ) : null}
      </div>

      {/* Value Area */}
      <div className="mt-auto">
        <div className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
          {value}
        </div>
      </div>
      
      {/* Subtle background glow effect (visible on hover) */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--brand-accent)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10 pointer-events-none" />
    </div>
  );
}
import React from 'react';
import { Moon, ShieldCheck, Sun, Truck } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle, isDark, toggleTheme }) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-main)] font-sans text-[var(--text-primary)] transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="lg:hidden absolute top-8 right-6 z-50 p-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-accent)] transition-colors shadow-sm"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="hidden w-5/12 flex-col justify-between bg-[var(--brand-primary)] p-10 lg:flex relative overflow-hidden transition-colors duration-300">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--info)] opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[var(--brand-accent)] opacity-10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[var(--bg-surface)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-accent)] shadow-lg">
              <Truck size={24} className="text-[#000000]" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NexusFleet</span>
          </div>
          <p className="mt-6 max-w-sm text-lg text-[var(--bg-main)] opacity-80 font-light leading-relaxed">
            Enterprise command center for modern fleet operations and logistics management.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-[var(--bg-main)]/10 bg-[var(--bg-surface)]/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success)]/20 text-[var(--success)]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--bg-surface)]">Bank-grade Security</h4>
                <p className="text-sm text-[var(--bg-main)] opacity-60 mt-1">SOC2 Type II Certified Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--bg-main)] opacity-50">
            <span>© 2026 NexusFleet Technologies. All rights reserved.</span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-7/12 lg:px-20 xl:px-32 relative">
        <button
          onClick={toggleTheme}
          className="hidden lg:flex absolute top-8 right-8 p-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-accent)] hover:border-[var(--brand-accent)] transition-all shadow-sm"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="absolute top-8 left-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-primary)] shadow-sm">
            <Truck size={18} className="text-[var(--bg-surface)]" />
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">NexusFleet</span>
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-xl">
          <div className="mb-8 text-center lg:text-left mt-8 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] transition-colors">{title}</h1>
            <p className="mt-2 text-[var(--text-secondary)] transition-colors">{subtitle}</p>
          </div>

          <div className="card p-6 sm:p-8 transition-colors duration-300">{children}</div>
        </div>
      </div>
    </div>
  );
}

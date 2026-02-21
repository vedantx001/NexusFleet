import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

export default function AppShell() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const navLinkClass = ({ isActive }) =>
    [
      'rounded-lg px-3 py-2 text-sm font-semibold transition',
      isActive
        ? 'bg-(--brand-primary) text-(--bg-surface)'
        : 'text-(--text-secondary) hover:bg-(--bg-main) hover:text-(--text-primary)',
    ].join(' ');

  return (
    <div className="min-h-full">
      <header className="border-b border-(--border) bg-(--bg-surface) backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link className="text-sm font-bold tracking-tight text-(--text-primary)" to="/">
            Template
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>

            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/dispatch" className={navLinkClass}>
              Trip Dispatcher
            </NavLink>

            <button
              type="button"
              onClick={() => setIsDark((v) => !v)}
              className="ml-2 inline-flex items-center justify-center rounded-xl p-2.5 transition border border-(--border) bg-(--bg-main) text-(--text-secondary) hover:text-(--brand-accent) focus:outline-none focus:ring-2 focus:ring-(--brand-accent) focus:ring-offset-2 focus:ring-offset-(--bg-surface)"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </nav>

          <div className="hidden text-xs text-(--text-secondary) md:block">Local mode</div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-(--border) px-4 py-6">
        <div className="mx-auto max-w-6xl text-center text-xs text-(--text-secondary)">
          Built with MERN • Tailwind enabled
        </div>
      </footer>
    </div>
  );
}

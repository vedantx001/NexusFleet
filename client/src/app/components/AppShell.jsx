import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Moon, Sun, Command, Bell, User } from 'lucide-react';
import useAuth from '../../features/auth/hooks/useAuth';

export default function AppShell() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const onLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${isActive ? 'bg-(--brand-accent)/10 text-(--brand-accent)' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  const allNavItems = [
    { to: '/dashboard', label: 'Dashboard', roles: ['MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] },
    { to: '/vehicles', label: 'Vehicles', roles: ['MANAGER', 'SAFETY_OFFICER'] },
    { to: '/drivers', label: 'Drivers', roles: ['MANAGER', 'SAFETY_OFFICER'] },
    { to: '/trips', label: 'Trip Dispatcher', roles: ['MANAGER', 'DISPATCHER'] },
    { to: '/maintenance', label: 'Maintenance', roles: ['MANAGER', 'FINANCIAL_ANALYST'] },
    { to: '/expenses', label: 'Expenses', roles: ['MANAGER', 'FINANCIAL_ANALYST'] },
    { to: '/analytics', label: 'Analytics', roles: ['MANAGER'] },
  ];

  const userRole = user?.role || '';
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex min-h-screen bg-[#0B1220] text-white transition-colors duration-300">

      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0B1220] fixed h-full z-40">
        <div className="p-6">
          <NavLink className="flex items-center gap-3 group" to="/dashboard">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--brand-accent) to-sky-500 flex items-center justify-center shadow-lg shadow-(--brand-accent)/20 group-hover:shadow-(--brand-accent)/40 transition-all duration-300">
              <Command className="w-5 h-5 text-[#0B1220]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Fleet<span className="text-(--brand-accent)">Flow</span>
            </span>
          </NavLink>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto overflow-x-hidden">
          {isAuthenticated && navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          {isAuthenticated && (
            <button
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
              type="button"
              onClick={onLogout}
            >
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative w-full">

        {/* TOP NAVBAR (Icons only) */}
        <header className="sticky top-0 z-30 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/5 h-20 px-6 flex items-center justify-between lg:justify-end shrink-0">

          {/* Mobile Logo fallback */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--brand-accent) to-sky-500 flex items-center justify-center shadow-md">
              <Command className="w-4 h-4 text-[#0B1220]" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-(--brand-accent) shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            </button>

            <button
              type="button"
              onClick={() => setIsDark((v) => !v)}
              className="p-2.5 rounded-full bg-white/5 text-gray-400 hover:text-(--brand-accent) hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-8 w-px bg-white/10 mx-2" />

            <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-white/5 transition-all">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#111827] border border-white/10 text-gray-400">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 w-full mx-auto relative z-10 animate-fade-in pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

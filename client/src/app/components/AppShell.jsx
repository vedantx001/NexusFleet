import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';

export default function AppShell() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    [
      'rounded-lg px-3 py-2 text-sm font-semibold transition',
      isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white',
    ].join(' ');

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link className="text-sm font-bold tracking-tight text-white" to="/">
            Template
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <button className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800" type="button" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Register
                </NavLink>
              </>
            )}
          </nav>

          <div className="hidden text-xs text-slate-400 md:block">
            {isAuthenticated ? `Signed in as ${user?.email || 'user'}` : 'Not signed in'}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 px-4 py-6">
        <div className="mx-auto max-w-6xl text-center text-xs text-slate-500">
          Built with MERN • Tailwind enabled
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-300">Template</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Production-ready MERN starter
              </h1>
              <p className="mt-3 max-w-xl text-slate-300">
                React (Vite) + Express + MongoDB with a clean architecture, unified API responses,
                and Tailwind CSS that works out of the box.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Link className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-500/90" to="/dashboard">Go to dashboard</Link>
                ) : (
                  <>
                    <Link className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-500/90" to="/register">Get started</Link>
                    <Link className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800" to="/login">Sign in</Link>
                  </>
                )}
              </div>
            </div>

            <div className="w-full md:max-w-sm">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs font-semibold text-slate-400">Included</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  <li className="flex items-center justify-between">
                    <span>Tailwind CSS</span>
                    <span className="text-indigo-300">Enabled</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>JWT auth</span>
                    <span className="text-indigo-300">Cookie-based</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>API responses</span>
                    <span className="text-indigo-300">Unified</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Feature-first client</span>
                    <span className="text-indigo-300">Ready</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Tip: set <span className="font-semibold text-slate-200">VITE_API_URL</span> for production builds.
        </p>
      </div>
    </div>
  );
}

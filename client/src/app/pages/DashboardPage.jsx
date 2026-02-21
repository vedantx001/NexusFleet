import React from 'react';
import useAuth from '../../features/auth/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-300">You are signed in.</p>

          <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/30 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Name</span>
              <span className="font-semibold text-slate-100">{user?.name || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email</span>
              <span className="font-semibold text-slate-100">{user?.email || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">User ID</span>
              <span className="font-mono text-xs text-slate-200">{user?.id || user?._id || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">NexusFleet</h1>
        <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
          Manage your fleet operations from a single command center.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/login" className="btn-primary inline-flex items-center justify-center px-4 py-2 text-sm font-semibold">
            Login
          </Link>
          <Link to="/signup" className="btn-accent inline-flex items-center justify-center px-4 py-2 text-sm font-semibold">
            Signup
          </Link>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function DashboardPage() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Authentication succeeded. Your operations dashboard is ready.
        </p>
      </div>
    </section>
  );
}

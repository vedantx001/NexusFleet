import React from 'react';
import { Activity } from 'lucide-react';
import CommandCenterFilters from './CommandCenterFilters';

export default function CommandCenterHeader({ filters, onChangeFilters }) {
  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--brand-primary) to-(--text-primary) flex items-center justify-center shadow-(--shadow-md)">
          <Activity className="w-5 h-5 text-(--bg-surface)" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">Command Center</h1>
          <p className="text-xs font-medium text-(--text-secondary) tracking-wider uppercase">Operational Overview</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CommandCenterFilters filters={filters} onChange={onChangeFilters} />
      </div>
    </header>
  );
}

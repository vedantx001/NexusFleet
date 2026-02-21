import React, { useEffect, useState } from 'react';
import KPIGrid from './KPIGrid';
import CommandCenterHeader from './commandCenter/CommandCenterHeader';
import StatusOverview from './commandCenter/StatusOverview';

export default function CommandCenterDashboard() {
  const [pulseKey, setPulseKey] = useState(0);

  const [filters, setFilters] = useState({
    type: 'All',
    status: 'All',
    region: 'All',
  });

  useEffect(() => {
    const interval = setInterval(() => setPulseKey((v) => v + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-(--brand-accent) opacity-[0.06] blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <CommandCenterHeader
          filters={filters}
          onChangeFilters={setFilters}
        />

        <main className="space-y-8">
          <KPIGrid filters={filters} pulseKey={pulseKey} />
          <StatusOverview filters={filters} onSync={() => setPulseKey((v) => v + 1)} />
        </main>
      </div>
    </div>
  );
}

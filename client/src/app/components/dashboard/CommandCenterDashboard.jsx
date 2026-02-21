import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import KPIGrid from './KPIGrid';
import CommandCenterHeader from './commandCenter/CommandCenterHeader';
import StatusOverview from './commandCenter/StatusOverview';
import CommandCenterFilters from './commandCenter/CommandCenterFilters';

export default function CommandCenterDashboard() {
  const [pulseKey, setPulseKey] = useState(0);

  const [filters, setFilters] = useState({
    type: 'All',
    status: 'All',
    region: 'All',
  });

  useEffect(() => {
    // Background data refresh trigger
    const interval = setInterval(() => setPulseKey((v) => v + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setPulseKey((v) => v + 1);
  };

  return (
    <div className="min-h-[calc(100vh-[80px])] relative w-full font-sans text-white bg-[#0B1220] selection:bg-(--brand-accent)/30 selection:text-(--brand-accent)">

      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-(--brand-accent)/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        <CommandCenterHeader
          filters={filters}
          onChangeFilters={setFilters}
          onRefresh={handleManualRefresh}
        />

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* Filters Bar sticky optional */}
          <div className="sticky top-20 z-20">
            <CommandCenterFilters filters={filters} onChange={setFilters} />
          </div>

          <KPIGrid filters={filters} pulseKey={pulseKey} />

          <StatusOverview filters={filters} onSync={handleManualRefresh} />
        </motion.main>
      </div>
    </div>
  );
}

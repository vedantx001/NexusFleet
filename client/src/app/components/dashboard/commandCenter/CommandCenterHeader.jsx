import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommandCenterHeader({ filters, onChangeFilters, onRefresh }) {
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/5 mb-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--brand-accent) to-sky-500 flex items-center justify-center shadow-lg shadow-(--brand-accent)/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Activity className="w-6 h-6 text-[#0B1220] relative z-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Command Center</h1>
          <p className="text-sm font-medium text-gray-400">Real-time fleet operational overview</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="px-4 py-2.5 rounded-xl bg-[#111827] border border-white/5 text-sm font-medium text-gray-300 shadow-sm">
          {currentDate}
        </div>

        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl bg-[#111827] border border-white/5 text-gray-400 hover:text-(--brand-accent) hover:border-(--brand-accent)/50 hover:bg-(--brand-accent)/5 shadow-sm transition-all duration-300 group"
          aria-label="Refresh Data"
        >
          <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </motion.header>
  );
}

import React from 'react';
import FilterDropdown from './FilterDropdown';
import { motion } from 'framer-motion';

export const VEHICLE_TYPE_OPTIONS = ['All', 'Truck', 'Van', 'Bike'];
export const VEHICLE_STATUS_OPTIONS = ['All', 'Available', 'On Trip', 'In Shop'];
export const REGION_OPTIONS = ['All', 'North America', 'EMEA', 'APAC'];

export default function CommandCenterFilters({ filters, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-wrap items-center gap-4 bg-[#111827]/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg mb-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
        </div>
        <span className="text-sm font-semibold text-gray-300 mr-2 uppercase tracking-wider">Filters</span>
      </div>

      <div className="h-6 w-px bg-white/10 hidden sm:block" />

      <FilterDropdown
        label="Type"
        options={VEHICLE_TYPE_OPTIONS}
        value={filters.type}
        onChange={(type) => onChange({ ...filters, type })}
      />

      <FilterDropdown
        label="Status"
        options={VEHICLE_STATUS_OPTIONS}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
      />

      <FilterDropdown
        label="Region"
        options={REGION_OPTIONS}
        value={filters.region}
        onChange={(region) => onChange({ ...filters, region })}
      />
    </motion.div>
  );
}

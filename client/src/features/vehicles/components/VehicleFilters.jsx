import React from 'react';
import { Filter, Search } from 'lucide-react';
import { VEHICLE_STATUSES, VEHICLE_TYPES } from '../constants/vehicleConstants';
import InputField from './forms/InputField';
import SelectDropdown from './forms/SelectDropdown';

export default function VehicleFilters({ filters, setFilters, searchQuery, setSearchQuery }) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow-md)] flex flex-wrap items-center gap-4 relative z-10 w-full">

      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 border-r border-[var(--border)] pr-4 mr-2">
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center">
          <Filter size={16} className="text-[var(--text-secondary)]" />
        </div>
        <span className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:block">Filters</span>
      </div>

      <div className="flex-1 min-w-[200px]">
        <InputField
          id="search"
          placeholder="Search by name or plate..."
          icon={Search}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div className="w-full sm:w-[180px]">
        <SelectDropdown
          id="filter-type"
          value={filters.type}
          onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
          options={[{ value: 'All', label: 'All Types' }, ...VEHICLE_TYPES.map((type) => ({ value: type, label: type }))]}
        />
      </div>

      <div className="w-full sm:w-[180px]">
        <SelectDropdown
          id="filter-status"
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          options={[
            { value: 'All', label: 'All Statuses' },
            ...Object.values(VEHICLE_STATUSES).map((status) => ({ value: status.id, label: status.id })),
          ]}
        />
      </div>

      <div className="w-full sm:w-auto shrink-0">
        <button
          onClick={() => {
            setSearchQuery('');
            setFilters({ type: 'All', status: 'All' });
          }}
          className="w-full sm:w-auto h-[46px] px-5 flex items-center justify-center gap-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] border border-[var(--border)] transition-all duration-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

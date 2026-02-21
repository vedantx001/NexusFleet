import React from 'react';
import { Filter, Search } from 'lucide-react';
import { VEHICLE_STATUSES, VEHICLE_TYPES } from '../constants/vehicleConstants';
import InputField from './forms/InputField';
import SelectDropdown from './forms/SelectDropdown';

export default function VehicleFilters({ filters, setFilters, searchQuery, setSearchQuery }) {
  return (
    <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-4 items-end">
      <div className="w-full sm:w-1/3">
        <InputField
          id="search"
          placeholder="Search by name or plate..."
          icon={Search}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>
      <div className="w-full sm:w-1/4">
        <SelectDropdown
          id="filter-type"
          value={filters.type}
          onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
          options={[{ value: 'All', label: 'All Types' }, ...VEHICLE_TYPES.map((type) => ({ value: type, label: type }))]}
        />
      </div>
      <div className="w-full sm:w-1/4">
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
      <div className="w-full sm:w-auto">
        <button
          onClick={() => {
            setSearchQuery('');
            setFilters({ type: 'All', status: 'All' });
          }}
          className="btn-secondary w-full h-[38px] flex items-center justify-center gap-2"
        >
          <Filter size={16} /> Clear
        </button>
      </div>
    </div>
  );
}

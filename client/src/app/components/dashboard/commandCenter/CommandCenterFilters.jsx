import React from 'react';
import FilterDropdown from './FilterDropdown';

export const VEHICLE_TYPE_OPTIONS = ['All', 'Truck', 'Van', 'Bike'];
export const VEHICLE_STATUS_OPTIONS = ['All', 'On Trip', 'Idle', 'In Shop'];
export const REGION_OPTIONS = ['All', 'North America', 'EMEA', 'APAC'];

export default function CommandCenterFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterDropdown
        label="Vehicle Type"
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
    </div>
  );
}

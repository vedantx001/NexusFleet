import { useMemo } from 'react';

export default function useVehicleFilters({ vehicles, searchQuery, filters }) {
  return useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filters.type === 'All' || vehicle.type === filters.type;
      const matchesStatus = filters.status === 'All' || vehicle.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, searchQuery, filters]);
}

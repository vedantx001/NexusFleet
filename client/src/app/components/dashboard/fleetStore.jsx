import React, { createContext, useContext, useMemo, useReducer } from 'react';

const FleetContext = createContext(null);

const initialState = {
  vehicles: [
    { id: 'VH-001', label: 'Unit 3041', maxCapacity: 1200, isAvailable: false, type: 'Truck', region: 'North America', status: 'On Trip' },
    { id: 'VH-002', label: 'Unit 3042', maxCapacity: 900, isAvailable: false, type: 'Van', region: 'EMEA', status: 'Idle' },
    { id: 'VH-003', label: 'Unit 3043', maxCapacity: 1500, isAvailable: true, type: 'Truck', region: 'APAC', status: 'Idle' },
    { id: 'VH-004', label: 'Unit 3044', maxCapacity: 700, isAvailable: false, type: 'Bike', region: 'North America', status: 'In Shop' },
    { id: 'VH-005', label: 'Unit 3045', maxCapacity: 1100, isAvailable: true, type: 'Van', region: 'EMEA', status: 'Idle' },
  ],
  drivers: [
    { id: 'DR-001', name: 'A. Carter', isAvailable: false },
    { id: 'DR-002', name: 'R. Singh', isAvailable: false },
    { id: 'DR-003', name: 'M. Alvarez', isAvailable: true },
    { id: 'DR-004', name: 'S. Nakamura', isAvailable: false },
  ],
  trips: [
    {
      id: 'TRP-001',
      destination: 'Sector 4 Distribution',
      cargo: 'Electronics',
      cargoWeight: 680,
      vehicleId: 'VH-001',
      driverId: 'DR-001',
      status: 'Dispatched',
    },
    {
      id: 'TRP-002',
      destination: 'Northern Hub',
      cargo: 'Medical Supplies',
      cargoWeight: 420,
      vehicleId: 'VH-002',
      driverId: 'DR-002',
      status: 'Draft',
    },
    {
      id: 'TRP-003',
      destination: 'Eastern Port',
      cargo: 'Machinery',
      cargoWeight: 980,
      vehicleId: 'VH-003',
      driverId: 'DR-003',
      status: 'Completed',
    },
    {
      id: 'TRP-004',
      destination: 'Central Core',
      cargo: 'Raw Materials',
      cargoWeight: 510,
      vehicleId: 'VH-004',
      driverId: 'DR-004',
      status: 'Draft',
    },
  ],
};

function setAvailabilityById(items, id, isAvailable) {
  return items.map((item) => (item.id === id ? { ...item, isAvailable } : item));
}

function setVehicleStatusById(vehicles, id, status) {
  return vehicles.map((vehicle) => (vehicle.id === id ? { ...vehicle, status } : vehicle));
}

function fleetReducer(state, action) {
  switch (action.type) {
    case 'CREATE_TRIP': {
      const nextIndex = state.trips.length + 1;
      const nextId = `TRP-${String(nextIndex).padStart(3, '0')}`;

      const { vehicleId, driverId } = action.payload || {};

      return {
        ...state,
        // Reserve resources immediately in Draft to avoid double-booking.
        vehicles: vehicleId ? setAvailabilityById(state.vehicles, vehicleId, false) : state.vehicles,
        drivers: driverId ? setAvailabilityById(state.drivers, driverId, false) : state.drivers,
        trips: [
          {
            id: nextId,
            status: 'Draft',
            ...action.payload,
          },
          ...state.trips,
        ],
      };
    }
    case 'UPDATE_TRIP_STATUS': {
      const { id, status } = action.payload || {};
      const existing = state.trips.find((t) => t.id === id);
      if (!existing) return state;

      const nextTrips = state.trips.map((trip) => (trip.id === id ? { ...trip, status } : trip));

       if (status === 'Dispatched') {
         return {
           ...state,
           vehicles: existing.vehicleId ? setVehicleStatusById(state.vehicles, existing.vehicleId, 'On Trip') : state.vehicles,
           trips: nextTrips,
         };
       }

      if (status === 'Completed' || status === 'Cancelled') {
        const nextVehicles = existing.vehicleId
          ? setVehicleStatusById(setAvailabilityById(state.vehicles, existing.vehicleId, true), existing.vehicleId, 'Idle')
          : state.vehicles;

        return {
          ...state,
          vehicles: nextVehicles,
          drivers: existing.driverId ? setAvailabilityById(state.drivers, existing.driverId, true) : state.drivers,
          trips: nextTrips,
        };
      }

      return { ...state, trips: nextTrips };
    }
    case 'CANCEL_TRIP': {
      const { id } = action.payload || {};
      const existing = state.trips.find((t) => t.id === id);
      if (!existing) return state;

      const nextVehicles = existing.vehicleId
        ? setVehicleStatusById(setAvailabilityById(state.vehicles, existing.vehicleId, true), existing.vehicleId, 'Idle')
        : state.vehicles;

      return {
        ...state,
        vehicles: nextVehicles,
        drivers: existing.driverId ? setAvailabilityById(state.drivers, existing.driverId, true) : state.drivers,
        trips: state.trips.map((trip) => (trip.id === id ? { ...trip, status: 'Cancelled' } : trip)),
      };
    }
    default:
      return state;
  }
}

export function FleetProvider({ children }) {
  const [state, dispatch] = useReducer(fleetReducer, initialState);

  const derived = useMemo(() => {
    const totalVehicles = state.vehicles.length;
    const activeFleet = state.vehicles.filter((v) => v.status === 'On Trip').length;
    const maintenanceAlerts = state.vehicles.filter((v) => v.status === 'In Shop').length;
    const pendingCargo = state.trips.filter((t) => t.status === 'Draft').length;
    const idleAvailable = state.vehicles.filter((v) => v.status === 'Idle' && v.isAvailable).length;
    const utilizationRate = totalVehicles ? Math.min(100, Math.round(((totalVehicles - idleAvailable) / totalVehicles) * 100)) : 0;

    return { activeFleet, maintenanceAlerts, pendingCargo, utilizationRate, totalVehicles };
  }, [state.vehicles, state.trips]);

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      ...derived,
    }),
    [state, dispatch, derived]
  );

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) throw new Error('useFleet must be used within FleetProvider');
  return context;
}

import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { INITIAL_VEHICLES, VEHICLE_STATUSES } from '../features/vehicles/constants/vehicleConstants';
import seedDrivers from '../mock/drivers';

const FleetContext = createContext(null);

function nowIso() {
  return new Date().toISOString();
}

function toDateOnly(isoLike) {
  if (!isoLike) return '';
  const value = String(isoLike);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function parseDateOnly(value) {
  if (!value) return null;
  const s = String(value);
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, monthIndex, day);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfToday() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isLicenseExpired(licenseExpiryDate) {
  const expiry = parseDateOnly(licenseExpiryDate);
  if (!expiry) return false;
  return expiry < startOfToday();
}

function normalizeDriver(raw) {
  const categories = raw?.licenseCategories;

  return {
    id: raw?.id || `drv_${Math.random().toString(36).slice(2, 10)}`,
    name: raw?.name || 'Unnamed Driver',
    licenseNumber: raw?.licenseNumber || '',
    licenseExpiryDate: raw?.licenseExpiryDate || '',
    licenseCategories: Array.isArray(categories) && categories.length ? categories : ['Van'],
    dutyStatus: raw?.dutyStatus || 'Off Duty',
    status: raw?.status || 'Available',
    safetyScore: typeof raw?.safetyScore === 'number' ? raw.safetyScore : undefined,
  };
}

function normalizeVehicle(raw) {
  return {
    ...raw,
    id: raw?.id || Math.random().toString(36).slice(2, 11),
    name: String(raw?.name || '').trim(),
    plate: String(raw?.plate || '').trim().toUpperCase(),
    type: raw?.type || 'Van',
    capacity: typeof raw?.capacity === 'number' ? raw.capacity : Number(raw?.capacity),
    odometer: typeof raw?.odometer === 'number' ? raw.odometer : Number(raw?.odometer),
    status: raw?.status || VEHICLE_STATUSES.AVAILABLE.id,
    region: raw?.region || 'Unassigned',
    lastMaintained: raw?.lastMaintained ? toDateOnly(raw.lastMaintained) : toDateOnly(nowIso()),
  };
}

const initialState = {
  vehicles: Array.isArray(INITIAL_VEHICLES) ? INITIAL_VEHICLES.map(normalizeVehicle) : [],
  drivers: Array.isArray(seedDrivers) ? seedDrivers.map(normalizeDriver) : [],
  trips: [],
  maintenanceLogs: [],
  fuelLogs: [],
};

function updateById(items, id, patch) {
  return items.map((item) => (String(item.id) === String(id) ? { ...item, ...patch } : item));
}

function fleetReducer(state, action) {
  switch (action.type) {
    case 'ADD_VEHICLE': {
      const vehicle = normalizeVehicle(action.payload);
      return { ...state, vehicles: [vehicle, ...state.vehicles] };
    }

    case 'UPDATE_VEHICLE': {
      const { id, patch } = action.payload || {};
      if (!id) return state;
      return {
        ...state,
        vehicles: updateById(state.vehicles, id, normalizeVehicle({ ...state.vehicles.find((v) => String(v.id) === String(id)), ...patch })),
      };
    }

    case 'DELETE_VEHICLE': {
      const { id } = action.payload || {};
      if (!id) return state;
      return { ...state, vehicles: state.vehicles.filter((v) => String(v.id) !== String(id)) };
    }

    case 'SET_VEHICLE_STATUS': {
      const { id, status } = action.payload || {};
      if (!id || !status) return state;
      return { ...state, vehicles: updateById(state.vehicles, id, { status }) };
    }

    case 'ADD_DRIVER': {
      const driver = normalizeDriver(action.payload);
      return { ...state, drivers: [driver, ...state.drivers] };
    }

    case 'UPDATE_DRIVER': {
      const { id, patch } = action.payload || {};
      if (!id) return state;

      const existing = state.drivers.find((d) => String(d.id) === String(id));
      if (!existing) return state;

      return { ...state, drivers: updateById(state.drivers, id, normalizeDriver({ ...existing, ...patch })) };
    }

    case 'SET_DRIVER_STATUS': {
      const { id, status } = action.payload || {};
      if (!id || !status) return state;
      return { ...state, drivers: updateById(state.drivers, id, { status }) };
    }

    case 'CREATE_TRIP': {
      const nextIndex = state.trips.length + 1;
      const id = `TRP-${String(nextIndex).padStart(3, '0')}`;

      return {
        ...state,
        trips: [
          {
            id,
            status: 'Draft',
            createdAt: nowIso(),
            ...action.payload,
          },
          ...state.trips,
        ],
      };
    }

    case 'DISPATCH_TRIP': {
      const { id } = action.payload || {};
      if (!id) return state;

      const trip = state.trips.find((t) => t.id === id);
      if (!trip) return state;

      const vehicle = state.vehicles.find((v) => String(v.id) === String(trip.vehicleId));
      const driver = state.drivers.find((d) => String(d.id) === String(trip.driverId));

      if (!vehicle || !driver) return state;
      if (vehicle.status !== VEHICLE_STATUSES.AVAILABLE.id) return state;
      if (driver.status !== 'Available') return state;

      const isExpired = isLicenseExpired(driver.licenseExpiryDate);
      const hasCategory = Array.isArray(driver.licenseCategories) && driver.licenseCategories.includes(vehicle.type);
      if (isExpired || !hasCategory) return state;

      const dispatchedAt = nowIso();

      return {
        ...state,
        vehicles: updateById(state.vehicles, vehicle.id, { status: VEHICLE_STATUSES.ON_TRIP.id }),
        drivers: updateById(state.drivers, driver.id, { status: 'On Trip' }),
        trips: state.trips.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'Dispatched',
                dispatchedAt,
                startOdometer: typeof vehicle.odometer === 'number' ? vehicle.odometer : null,
              }
            : t,
        ),
      };
    }

    case 'COMPLETE_TRIP': {
      const { id, endOdometer } = action.payload || {};
      if (!id) return state;

      const trip = state.trips.find((t) => t.id === id);
      if (!trip) return state;

      const vehicle = state.vehicles.find((v) => String(v.id) === String(trip.vehicleId));
      const driver = state.drivers.find((d) => String(d.id) === String(trip.driverId));
      if (!vehicle || !driver) return state;

      const numericEnd = typeof endOdometer === 'number' ? endOdometer : Number(endOdometer);
      if (!Number.isFinite(numericEnd) || numericEnd < 0) return state;

      const startOdo = typeof trip.startOdometer === 'number' ? trip.startOdometer : vehicle.odometer;
      if (typeof startOdo === 'number' && numericEnd < startOdo) return state;

      const completedAt = nowIso();

      return {
        ...state,
        vehicles: updateById(state.vehicles, vehicle.id, {
          status: VEHICLE_STATUSES.AVAILABLE.id,
          odometer: numericEnd,
        }),
        drivers: updateById(state.drivers, driver.id, { status: 'Available' }),
        trips: state.trips.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'Completed',
                completedAt,
                endOdometer: numericEnd,
              }
            : t,
        ),
      };
    }

    case 'CANCEL_TRIP': {
      const { id } = action.payload || {};
      if (!id) return state;

      const trip = state.trips.find((t) => t.id === id);
      if (!trip) return state;

      // Only release resources if already dispatched.
      const vehicleId = trip.vehicleId;
      const driverId = trip.driverId;

      const shouldRelease = trip.status === 'Dispatched';

      return {
        ...state,
        vehicles: shouldRelease && vehicleId ? updateById(state.vehicles, vehicleId, { status: VEHICLE_STATUSES.AVAILABLE.id }) : state.vehicles,
        drivers: shouldRelease && driverId ? updateById(state.drivers, driverId, { status: 'Available' }) : state.drivers,
        trips: state.trips.map((t) => (t.id === id ? { ...t, status: 'Cancelled', cancelledAt: nowIso() } : t)),
      };
    }

    case 'LOG_MAINTENANCE': {
      const { vehicleId, maintenanceType, notes, date, cost } = action.payload || {};
      if (!vehicleId || !maintenanceType) return state;

      const log = {
        id: `mnt_${Date.now()}`,
        vehicleId: String(vehicleId),
        type: String(maintenanceType),
        notes: notes ? String(notes) : '',
        date: toDateOnly(date) || toDateOnly(nowIso()),
        cost: typeof cost === 'number' ? cost : cost === '' || cost == null ? null : Number(cost),
        createdAt: nowIso(),
      };

      return {
        ...state,
        vehicles: updateById(state.vehicles, vehicleId, {
          status: VEHICLE_STATUSES.IN_SHOP.id,
          lastMaintained: log.date,
        }),
        maintenanceLogs: [log, ...state.maintenanceLogs],
      };
    }

    case 'COMPLETE_MAINTENANCE': {
      const { vehicleId } = action.payload || {};
      if (!vehicleId) return state;

      return {
        ...state,
        vehicles: updateById(state.vehicles, vehicleId, {
          status: VEHICLE_STATUSES.AVAILABLE.id,
          lastMaintained: toDateOnly(nowIso()),
        }),
      };
    }

    case 'LOG_FUEL': {
      const { vehicleId, liters, amount, date } = action.payload || {};
      if (!vehicleId) return state;

      const entry = {
        id: `fuel_${Date.now()}`,
        vehicleId: String(vehicleId),
        liters: typeof liters === 'number' ? liters : Number(liters),
        amount: typeof amount === 'number' ? amount : Number(amount),
        date: toDateOnly(date) || toDateOnly(nowIso()),
        createdAt: nowIso(),
      };

      return { ...state, fuelLogs: [entry, ...state.fuelLogs] };
    }

    default:
      return state;
  }
}

export function FleetProvider({ children }) {
  const [state, dispatch] = useReducer(fleetReducer, initialState);

  const derived = useMemo(() => {
    const vehiclesById = Object.fromEntries(state.vehicles.map((v) => [String(v.id), v]));
    const driversById = Object.fromEntries(state.drivers.map((d) => [String(d.id), d]));

    return { vehiclesById, driversById };
  }, [state.vehicles, state.drivers]);

  const value = useMemo(() => ({ ...state, dispatch, ...derived }), [state, dispatch, derived]);

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) throw new Error('useFleet must be used within FleetProvider');
  return context;
}

export const VEHICLE_ROLES = {
  MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY: 'Safety Officer',
  FINANCE: 'Financial Analyst',
};

export const VEHICLE_STATUSES = {
  AVAILABLE: { id: 'Available', color: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]' },
  ON_TRIP: { id: 'On Trip', color: 'text-[var(--info)] bg-[var(--info)]/10 border-[var(--info)]' },
  MAINTENANCE_REQUESTED: {
    id: 'Maintenance Requested',
    color: 'text-[var(--brand-accent)] bg-[var(--brand-accent)]/10 border-[var(--brand-accent)]',
  },
  IN_SHOP: { id: 'In Shop', color: 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]' },
  OUT_OF_SERVICE: {
    id: 'Out Of Service',
    color: 'text-[var(--text-secondary)] bg-[var(--text-secondary)]/10 border-[var(--border)]',
  },
};

export const VEHICLE_TYPES = ['Truck', 'Van', 'Bike'];

export const INITIAL_VEHICLES = [
  {
    id: '1',
    name: 'Van-05',
    plate: 'VAN-8892',
    type: 'Van',
    capacity: 500,
    odometer: 45000,
    status: 'Available',
    region: 'North',
    lastMaintained: '2026-01-15',
  },
  {
    id: '2',
    name: 'Truck-02',
    plate: 'TRK-1024',
    type: 'Truck',
    capacity: 8000,
    odometer: 120500,
    status: 'On Trip',
    region: 'South',
    lastMaintained: '2025-11-20',
  },
  {
    id: '3',
    name: 'Bike-03',
    plate: 'BIK-0091',
    type: 'Bike',
    capacity: 50,
    odometer: 1200,
    status: 'In Shop',
    region: 'East',
    lastMaintained: '2026-02-10',
  },
  {
    id: '4',
    name: 'Van-08',
    plate: 'VAN-4421',
    type: 'Van',
    capacity: 1500,
    odometer: 60000,
    status: 'Out Of Service',
    region: 'West',
    lastMaintained: '2025-08-05',
  },
  {
    id: '5',
    name: 'Truck-09',
    plate: 'TRK-9900',
    type: 'Truck',
    capacity: 12000,
    odometer: 85000,
    status: 'Available',
    region: 'North',
    lastMaintained: '2026-02-01',
  },
];

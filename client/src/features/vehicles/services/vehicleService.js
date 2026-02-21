import { VEHICLE_STATUSES } from '../constants/vehicleConstants';

export function createVehicle(formData) {
  return {
    ...formData,
    id: Math.random().toString(36).slice(2, 11),
    status: VEHICLE_STATUSES.AVAILABLE.id,
    region: 'Unassigned',
    lastMaintained: new Date().toISOString().split('T')[0],
  };
}

export function normalizeVehicle(formData) {
  return {
    ...formData,
    plate: formData.plate.toUpperCase(),
  };
}

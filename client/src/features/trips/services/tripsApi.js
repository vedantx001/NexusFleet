import api from '../../../services/api';

function mapTripStatusFromApi(status) {
  switch (String(status || '').toUpperCase()) {
    case 'DRAFT':
      return 'Draft';
    case 'DISPATCHED':
      return 'Dispatched';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status || 'Draft';
  }
}

export function toUiTrip(apiTrip) {
  if (!apiTrip) return null;

  const vehicleId = apiTrip.vehicle && typeof apiTrip.vehicle === 'object' ? apiTrip.vehicle._id : apiTrip.vehicle;
  const driverId = apiTrip.driver && typeof apiTrip.driver === 'object' ? apiTrip.driver._id : apiTrip.driver;

  return {
    id: String(apiTrip._id || apiTrip.id || ''),
    status: mapTripStatusFromApi(apiTrip.status),
    createdAt: apiTrip.createdAt,
    dispatchedAt: apiTrip.createdAt,
    completedAt: apiTrip.updatedAt,
    vehicleId: vehicleId ? String(vehicleId) : '',
    driverId: driverId ? String(driverId) : '',
    cargo: apiTrip.cargo || 'Cargo',
    destination: apiTrip.destination || '—',
    cargoWeight: typeof apiTrip.cargoWeightKg === 'number' ? apiTrip.cargoWeightKg : apiTrip.cargoWeightKg ? Number(apiTrip.cargoWeightKg) : undefined,
    startOdometer: apiTrip.startOdometer,
    endOdometer: apiTrip.endOdometer,
  };
}

export async function listTrips() {
  const res = await api.get('/trips');
  const trips = res?.data?.data?.trips;
  return Array.isArray(trips) ? trips.map(toUiTrip).filter(Boolean) : [];
}

export async function dispatchTrip({ vehicleId, driverId, cargoWeightKg, destination, origin, startOdometer }) {
  const res = await api.post('/trips', {
    vehicle: vehicleId,
    driver: driverId,
    cargoWeightKg,
    ...(destination ? { destination } : {}),
    ...(origin ? { origin } : {}),
    ...(startOdometer !== undefined ? { startOdometer } : {}),
  });

  const trip = res?.data?.data?.trip;
  return toUiTrip(trip);
}

export async function completeTrip(tripId, { endOdometer } = {}) {
  const res = await api.patch(`/trips/${tripId}/complete`, {
    ...(endOdometer !== undefined ? { endOdometer } : {}),
  });

  const trip = res?.data?.data?.trip;
  return toUiTrip(trip);
}

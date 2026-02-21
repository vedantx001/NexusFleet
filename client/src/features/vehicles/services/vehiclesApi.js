import api from '../../../services/api';

function toDateOnly(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

function mapVehicleTypeFromApi(vehicleType) {
  switch (String(vehicleType || '').toUpperCase()) {
    case 'TRUCK':
      return 'Truck';
    case 'VAN':
      return 'Van';
    case 'BIKE':
      return 'Bike';
    default:
      return vehicleType || 'Van';
  }
}

function mapVehicleTypeToApi(type) {
  switch (String(type || '').toLowerCase()) {
    case 'truck':
      return 'TRUCK';
    case 'van':
      return 'VAN';
    case 'bike':
      return 'BIKE';
    default:
      return type ? String(type).toUpperCase() : undefined;
  }
}

function mapVehicleStatusFromApi(status) {
  switch (String(status || '').toUpperCase()) {
    case 'AVAILABLE':
      return 'Available';
    case 'ON_TRIP':
      return 'On Trip';
    case 'IN_SHOP':
      return 'In Shop';
    case 'RETIRED':
      return 'Out Of Service';
    default:
      return status || 'Available';
  }
}

function mapVehicleStatusToApi(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'available') return 'AVAILABLE';
  if (s === 'on trip' || s === 'on_trip' || s === 'ontrip') return 'ON_TRIP';
  if (s === 'in shop' || s === 'in_shop' || s === 'inshop') return 'IN_SHOP';
  if (s === 'maintenance requested' || s === 'maintenance_requested') return 'IN_SHOP';
  if (s === 'out of service' || s === 'out_of_service' || s === 'retired') return 'RETIRED';
  return undefined;
}

export function toUiVehicle(apiVehicle) {
  if (!apiVehicle) return null;

  return {
    id: String(apiVehicle._id || apiVehicle.id || ''),
    name: apiVehicle.name || '',
    plate: String(apiVehicle.licensePlate || apiVehicle.plate || '').toUpperCase(),
    type: mapVehicleTypeFromApi(apiVehicle.vehicleType || apiVehicle.type),
    capacity: apiVehicle.maxCapacityKg ?? apiVehicle.capacity,
    odometer: apiVehicle.odometer ?? 0,
    status: mapVehicleStatusFromApi(apiVehicle.status),
    region: apiVehicle.region || 'Unassigned',
    lastMaintained: apiVehicle.lastMaintained ? String(apiVehicle.lastMaintained) : toDateOnly(apiVehicle.updatedAt || apiVehicle.createdAt),
  };
}

function toApiVehiclePayload(uiVehicle) {
  const payload = uiVehicle || {};

  return {
    name: payload.name,
    licensePlate: payload.plate ? String(payload.plate).toUpperCase() : undefined,
    vehicleType: mapVehicleTypeToApi(payload.type),
    maxCapacityKg: payload.capacity === '' ? undefined : payload.capacity,
    odometer: payload.odometer === '' ? undefined : payload.odometer,
    ...(payload.acquisitionCost !== undefined ? { acquisitionCost: payload.acquisitionCost } : {}),
    ...(payload.status ? { status: mapVehicleStatusToApi(payload.status) } : {}),
    ...(payload.region ? { region: payload.region } : {}),
  };
}

export async function listVehicles() {
  const res = await api.get('/vehicles');
  const vehicles = res?.data?.data?.vehicles;
  return Array.isArray(vehicles) ? vehicles.map(toUiVehicle).filter(Boolean) : [];
}

export async function createVehicle(uiVehicle) {
  const payload = toApiVehiclePayload(uiVehicle);
  if (payload.acquisitionCost === undefined) payload.acquisitionCost = 0;
  const res = await api.post('/vehicles', payload);
  const vehicle = res?.data?.data?.vehicle;
  return toUiVehicle(vehicle);
}

export async function updateVehicle(id, patch) {
  const res = await api.patch(`/vehicles/${id}`, toApiVehiclePayload(patch));
  const vehicle = res?.data?.data?.vehicle;
  return toUiVehicle(vehicle);
}

export async function deleteVehicle(id) {
  const res = await api.delete(`/vehicles/${id}`);
  const vehicle = res?.data?.data?.vehicle;
  return toUiVehicle(vehicle);
}

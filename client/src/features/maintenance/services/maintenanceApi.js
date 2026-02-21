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

export function toUiMaintenance(apiLog) {
  if (!apiLog) return null;

  const vehicleId = apiLog.vehicle && typeof apiLog.vehicle === 'object' ? apiLog.vehicle._id : apiLog.vehicle;

  return {
    id: String(apiLog._id || apiLog.id || ''),
    vehicleId: vehicleId ? String(vehicleId) : '',
    type: apiLog.description || 'Maintenance',
    notes: '',
    date: toDateOnly(apiLog.serviceDate || apiLog.createdAt),
    cost: apiLog.cost,
    createdAt: apiLog.createdAt,
  };
}

export async function listMaintenance() {
  const res = await api.get('/maintenance');
  const logs = res?.data?.data?.maintenanceLogs;
  return Array.isArray(logs) ? logs.map(toUiMaintenance).filter(Boolean) : [];
}

export async function createMaintenance({ vehicleId, maintenanceType, notes, date, cost }) {
  const description = [maintenanceType, notes].filter(Boolean).join(' — ');
  const res = await api.post('/maintenance', {
    vehicle: vehicleId,
    ...(description ? { description } : {}),
    ...(date ? { serviceDate: date } : {}),
    cost,
  });

  const maintenance = res?.data?.data?.maintenance;
  const vehicle = res?.data?.data?.vehicle;
  return {
    maintenance: toUiMaintenance(maintenance),
    vehicle,
  };
}

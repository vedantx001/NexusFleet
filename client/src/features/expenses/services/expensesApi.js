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

export function toUiFuelLog(apiLog) {
  if (!apiLog) return null;

  const vehicleId = apiLog.vehicle && typeof apiLog.vehicle === 'object' ? apiLog.vehicle._id : apiLog.vehicle;
  const tripId = apiLog.trip && typeof apiLog.trip === 'object' ? apiLog.trip._id : apiLog.trip;

  return {
    id: String(apiLog._id || apiLog.id || ''),
    vehicleId: vehicleId ? String(vehicleId) : '',
    tripId: tripId ? String(tripId) : undefined,
    liters: apiLog.liters,
    amount: apiLog.cost ?? apiLog.amount,
    date: toDateOnly(apiLog.date || apiLog.createdAt),
    createdAt: apiLog.createdAt,
  };
}

export async function listFuelLogs() {
  const res = await api.get('/expenses');
  const data = res?.data?.data;
  const logs = Array.isArray(data) ? data : data?.fuelLogs;
  return Array.isArray(logs) ? logs.map(toUiFuelLog).filter(Boolean) : [];
}

export async function createFuelLog({ vehicleId, tripId, liters, amount, date }) {
  const res = await api.post('/expenses', {
    vehicle: vehicleId,
    ...(tripId ? { trip: tripId } : {}),
    liters,
    cost: amount,
    ...(date ? { date } : {}),
  });

  // backend returns data as the created doc directly
  const log = res?.data?.data?.fuelLog || res?.data?.data;
  return toUiFuelLog(log);
}

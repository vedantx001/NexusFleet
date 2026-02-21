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

function mapDriverStatusFromApi(status) {
  switch (String(status || '').toUpperCase()) {
    case 'ON_DUTY':
      return { dutyStatus: 'On Duty', status: 'On Duty' };
    case 'OFF_DUTY':
      return { dutyStatus: 'Off Duty', status: 'Available' };
    case 'ON_TRIP':
      return { dutyStatus: 'On Duty', status: 'On Trip' };
    case 'SUSPENDED':
      return { dutyStatus: 'Suspended', status: 'Suspended' };
    default:
      return { dutyStatus: 'Off Duty', status: 'Available' };
  }
}

function mapDutyStatusToApi(dutyStatus) {
  switch (String(dutyStatus || '').toLowerCase()) {
    case 'on duty':
      return 'ON_DUTY';
    case 'off duty':
      return 'OFF_DUTY';
    case 'suspended':
      return 'SUSPENDED';
    default:
      return undefined;
  }
}

export function toUiDriver(apiDriver) {
  if (!apiDriver) return null;

  const statusMapping = mapDriverStatusFromApi(apiDriver.status);

  return {
    id: String(apiDriver._id || apiDriver.id || ''),
    name: apiDriver.name || '',
    licenseNumber: apiDriver.licenseNumber || '',
    licenseExpiryDate: toDateOnly(apiDriver.licenseExpiry || apiDriver.licenseExpiryDate),
    licenseCategories: apiDriver.licenseCategory ? [String(apiDriver.licenseCategory)] : Array.isArray(apiDriver.licenseCategories) ? apiDriver.licenseCategories : ['Van'],
    dutyStatus: statusMapping.dutyStatus,
    status: statusMapping.status,
    safetyScore: typeof apiDriver.safetyScore === 'number' ? apiDriver.safetyScore : undefined,
  };
}

function toApiDriverPayload(uiDriver) {
  const payload = uiDriver || {};

  const licenseCategory = Array.isArray(payload.licenseCategories) && payload.licenseCategories.length
    ? String(payload.licenseCategories[0])
    : payload.licenseCategory
      ? String(payload.licenseCategory)
      : undefined;

  return {
    name: payload.name,
    licenseNumber: payload.licenseNumber,
    licenseExpiry: payload.licenseExpiryDate || payload.licenseExpiry,
    licenseCategory,
    ...(payload.dutyStatus ? { status: mapDutyStatusToApi(payload.dutyStatus) } : {}),
    ...(payload.status && String(payload.status).toLowerCase() === 'on trip' ? { status: 'ON_TRIP' } : {}),
  };
}

export async function listDrivers() {
  const res = await api.get('/drivers');
  const drivers = res?.data?.data?.drivers;
  return Array.isArray(drivers) ? drivers.map(toUiDriver).filter(Boolean) : [];
}

export async function createDriver(uiDriver) {
  const res = await api.post('/drivers', toApiDriverPayload(uiDriver));
  const driver = res?.data?.data?.driver;
  return toUiDriver(driver);
}

export async function updateDriver(id, patch) {
  const res = await api.patch(`/drivers/${id}`, toApiDriverPayload(patch));
  const driver = res?.data?.data?.driver;
  return toUiDriver(driver);
}

export async function deleteDriver(id) {
  const res = await api.delete(`/drivers/${id}`);
  const driver = res?.data?.data?.driver;
  return toUiDriver(driver);
}

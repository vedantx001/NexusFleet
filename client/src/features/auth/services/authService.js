import api from '../../../services/api';

function extractUser(response) {
  return response?.data?.data?.user || null;
}

function extractToken(response) {
  return response?.data?.data?.token || null;
}

function mapRoleToBackend(roleId) {
  const value = String(roleId || '').toLowerCase();

  switch (value) {
    case 'manager':
      return 'MANAGER';
    case 'dispatcher':
      return 'DISPATCHER';
    case 'safety':
    case 'safety_officer':
    case 'safetyofficer':
      return 'SAFETY_OFFICER';
    case 'finance':
    case 'financial_analyst':
    case 'financialanalyst':
      return 'FINANCIAL_ANALYST';
    default:
      return roleId || null;
  }
}

export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  return {
    user: extractUser(response),
    token: extractToken(response),
  };
}

export async function signup(payload) {
  const mapped = {
    ...payload,
    role: mapRoleToBackend(payload?.role),
  };
  const response = await api.post('/auth/register', mapped);
  return {
    user: extractUser(response),
    token: extractToken(response),
  };
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return extractUser(response);
}

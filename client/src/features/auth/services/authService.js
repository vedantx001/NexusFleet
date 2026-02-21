import api from '../../../services/api';

function extractUser(response) {
  return response?.data?.data?.user || null;
}

export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  return extractUser(response);
}

export async function signup(payload) {
  const response = await api.post('/auth/register', payload);
  return extractUser(response);
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return extractUser(response);
}

import api from '../../../services/api';

export async function login(payload) {
  return api.post('/auth/login', payload);
}

export async function register(payload) {
  return api.post('/auth/register', payload);
}

export async function logout() {
  return api.post('/auth/logout');
}

export async function me() {
  return api.get('/auth/me');
}

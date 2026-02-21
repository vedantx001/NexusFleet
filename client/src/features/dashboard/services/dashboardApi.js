import api from '../../../services/api';

export async function getDashboardMetrics() {
  const res = await api.get('/dashboard');
  return res?.data?.data || null;
}

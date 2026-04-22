import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('rto_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rto_token');
      localStorage.removeItem('rto_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ───────────────────────────────────────
export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);

// ── Vehicles ───────────────────────────────────
export const registerVehicle = (data) => API.post('/vehicles', data);
export const getMyVehicles   = ()     => API.get('/vehicles/my');
export const getAllVehicles   = ()     => API.get('/vehicles');
export const updateVehicleStatus = (id, status) => API.put(`/vehicles/${id}/status`, { status });

// ── Licenses ───────────────────────────────────
export const applyLicense   = (data) => API.post('/licenses/apply', data);
export const getMyLicenses  = ()     => API.get('/licenses/my');
export const getAllLicenses  = ()     => API.get('/licenses');
export const updateLicenseStatus = (id, status) => API.put(`/licenses/${id}/status`, { status });

// ── Admin ──────────────────────────────────────
export const getDashboardStats = () => API.get('/admin/dashboard');
export const getAllUsers        = ()  => API.get('/admin/users');
export const deleteUser        = (id) => API.delete(`/admin/users/${id}`);

export default API;

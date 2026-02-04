import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/api/employees'),
  getById: (employeeId) => api.get(`/api/employees/${employeeId}`),
  create: (employee) => api.post('/api/employees', employee),
  delete: (employeeId) => api.delete(`/api/employees/${employeeId}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params) => api.get('/api/attendance', { params }),
  getByEmployeeId: (employeeId) => api.get(`/api/attendance/${employeeId}`),
  create: (attendance) => api.post('/api/attendance', attendance),
  getStats: (employeeId) => api.get(`/api/attendance/stats/${employeeId}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
};

export default api;

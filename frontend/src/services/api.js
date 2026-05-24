import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verifyOtp: (data) => API.post('/auth/verify-otp', data),
};

export const accountAPI = {
  getAll: () => API.get('/accounts'),
  create: (data) => API.post('/accounts', data),
};

export const transactionAPI = {
  transfer: (data) => API.post('/transactions/transfer', data),
  getHistory: (page = 0, size = 10) => API.get(`/transactions/history?page=${page}&size=${size}`),
  getSpending: () => API.get('/transactions/analytics/spending'),
};

export const fraudAPI = {
  getAlerts: () => API.get('/fraud/alerts'),
  resolve: (id) => API.put(`/fraud/resolve/${id}`),
};

export default API;
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://loan-management-system-pxkz.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  apiLogin: (data) => api.post('/auth/api-login', data),
};

// Loan Products APIs
export const loanProductsAPI = {
  getAll: (params) => api.get('/loan-products', { params }),
  getById: (id) => api.get(`/loan-products/${id}`),
  create: (data) => api.post('/loan-products', data),
  update: (id, data) => api.put(`/loan-products/${id}`, data),
  delete: (id) => api.delete(`/loan-products/${id}`),
};

// Loan Applications APIs
export const loanApplicationsAPI = {
  getAll: (params) => api.get('/loan-applications', { params }),
  getOngoing: () => api.get('/loan-applications/ongoing'),
  getById: (id) => api.get(`/loan-applications/${id}`),
  create: (data) => api.post('/loan-applications', data),
  createViaAPI: (data) => api.post('/loan-applications/api', data),
  update: (id, data) => api.put(`/loan-applications/${id}`, data),
};

// Collaterals APIs
export const collateralsAPI = {
  getAll: (params) => api.get('/collaterals', { params }),
  getByLoan: (loanId) => api.get(`/collaterals/loan/${loanId}`),
  getById: (id) => api.get(`/collaterals/${id}`),
  create: (data) => api.post('/collaterals', data),
  update: (id, data) => api.put(`/collaterals/${id}`, data),
  updatePledgeStatus: (id, data) => api.put(`/collaterals/${id}/pledge`, data),
};

export default api;


import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const productService = {
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  initializeProduct: () => api.get('/products/init'),
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
};

export const designService = {
  saveDesign: (designData) =>
    api.post('/designs', designData),
  getUserDesigns: () => api.get('/designs'),
  getDesign: (id) => api.get(`/designs/${id}`),
  deleteDesign: (id) => api.delete(`/designs/${id}`),
};

export const orderService = {
  createOrder: (orderData) =>
    api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders'),
  getAllOrders: (params) => api.get('/orders/admin/all', { params }),
  updateOrderStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, { status }),
};

export const analyticsService = {
  getDemandAnalytics: () => api.get('/analytics/demand'),
  getCustomerInsights: () => api.get('/analytics/customers'),
};

export const inventoryService = {
  getInventory: () => api.get('/inventory'),
  addItem: (data) => api.post('/inventory', data),
  updateStock: (id, stockQuantity) => api.patch(`/inventory/${id}/stock`, { stockQuantity }),
};

export const userService = {
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (data) => api.patch('/users/profile', data),
  getAllUsers: () => api.get('/users/admin/all'),
  getUserLoyaltyPoints: () => api.get('/users/loyalty-points'),
};

export default api;

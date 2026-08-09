import api from '../services/api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

export const chatService = {
  sendMessage: (data) => api.post('/chat', data),
};

export const conversationService = {
  getAll: () => api.get('/conversations'),
  getById: (id) => api.get(`/conversations/${id}`),
};

export const ticketService = {
  create: (data) => api.post('/tickets', data),
  getAll: () => api.get('/tickets'),
  getById: (id) => api.get(`/tickets/${id}`),
};

import axios from 'axios';

const API = axios.create({
  baseURL: 'https://upi-fraud-shield-1nf9.onrender.com'
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getUser = (id) => API.get(`/auth/user/${id}`);

// Transactions
export const analyzeTransaction = (userId, data) => API.post(`/transactions/analyze/${userId}`, data);
export const getHistory = (userId) => API.get(`/transactions/history/${userId}`);
export const getStats = (userId) => API.get(`/transactions/stats/${userId}`);

// Notifications
export const getNotifications = (userId) => API.get(`/notifications/all/${userId}`);
export const markRead = (id) => API.patch(`/notifications/read/${id}`);
export const clearNotifications = (userId) => API.delete(`/notifications/clear/${userId}`);
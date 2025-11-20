import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://katahnak-back.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export default api;

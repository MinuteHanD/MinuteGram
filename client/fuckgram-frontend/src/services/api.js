import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the JWT token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
  }
  return config;
});

export default api;

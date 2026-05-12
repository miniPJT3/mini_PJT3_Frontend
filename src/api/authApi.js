import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; // useAuthStore import

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Request Interceptor 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: (data) => api.post('/v1/auth/signup', data),
  login: (data) => api.post('/v1/auth/login', data),
};

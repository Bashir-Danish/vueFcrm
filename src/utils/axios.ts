import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, isCancel } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    const { token } = storeToRefs(authStore);
    if (token.value) {
      config.headers['Authorization'] = `Bearer ${token.value}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const authStore = useAuthStore();
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authStore.refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return instance(originalRequest);
      } catch (refreshError) {
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network Error: Unable to connect to the server'));
    }

    // Handle other error statuses
    switch (error.response.status) {
      case 400:
        console.error('Bad Request:', error.response.data);
        break;
      case 403:
        console.error('Forbidden:', error.response.data);
        break;
      case 404:
        console.error('Not Found:', error.response.data);
        break;
      case 500:
        console.error('Internal Server Error:', error.response.data);
        break;
      default:
        console.error(`Unhandled error status: ${error.response.status}`, error.response.data);
    }

    return Promise.reject(error);
  }
);

export default instance;
export { isCancel };
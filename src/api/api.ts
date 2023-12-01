import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://backend.grbpwr.com:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers = config.headers || {};
      config.headers['Grpc-Metadata-Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

interface AxiosRequestConfig {
  path: string;
  method: string;
  body?: any;
}

export const axiosRequestHandler = async ({ path, method, body }: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance({
      method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      url: path,
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error('api call error:', error);
    throw error;
  }
};

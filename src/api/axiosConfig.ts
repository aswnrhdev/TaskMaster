import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

console.log('BASE_URL:', BASE_URL);

const Api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

interface UserInfo {
  token: string;
}

Api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo: UserInfo = JSON.parse(userInfoString);
      const token = userInfo.token;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default Api;
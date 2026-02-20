import axios from "axios";
import {useAuthStore} from "../store/useAuthStore";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const basePath = import.meta.env.VITE_API_BASE || "/api/v1";

const api = axios.create({
  baseURL: `${baseUrl}${basePath}`,
});

api.interceptors.request.use((config) => {
  const {accessToken} = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const {refreshToken} = useAuthStore.getState();
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${baseUrl}${basePath}/auth/refresh`,
            {refreshToken}
          );
          const {accessToken: newAccessToken, refreshToken: newRefreshToken, user} =
            refreshResponse.data;
          useAuthStore.getState().setAuth({
            user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(original);
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

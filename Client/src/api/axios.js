import axios from "axios";
import {useAuthStore} from "../store/useAuthStore";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const basePath = import.meta.env.VITE_API_BASE || "/api/v1";

const api = axios.create({
  baseURL: `${baseUrl}${basePath}`,
});

const getStoredAuth = () => {
  if (typeof window === "undefined") return {accessToken: "", refreshToken: ""};
  try {
    const raw = localStorage.getItem("rps-auth");
    if (!raw) return {accessToken: "", refreshToken: ""};
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed?.state?.accessToken || "",
      refreshToken: parsed?.state?.refreshToken || "",
    };
  } catch {
    return {accessToken: "", refreshToken: ""};
  }
};

api.interceptors.request.use((config) => {
  const {accessToken} = useAuthStore.getState();
  const stored = getStoredAuth();
  const token = accessToken || stored.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
      const stored = getStoredAuth();
      const activeRefreshToken = refreshToken || stored.refreshToken;
      if (activeRefreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${baseUrl}${basePath}/auth/refresh`,
            {refreshToken: activeRefreshToken}
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

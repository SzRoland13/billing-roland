import axios from "axios";
import { getAccessToken, useUserStore } from "../store/userStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers!["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthCall = originalRequest.url?.includes("/auth/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthCall
    ) {
      originalRequest._retry = true;

      try {
        await useUserStore.getState().refreshAccessToken();

        originalRequest.headers["Authorization"] = `Bearer ${getAccessToken()}`;

        return axiosClient(originalRequest);
      } catch (err) {
        useUserStore.getState().clearUser();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

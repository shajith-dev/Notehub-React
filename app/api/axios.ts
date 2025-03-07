import axios from "axios";
import { useAuthStore } from "@/stores/store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const zustandStore = useAuthStore;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = zustandStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.status === 403) {
      localStorage.removeItem("token");
      zustandStore.getState().removeToken();
      localStorage.removeItem("user");
      zustandStore.getState().removeUser();
      console.log("logging out user token expiration...");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

import axios from "axios";
import { Message } from "@/types/chat";
import { useAuthStore } from "@/stores/store";
import { v4 as uuidv4 } from "uuid";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
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

export const getChatResponse = async (
  query: string,
  url: string,
): Promise<Message> => {
  const response = await axiosInstance.post("/chat", {
    query,
    object_url: url,
  });
  const message: Message = {
    content: response.data.answer,
    role: "assistant",
    id: uuidv4(),
  };
  return message;
};

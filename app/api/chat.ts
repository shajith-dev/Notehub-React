import axios from "axios";
import { Message } from "@/types/chat";

const chatAxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getChatResponse = async (query: string, url: string) => {
  const response = await chatAxiosInstance.post("/chat", {
    query,
    url,
  });
  return response.data;
};

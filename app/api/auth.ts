import axios from "./axios";
import { SignInData, SignUpData } from "@/types/auth";

export const signUp = async (formData: SignUpData) => {
  const response = await axios.post("/api/auth/register", formData);
  return response.data;
};

export const signIn = async (formData: SignInData) => {
  const response = await axios.post("/api/auth/login", formData);
  return response.data;
};

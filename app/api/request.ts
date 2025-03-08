import axios from "./axios";
import { Request } from "../types/request";
import { PagedResult } from "@/types/common";

export async function getRequests(
  sids: number[],
  page: number,
): Promise<PagedResult<Request>> {
  const response = await axios.get(
    `/api/requests?sids=${sids || ""}&page=${page || 0}`,
  );
  return response.data;
}

export async function createRequest(request: Request): Promise<Request> {
  const response = await axios.post("/api/requests", request);
  return response.data;
}

export async function resolveRequest(
  requestId: number,
  formData: FormData,
): Promise<Request> {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios.post(
    `/api/requests/${requestId}/resolve`,
    formData,
    config,
  );
  return response.data;
}

export async function getUserRequests(
  page: number = 0,
): Promise<PagedResult<Request>> {
  const response = await axios.get(`/api/requests/me?page=${page}`);
  return response.data;
}

export async function deleteRequest(requestId: number): Promise<void> {
  const response = await axios.delete(`/api/requests/${requestId}`);
  return response.data;
}

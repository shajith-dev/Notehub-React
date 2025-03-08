import axios from "./axios";
import { PagedResult } from "@/types/common";
import { Note, Subject } from "@/types/note";

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await axios.get("/api/subjects");
  return response.data;
};

export const uploadNote = async (formData: FormData): Promise<void> => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios.post("/api/notes", formData, config);
  return response.data;
};

export const searchNotes = async (
  query: string,
  page?: number,
  sids?: number[],
): Promise<PagedResult<Note>> => {
  const response = await axios.get(
    `/api/notes/search?q=${query}&sids=${sids || ""}&page=${page || 0}`,
  );
  return response.data;
};

export const getNote = async (noteId: number): Promise<Note> => {
  const response = await axios.get(`api/notes/${noteId}`);
  return response.data;
};

export const getUserNotes = async (
  page: number = 0,
): Promise<PagedResult<Note>> => {
  const response = await axios.get(`/api/notes/me?page=${page}`);
  return response.data;
};

export const deleteNote = async (noteId: number): Promise<void> => {
  const response = await axios.delete(`/api/notes/${noteId}`);
  return response.data;
};

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
  sids?: string[],
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

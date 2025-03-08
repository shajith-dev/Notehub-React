import axios from "./axios";
import { Comment } from "@/types/comments";

export const getComments = async (noteId: number): Promise<Comment[]> => {
  const response = await axios.get(`api/notes/${noteId}/comment`);
  return response.data;
};

export const addComment = async (comment: Comment) => {
  const response = await axios.post(
    `api/notes/${comment.noteId}/comment`,
    comment,
  );
  return response.data;
};

export const deleteComment = async (
  noteId: number,
  commentId: number,
): Promise<void> => {
  const response = await axios.delete(
    `/api/notes/${noteId}/comment/${commentId}`,
  );
  return response.data;
};

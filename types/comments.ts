export type Comment = {
  commentId?: number;
  createdBy: number;
  createdAt?: string;
  noteId: number;
  content: string;
  replies?: Comment[];
  author?: string;
  authorPfp?: string;
  parentId?: number;
};

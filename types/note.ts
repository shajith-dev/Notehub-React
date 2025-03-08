export type Note = {
  createdBy: number;
  title: string;
  subjectId: number;
  noteId?: number;
  url?: string;
  author?: string;
  subjectName?: string;
  description?: string;
};

export type Subject = {
  name: string;
  subjectId: number;
};

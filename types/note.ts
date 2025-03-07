export type Note = {
  createdBy: number;
  title: string;
  subjectId: number;
  noteId?: number;
  url?: string;
  description?: string;
};

export type Subject = {
  name: string;
  subjectId: number;
};

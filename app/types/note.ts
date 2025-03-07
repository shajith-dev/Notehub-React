export interface Subject {
  subjectId: number;
  name: string;
}

export interface Note {
  noteId: number;
  title: string;
  description?: string;
  subjectId: number;
  subject?: Subject;
  createdAt?: string;
  author?: string;
  createdBy: number;
  url?: string;
} 
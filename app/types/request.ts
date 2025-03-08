export interface Request {
  requestId?: number;
  subjectId: number;
  title: string;
  author?: string;
  resolved: boolean;
  createdAt?: string;
  description: string;
  authorId?: number;
  requestedBy?: number;
}

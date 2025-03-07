export interface Request {
  requestId: number;
  subject: string;
  description: string;
  author: string;
  status: "open" | "closed";
  createdAt: string;
} 
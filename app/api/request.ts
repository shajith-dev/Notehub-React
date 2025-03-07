import { Request } from "../types/request";

const dummyRequests: Request[] = [
  {
    requestId: 1,
    subject: "Mathematics",
    description: "Looking for calculus notes covering differential equations and their applications in real-world scenarios. Preferably with detailed examples and practice problems.",
    author: "John Doe",
    status: "open",
    createdAt: "2024-03-07T10:30:00Z"
  },
  {
    requestId: 2,
    subject: "Physics",
    description: "Need comprehensive notes on quantum mechanics, specifically covering wave functions, Schrödinger equation, and quantum tunneling.",
    author: "Alice Smith",
    status: "closed",
    createdAt: "2024-03-06T15:45:00Z"
  },
  {
    requestId: 3,
    subject: "Computer Science",
    description: "Seeking detailed notes on data structures and algorithms, particularly focusing on graph algorithms and dynamic programming.",
    author: "Bob Johnson",
    status: "open",
    createdAt: "2024-03-07T09:15:00Z"
  },
  {
    requestId: 4,
    subject: "Biology",
    description: "Looking for notes on molecular biology, covering DNA replication, transcription, and translation processes with diagrams.",
    author: "Emma Wilson",
    status: "open",
    createdAt: "2024-03-07T08:20:00Z"
  },
  {
    requestId: 5,
    subject: "Chemistry",
    description: "Need organic chemistry notes focusing on reaction mechanisms and synthesis pathways. Would appreciate detailed reaction diagrams.",
    author: "Michael Brown",
    status: "open",
    createdAt: "2024-03-06T16:30:00Z"
  },
  {
    requestId: 6,
    subject: "Mathematics",
    description: "Requesting linear algebra notes covering vector spaces, eigenvalues, and matrix transformations with practical applications.",
    author: "Sarah Davis",
    status: "closed",
    createdAt: "2024-03-05T14:20:00Z"
  },
  {
    requestId: 7,
    subject: "Computer Science",
    description: "Looking for comprehensive notes on web development, covering modern frameworks, API design, and best practices.",
    author: "David Miller",
    status: "open",
    createdAt: "2024-03-07T11:45:00Z"
  },
  {
    requestId: 8,
    subject: "Physics",
    description: "Need notes on classical mechanics, specifically covering Lagrangian and Hamiltonian mechanics with examples.",
    author: "Lisa Anderson",
    status: "open",
    createdAt: "2024-03-06T13:15:00Z"
  },
  {
    requestId: 9,
    subject: "Chemistry",
    description: "Seeking physical chemistry notes covering thermodynamics and quantum chemistry concepts with detailed derivations.",
    author: "James Wilson",
    status: "closed",
    createdAt: "2024-03-05T09:30:00Z"
  },
  {
    requestId: 10,
    subject: "Biology",
    description: "Looking for notes on evolutionary biology and genetics, including population genetics and natural selection.",
    author: "Emily Taylor",
    status: "open",
    createdAt: "2024-03-07T10:00:00Z"
  },
  {
    requestId: 11,
    subject: "Computer Science",
    description: "Need notes on artificial intelligence and machine learning, covering neural networks and deep learning architectures.",
    author: "Ryan Clark",
    status: "open",
    createdAt: "2024-03-06T17:20:00Z"
  },
  {
    requestId: 12,
    subject: "Mathematics",
    description: "Requesting notes on abstract algebra, covering group theory and ring theory with proofs and examples.",
    author: "Sophie Martin",
    status: "open",
    createdAt: "2024-03-07T08:45:00Z"
  }
];

export async function getRequests(): Promise<Request[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyRequests;
} 
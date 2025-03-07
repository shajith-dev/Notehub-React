import { create } from "zustand";
import { Subject } from "@/types/note";

export type User = {
  userId: number;
  userName: string;
};

type AppState = {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
};

type Cache = {
  subjects: Subject[];
  tags: string[];
  setSubjects: (subjects: Subject[]) => void;
  setTags: (tags: string[]) => void;
};

// Helper to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return window.localStorage?.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  },
};

// Get initial user safely
const getInitialUser = (): User | null => {
  const userString = safeLocalStorage.getItem("user");
  if (userString) {
    try {
      return JSON.parse(userString) as User;
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AppState>((set) => ({
  // Initialize with safely retrieved localStorage values
  token: safeLocalStorage.getItem("token"),
  user: getInitialUser(),

  // Update both state and localStorage safely
  setToken: (token) => {
    safeLocalStorage.setItem("token", token);
    set({ token });
  },

  removeToken: () => {
    safeLocalStorage.removeItem("token");
    set({ token: null });
  },

  setUser: (user) => {
    safeLocalStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  removeUser: () => {
    safeLocalStorage.removeItem("user");
    set({ user: null });
  },
}));

export const useStore = create<Cache>((set) => ({
  subjects: [],
  tags: [],
  setSubjects: (subjects: Subject[]) => {
    set({ subjects });
  },
  setTags: (tags: string[]) => {
    set({ tags });
  },
}));

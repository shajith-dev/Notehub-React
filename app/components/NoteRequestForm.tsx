"use client";

import { Subject } from "@/types/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getSubjects } from "../api/note";
import { Request } from "../types/request";
import { createRequest } from "../api/request";
import { useAuthStore } from "@/stores/store";

export default function NoteRequestForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: createRequest,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const request: Request = {
      title,
      description,
      subjectId,
      resolved: false,
      requestedBy: user?.userId,
    };
    mutation.mutate(request);
    setIsLoading(false);
    // Reset form after submission
    setTitle("");
    setDescription("");
    setSubjectId(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Request a Note</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fill out the form below to request a note from the community.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 dark:text-white"
              placeholder="Enter a title for your request"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 dark:text-white"
            >
              <option value={0} disabled>
                Select a subject
              </option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 dark:text-white"
              placeholder="Describe what you're looking for"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

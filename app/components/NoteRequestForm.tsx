"use client";

import { useStore } from "@/stores/store";
import { Subject } from "@/types/note";
import { useState } from "react";

export default function NoteRequestForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const data: Subject[] = useStore((state) => state.subjects);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Here you would typically send the data to your backend
    console.log({ title, description, subjectId });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Reset form after submission
    setTitle("");
    setDescription("");
    setSubjectId(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Request a Note</h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to request a note from the community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
              placeholder="Enter a clear, descriptive title"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <select
              id="subject"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm bg-white"
              value={subjectId}
              onChange={(e) => setSubjectId(parseInt(e.target.value))}
            >
              <option value={0} disabled>
                Select a subject
              </option>
              {data &&
                data.map((subject: Subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
              placeholder="Describe what you're looking for in detail"
            />
            <p className="mt-1 text-xs text-gray-500">
              Be specific about what you need help with
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !title || !description || subjectId === 0}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

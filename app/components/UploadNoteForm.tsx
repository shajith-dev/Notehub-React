"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { useAuthStore, useStore } from "@/stores/store";
import { Note, Subject } from "@/types/note";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSubjects, uploadNote } from "../api/note";
import { useRouter } from "next/navigation";
export default function UploadNoteForm() {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const mutation = useMutation({
    mutationFn: uploadNote,
    onSuccess: (data) => {
      const note = data as unknown as Note;
      router.push(`/notes/${note.noteId}`);
    },
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      // Here you would typically upload the file and create the note
      const formData = new FormData();
      formData.set("file", file);
      const note = {
        title,
        subjectId,
        createdBy: user?.userId,
      };
      formData.set("note", JSON.stringify(note));
      mutation.mutate(formData);
      // Reset form
      setTitle("");
      setSubjectId(0);
      setFile(null);
    } catch (error) {
      console.error("Error uploading note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload a Note
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Share your notes with the community. Please ensure your notes are
            clear and helpful.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Give your note a clear title"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Subject
              </label>
              <select
                id="subject"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={subjectId}
                onChange={(e) => setSubjectId(parseInt(e.target.value))}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload PDF
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative ${
                  dragActive
                    ? "border-accent bg-accent/5 dark:bg-accent/10"
                    : ""
                } transition-colors duration-150 dark:text-gray-300`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-2 text-center">
                  {!file ? (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF up to 10MB
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !title || !file || subjectId === 0}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Uploading..." : "Upload Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

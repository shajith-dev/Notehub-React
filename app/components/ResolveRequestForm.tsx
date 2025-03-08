"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { useAuthStore } from "@/stores/store";
import { useMutation } from "@tanstack/react-query";
import { resolveRequest } from "../api/request";

export default function ResolveRequestForm({
  requestId,
  subjectId,
  onSuccess,
}: {
  requestId: number;
  subjectId: number;
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const user = useAuthStore((state) => state.user);

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
    mutationFn: (formData: FormData) => resolveRequest(requestId, formData),
    onSuccess: () => {
      window.location.reload();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const note = {
        title,
        subjectId,
        createdBy: user?.userId,
      };
      formData.set("noteJson", JSON.stringify(note));
      mutation.mutate(formData);
      setTitle("");
      setFile(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error resolving request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resolve Request</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload a note to fulfill this request
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
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 dark:text-white"
              placeholder="Enter a title for your note"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-gray-900 dark:text-white"
              placeholder="Add a brief description of the note"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload PDF
            </label>
            <div
              className={`mt-1 flex justify-center px-6 py-10 border-2 border-dashed rounded-lg ${
                dragActive
                  ? "border-accent bg-accent/5"
                  : "border-gray-300 dark:border-gray-600"
              } transition-colors ${
                file
                  ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-700/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                {file ? (
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                    >
                      <X className="mr-1 h-4 w-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".pdf"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF only, up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !title || !file}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Uploading..." : "Upload Note"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

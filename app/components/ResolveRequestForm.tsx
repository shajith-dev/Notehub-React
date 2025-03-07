"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function ResolveRequestForm({
  requestId,
  onSuccess,
}: {
  requestId: number;
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Here you would typically send the data to your backend
      console.log({ requestId, title, file });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Reset form
      setTitle("");
      setFile(null);
      onSuccess?.(); // Call onSuccess if provided
    } catch (error) {
      console.error("Error resolving request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Resolve Request</h2>
        <p className="mt-1 text-sm text-gray-500">
          Provide your response and upload any relevant materials
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="response"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
              placeholder="Enter a title for your note"
            />
          </div>

          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload PDF Note
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative ${
                dragActive ? "border-accent bg-accent/5" : ""
              } transition-colors duration-150`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-2 text-center">
                {!file ? (
                  <>
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
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
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
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
            disabled={isLoading || !title}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

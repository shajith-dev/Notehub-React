"use client";

import { useState } from "react";
import {
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  Book,
  MessageSquare,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchNotes, getSubjects } from "@/app/api/note";
import { PagedResult } from "@/types/common";
import { Note, Subject } from "@/types/note";
import Link from "next/link";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<number>(0);

  // Debounce search term for 300ms
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch subjects for filter
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  // Add "All" option to subjects
  const filterSubjects = [{ subjectId: 0, name: "All" }, ...subjects];

  const { data, isLoading, error } = useQuery<PagedResult<Note>>({
    queryKey: ["searchResults", debouncedSearchTerm, pageNo, selectedSubject],
    queryFn: () => {
      const subjectIds = selectedSubject === 0 ? undefined : [selectedSubject]; // Use as number since the API expects number[]
      return searchNotes(debouncedSearchTerm, pageNo, subjectIds) as Promise<
        PagedResult<Note>
      >;
    },
    enabled: true,
    staleTime: 60 * 1000,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Reset page number when submitting a new search
    setPageNo(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset page number when search term changes
    setPageNo(0);
  };

  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubject(subjectId);
    setPageNo(0); // Reset to first page when changing filter
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for notes by keyword or browse by subject
          </p>
        </div>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex items-stretch gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for notes..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterSubjects.map((subject) => (
              <button
                key={subject.subjectId}
                onClick={() => handleSubjectChange(subject.subjectId)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedSubject === subject.subjectId
                    ? "bg-accent text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="loader h-8 w-8 rounded-full border-4 border-accent border-r-transparent animate-spin"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Searching...
            </span>
          </div>
        )}

        {!isLoading && data?.results.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">
              An error occurred while fetching results. Please try again.
            </p>
          </div>
        )}

        {!isLoading && data && data.results.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.results.map((note: any) => (
                <Link
                  href={`/notes/${note.noteId}`}
                  key={note.noteId}
                  className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-accent" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {note.subjectName || "Unknown Subject"}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {note.createdAt || ""}
                    </span>
                  </div>
                  <h2 className="mt-2 font-semibold text-gray-900 dark:text-white">
                    {note.title}
                  </h2>
                  {note.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {note.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-accent">
                        {note.author?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {note.author}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setPageNo(Math.max(0, pageNo - 1))}
                  disabled={pageNo === 0}
                  className="p-1 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600 dark:disabled:hover:text-gray-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[5rem] text-center">
                  Page {pageNo + 1}
                </span>
                <button
                  onClick={() => setPageNo(pageNo + 1)}
                  disabled={!data.hasMore}
                  className="p-1 text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600 dark:disabled:hover:text-gray-400"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

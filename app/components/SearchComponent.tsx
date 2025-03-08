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
  const filterSubjects = [
    { subjectId: 0, name: "All" },
    ...subjects,
  ];

  const { data, isLoading, error } = useQuery<PagedResult<Note>>({
    queryKey: ["searchResults", debouncedSearchTerm, pageNo, selectedSubject],
    queryFn: () => {
      const subjectIds = selectedSubject === 0 
        ? undefined 
        : [selectedSubject]; // Use as number since the API expects number[]
      return searchNotes(debouncedSearchTerm, pageNo, subjectIds) as Promise<PagedResult<Note>>;
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
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for notes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1 bg-accent text-white rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Subject Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filterSubjects.map((subject) => (
            <button
              key={subject.subjectId}
              onClick={() => handleSubjectChange(subject.subjectId)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                selectedSubject === subject.subjectId
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {subject.name.charAt(0).toUpperCase() + subject.name.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            Error: {(error as Error).message}
          </p>
        ) : data && data.results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {data.results.map((note: Note) => (
              <Link
                href={`/notes/${note.noteId}`}
                key={note.noteId}
                className="block"
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-accent" />
                      <h3 className="font-medium text-gray-900">
                        {note.subjectName || "Unknown Subject"}
                      </h3>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {note.title}
                  </h2>
                  
                  {/* Enhanced Author Section */}
                  {note.author && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-accent">
                              {note.author.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {note.author}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                          {note.subjectName || "Note"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : debouncedSearchTerm !== "" ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              No notes found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {selectedSubject === 0
                ? "No notes match your search query. Try different keywords or check your spelling."
                : `No notes found for this subject with this search query. Try selecting a different subject or changing your search terms.`}
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject(0);
              }}
              className="mt-4 px-4 py-2 bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      {data?.results.length ? (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setPageNo(Math.max(0, pageNo - 1))}
              disabled={pageNo === 0}
              className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[5rem] text-center">
              {pageNo + 1} {data.hasMore ? "" : "/ " + (pageNo + 1)}
            </span>
            <button
              onClick={() => setPageNo(pageNo + 1)}
              disabled={!data.hasMore}
              className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

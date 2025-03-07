"use client";

import { useState } from "react";
import { SearchIcon, ChevronLeft, ChevronRight, Book, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchNotes } from "@/app/api/note";
import { PagedResult } from "@/types/common";
import { Note } from "@/types/note";
import Link from "next/link";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState<number>(0);
  
  // Debounce search term for 300ms
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading, error } = useQuery<PagedResult<Note>>({
    queryKey: ["searchResults", debouncedSearchTerm, pageNo],
    queryFn: () => searchNotes(debouncedSearchTerm, pageNo),
    enabled: debouncedSearchTerm !== "",
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

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-8">
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

      <div>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            Error: {(error as Error).message}
          </p>
        ) : data && data.results.length > 0 ? (
          <div className="space-y-3">
            {data.results.map((note : Note) => (
              <Link 
                href={`/notes/${note.noteId}`} 
                key={note.noteId} 
                className="block group"
              >
                <div className="bg-white px-4 py-3 rounded-md shadow-sm border border-gray-100 transition-all duration-200 ease-in-out hover:shadow-md hover:border-accent/20 group-hover:transform group-hover:scale-[1.01]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-medium text-gray-900 group-hover:text-accent transition-colors duration-200 truncate">
                        {note.title}
                      </h2>
                      {note.description && (
                        <p className="mt-1 text-sm text-gray-600 truncate">
                          {note.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : debouncedSearchTerm !== "" ? (
          <p className="text-center text-gray-500">No results found.</p>
        ) : null}
      </div>

      {data?.results.length ? (
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <button
            onClick={() => setPageNo(Math.max(0, pageNo - 1))}
            disabled={pageNo === 0}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pageNo + 1} {data.hasMore ? '' : 'of ' + (pageNo + 1)}
          </span>
          <button
            onClick={() => setPageNo(pageNo + 1)}
            disabled={!data.hasMore}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

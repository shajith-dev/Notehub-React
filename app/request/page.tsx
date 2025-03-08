"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequests } from "../api/request";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Book,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import NoteRequestForm from "../components/NoteRequestForm";
import ResolveRequestForm from "../components/ResolveRequestForm";
import { Request } from "../types/request";
import { getSubjects } from "../api/note";
import { Subject } from "@/types/note";
import { PagedResult } from "@/types/common";

export default function RequestPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [resolveSubjectId, setResolveSubjectId] = useState<number | null>(
    null,
  );
  const [selectedSubject, setSelectedSubject] = useState<number>(0);

  const { data, isLoading, error } = useQuery<PagedResult<Request>>({
    queryKey: ["requests", selectedSubject, currentPage],
    queryFn: () => {
      const subjectIds = selectedSubject === 0 
        ? undefined 
        : [selectedSubject];
      return getRequests(subjectIds || [], currentPage)
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const subjectMap = new Map<number, Subject>();
  subjects.forEach((subject) => {
    subjectMap.set(subject.subjectId, subject);
  });

  const filterSubjects = [
    { subjectId: 0, name: "All" },
    ...subjects,
  ];

  const handleResolveClick = (requestId: number, subjectId: number) => {
    setSelectedRequestId(requestId);
    setResolveSubjectId(subjectId);
    setIsResolveModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Note Requests
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Request Note
          </button>
        </div>

        {/* Subject Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterSubjects.map((subject) => (
              <button
                key={subject.subjectId}
                onClick={() => {
                  setSelectedSubject(subject.subjectId);
                  setCurrentPage(0); // Reset to first page when changing filter
                }}
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

        {/* Requests Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.results.map((request) => (
            <div
              key={request.requestId}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-[200px]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-accent" />
                  <h3 className="font-medium text-gray-900">
                    {subjectMap.get(request.subjectId)?.name}
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  {request.createdAt}
                </span>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2 overflow-y-auto flex-grow">
                {request.description}
              </p>
              <div className="mt-4 flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-accent">
                      {request.author?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {request.author}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      !request.resolved
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {request.resolved ? "CLOSED" : "OPEN"}
                  </span>
                  {!request.resolved && (
                    <button
                      onClick={() => handleResolveClick(request?.requestId!, request?.subjectId!)}
                      className="flex items-center justify-center h-6 w-6 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors"
                      title="Resolve Request"
                    >
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data?.results.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests found
            </h3>
            <p className="text-gray-500">
              {selectedSubject === 0
                ? "There are no note requests yet. Be the first to make a request!"
                : "No requests found for this subject. Try selecting a different subject or make a new request."}
            </p>
          </div>
        )}

        {data?.results.length ? (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[5rem] text-center">
              {currentPage + 1} {data.hasMore ? "" : "/ " + (currentPage + 1)}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage+ 1)}
              disabled={!data.hasMore}
              className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}

        {/* Request Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200 ease-in-out">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
              <div className="relative">
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-accent/5 to-transparent">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Request a Note
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <NoteRequestForm />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolve Modal */}
        {isResolveModalOpen && selectedRequestId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200 ease-in-out">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
              <div className="relative">
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-accent/5 to-transparent">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Resolve Request
                  </h2>
                  <button
                    onClick={() => {
                      setIsResolveModalOpen(false);
                      setSelectedRequestId(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <ResolveRequestForm
                    requestId={selectedRequestId}
                    subjectId={resolveSubjectId!}
                    onSuccess={() => {
                      setIsResolveModalOpen(false);
                      setSelectedRequestId(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

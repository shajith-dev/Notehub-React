"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequests } from "../api/request";
import { ChevronLeft, ChevronRight, Plus, Filter, Book, MessageSquare, CheckCircle } from "lucide-react";
import NoteRequestForm from "../components/NoteRequestForm";
import ResolveRequestForm from "../components/ResolveRequestForm";
import { Request } from "../types/request";

export default function RequestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const itemsPerPage = 10;

  const { data: requests = [] } = useQuery<Request[]>({
    queryKey: ["requests"],
    queryFn: getRequests,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  // Get unique subjects from requests
  const subjects = ["all", ...new Set(requests.map(request => request.subject))] as string[];

  // Filter requests by subject and paginate
  const filteredRequests = selectedSubject === "all" 
    ? requests 
    : requests.filter(request => request.subject === selectedSubject);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handleResolveClick = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsResolveModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Note Requests</h1>
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
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => {
                  setSelectedSubject(subject);
                  setCurrentPage(1); // Reset to first page when changing filter
                }}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedSubject === subject
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleRequests.map((request) => (
            <div
              key={request.requestId}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-accent" />
                  <h3 className="font-medium text-gray-900">{request.subject}</h3>
                </div>
                <span className="text-xs text-gray-500">{request.createdAt}</span>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2">{request.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-accent">{request.author?.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-600">{request.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    request.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                  {request.status === "open" && (
                    <button
                      onClick={() => handleResolveClick(request.requestId)}
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
        {visibleRequests.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {selectedSubject === "all" 
                ? "There are no note requests yet. Be the first to make a request!"
                : "No requests found for this subject. Try selecting a different subject or make a new request."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600 min-w-[5rem] text-center">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Request Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Request a Note</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <div className="p-6">
                <NoteRequestForm />
              </div>
            </div>
          </div>
        )}

        {/* Resolve Modal */}
        {isResolveModalOpen && selectedRequestId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <button
                  onClick={() => {
                    setIsResolveModalOpen(false);
                    setSelectedRequestId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 w-full flex justify-center items-center"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <div className="p-6">
                <ResolveRequestForm requestId={selectedRequestId} onSuccess={() => {
                  setIsResolveModalOpen(false);
                  setSelectedRequestId(null);
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

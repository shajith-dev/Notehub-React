"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserNotes, deleteNote } from "../api/note";
import { getUserRequests, deleteRequest } from "../api/request";
import { 
  Book, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  CheckCircle, 
  Trash2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"notes" | "requests">("notes");
  const [notesPage, setNotesPage] = useState(0);
  const [requestsPage, setRequestsPage] = useState(0);
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<"note" | "request">("note");
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch user notes
  const { 
    data: notesData, 
    isLoading: isLoadingNotes, 
    error: notesError 
  } = useQuery({
    queryKey: ["userNotes", notesPage],
    queryFn: () => getUserNotes(notesPage),
    enabled: activeTab === "notes",
  });

  // Fetch user requests
  const { 
    data: requestsData, 
    isLoading: isLoadingRequests, 
    error: requestsError 
  } = useQuery({
    queryKey: ["userRequests", requestsPage],
    queryFn: () => getUserRequests(requestsPage),
    enabled: activeTab === "requests",
  });
  
  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotes"] });
      setIsDeleteDialogOpen(false);
    },
  });

  // Delete request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: number) => deleteRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRequests"] });
      setIsDeleteDialogOpen(false);
    },
  });
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!deleteItemId) return;
    
    if (deleteItemType === "note") {
      deleteNoteMutation.mutate(deleteItemId);
    } else if (deleteItemType === "request") {
      deleteRequestMutation.mutate(deleteItemId);
    }
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (type: "note" | "request", id: number) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your notes and requests</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("notes")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notes"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>My Notes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "requests"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>My Requests</span>
              </div>
            </button>
          </div>
        </div>

        {/* Notes Tab Content */}
        {activeTab === "notes" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Uploaded Notes</h2>
            
            {isLoadingNotes && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading your notes...</p>
              </div>
            )}

            {notesError && (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load notes. Please try again.</p>
              </div>
            )}

            {!isLoadingNotes && notesData?.results.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notes uploaded yet</h3>
                <p className="text-gray-500 mb-6">You haven't uploaded any notes yet.</p>
                <Link 
                  href="/upload" 
                  className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Upload a Note
                </Link>
              </div>
            )}

            {!isLoadingNotes && notesData && notesData?.results.length > 0 && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {notesData.results.map((note) => (
                    <div
                      key={note.noteId}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-[200px] relative group"
                    >
                      <Link 
                        href={`/notes/${note.noteId}`}
                        className="absolute inset-0 z-10"
                      >
                        <span className="sr-only">View Note</span>
                      </Link>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-accent" />
                          <h3 className="font-medium text-gray-900">
                            {note.subjectName}
                          </h3>
                        </div>
                      </div>
                      <h2 className="mt-2 font-semibold text-gray-900">{note.title}</h2>
                      <p className="mt-2 text-gray-600 line-clamp-2 overflow-y-auto flex-grow">
                        {note.description || "No description provided."}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-accent">
                              {note.author?.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {note.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                            View Note
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openDeleteDialog("note", note.noteId!);
                            }}
                            className="z-20 relative p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Note"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {notesData.results.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                      <button
                        onClick={() => setNotesPage(Math.max(0, notesPage - 1))}
                        disabled={notesPage === 0}
                        className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-gray-600 min-w-[5rem] text-center">
                        {notesPage + 1} {notesData.hasMore ? "" : "/ " + (notesPage + 1)}
                      </span>
                      <button
                        onClick={() => setNotesPage(notesPage + 1)}
                        disabled={!notesData.hasMore}
                        className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Requests Tab Content */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Note Requests</h2>
            
            {isLoadingRequests && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading your requests...</p>
              </div>
            )}

            {requestsError && (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load requests. Please try again.</p>
              </div>
            )}

            {!isLoadingRequests && requestsData?.results.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests made yet</h3>
                <p className="text-gray-500 mb-6">You haven't made any note requests yet.</p>
                <Link 
                  href="/request" 
                  className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Make a Request
                </Link>
              </div>
            )}

            {!isLoadingRequests && requestsData && requestsData?.results?.length > 0 && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {requestsData?.results?.map((request) => (
                    <div
                      key={request.requestId}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-[200px] relative"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-accent" />
                          <h3 className="font-medium text-gray-900">
                            {request.title}
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
                          {request.resolved && (
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                              <CheckCircle className="h-4 w-4 text-green-700" />
                            </div>
                          )}
                          <button
                            onClick={() => openDeleteDialog("request", request.requestId!)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {requestsData?.results && requestsData.results.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                      <button
                        onClick={() => setRequestsPage(Math.max(0, requestsPage - 1))}
                        disabled={requestsPage === 0}
                        className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-gray-600 min-w-[5rem] text-center">
                        {requestsPage + 1} {requestsData?.hasMore ? "" : "/ " + (requestsPage + 1)}
                      </span>
                      <button
                        onClick={() => setRequestsPage(requestsPage + 1)}
                        disabled={!requestsData?.hasMore}
                        className="p-1 text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-lg">
          <div className="p-5">
            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="text-lg font-medium">
                Delete {deleteItemType === "note" ? "Note" : "Request"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500">
                Are you sure you want to delete this {deleteItemType}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-100">
            <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 
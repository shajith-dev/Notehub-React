"use client";

import React, { useState, memo, useRef } from "react";
import { User, MoreVertical, Send, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Comment } from "@/types/comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments, addComment } from "@/app/api/comment";
import { useAuthStore } from "@/stores/store";

// Memoized Comment Component
const CommentComponent = memo(function CommentComponent({
  comment,
  commentRef,
  setParentId,
  isReply = false,
}: {
  comment: Comment;
  commentRef: React.RefObject<HTMLTextAreaElement>;
  setParentId: React.Dispatch<React.SetStateAction<number | undefined>>;
  isReply?: boolean;
}) {
  return (
    <div
      className={`group flex gap-3 ${
        isReply ? "ml-8 mt-3 pt-3 border-t border-gray-100" : "mb-4"
      } ${!isReply ? "animate-in fade-in duration-300" : ""}`}
    >
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
          <User className="h-5 w-5 text-accent" />
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-gray-900">{comment.author}</h3>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">
            {comment.createdAt || "Just now"}
          </span>
        </div>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p className="whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
        {!isReply && (
          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => {
                commentRef.current?.focus();
                setParentId(comment.commentId);
              }}
              className="text-xs font-medium text-gray-500 hover:text-accent flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="h-3 w-3" />
              Reply
            </button>
          </div>
        )}
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-400 hover:text-gray-600">
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
});

export default function CommentSection({ noteId }: { noteId: number }) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAuthStore((store) => store.user);
  const [parentId, setParentId] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: comments = [] } = useQuery({
    queryKey: ["comment", noteId],
    queryFn: () => getComments(noteId),
    refetchInterval: 60 * 1000,
    staleTime: 5000,
  });

  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleComments = comments.slice(startIndex, startIndex + itemsPerPage);

  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comment", noteId] });
      setParentId(undefined);
      setNewComment("");
    },
  });

  const handleAddComment = () => {
    const comment: Comment = {
      createdBy: user?.userId!,
      content: newComment,
      noteId,
      parentId,
    };
    mutation.mutate(comment);
  };

  return (
    <div className="flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          Comments
        </h2>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Add Comment Form */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="flex-grow relative">
              {parentId && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <button
                    onClick={() => setParentId(undefined)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    <span className="text-accent">×</span>
                    Cancel reply
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={parentId ? "Write a reply..." : "Add a comment..."}
                className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-accent text-sm resize-none min-h-[80px]"
                rows={3}
                ref={commentTextAreaRef}
              />
              <button
                onClick={() => handleAddComment()}
                disabled={!newComment.trim()}
                className="absolute bottom-2 right-2 bg-accent text-white p-1.5 rounded-full hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          {visibleComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {visibleComments.map((comment) => (
                <div key={comment.commentId}>
                  <CommentComponent
                    comment={comment}
                    commentRef={commentTextAreaRef}
                    setParentId={setParentId}
                  />
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-1">
                      {comment.replies.map((reply) => (
                        <CommentComponent
                          key={reply.commentId}
                          comment={reply}
                          commentRef={commentTextAreaRef}
                          setParentId={setParentId}
                          isReply
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination - Now outside the scrollable area */}
      <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-accent disabled:opacity-50 disabled:hover:text-gray-600"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

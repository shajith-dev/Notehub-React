"use client";

import React, { useState, memo, useRef } from "react";
import {
  User,
  Send,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Comment } from "@/types/comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments, addComment, deleteComment } from "@/app/api/comment";
import { useAuthStore } from "@/stores/store";
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

// Memoized Comment Component
const CommentComponent = memo(function CommentComponent({
  comment,
  commentRef,
  setParentId,
  isReply = false,
  onDeleteClick,
}: {
  comment: Comment;
  commentRef: React.RefObject<HTMLTextAreaElement>;
  setParentId: React.Dispatch<React.SetStateAction<number | undefined>>;
  isReply?: boolean;
  onDeleteClick: (commentId: number) => void;
}) {
  const user = useAuthStore((store) => store.user);
  const isAuthor =
    user?.userId === comment.createdBy || user?.userName === comment.author;

  return (
    <div
      className={`group flex gap-3 ${
        isReply ? "ml-8 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700" : "mb-4"
      } ${!isReply ? "animate-in fade-in duration-300" : ""}`}
    >
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
          <User className="h-5 w-5 text-accent" />
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {comment.author}
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {comment.createdAt || "Just now"}
          </span>
        </div>
        <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
          <p className="whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
        {!isReply && (
          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => {
                commentRef.current?.focus();
                setParentId(comment.commentId);
              }}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="h-3 w-3" />
              Reply
            </button>
          </div>
        )}
      </div>
      {isAuthor && (
        <button
          onClick={() => onDeleteClick(comment.commentId!)}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 w-6 h-6 flex items-center justify-center"
          title="Delete comment"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
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
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

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

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(noteId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", noteId] });
      setIsDeleteDialogOpen(false);
      setCommentToDelete(null);
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      noteId,
      content: newComment,
      author: user.userName,
      createdBy: user.userId,
      parentId,
    };

    mutation.mutate(comment);
  };

  const handleDeleteClick = (commentId: number) => {
    setCommentToDelete(commentId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      deleteMutation.mutate(commentToDelete);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          Comments
        </h2>

        {/* Comments List */}
        <div className="mb-6">
          {/* Add Comment Form */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
                  <User className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div className="flex-grow relative">
                {parentId && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <button
                      onClick={() => setParentId(undefined)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                    >
                      <span className="text-accent">×</span>
                      Cancel reply
                    </button>
                  </div>
                )}
                <textarea
                  placeholder={
                    parentId ? "Write a reply..." : "Add a comment..."
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-lg focus:ring-1 focus:ring-accent text-sm text-gray-700 dark:text-gray-200 resize-none min-h-[80px] placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
        </div>

        {/* Comments */}
        <div className="space-y-4">
          {visibleComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
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
                    onDeleteClick={handleDeleteClick}
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
                          onDeleteClick={handleDeleteClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {comments.length > itemsPerPage && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent disabled:opacity-50 disabled:hover:text-gray-500 dark:disabled:hover:text-gray-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent disabled:opacity-50 disabled:hover:text-gray-500 dark:disabled:hover:text-gray-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-0 max-w-md p-0 overflow-hidden shadow-lg">
          <div className="p-5">
            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Comment
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this comment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="flex justify-end gap-2 p-4 border-t border-gray-100 dark:border-gray-700">
            <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

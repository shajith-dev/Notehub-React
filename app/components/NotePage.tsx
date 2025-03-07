"use client";

import { useState, useEffect } from "react";
import PDFViewer from "./PDFViewer";
import CommentSection from "./CommentSection";
import ChatComponent from "./ChatComponent";
import { useQuery } from "@tanstack/react-query";
import { getNote } from "@/app/api/note";
import { Note } from "@/types/note";
import { MessageSquare, MessageCircle } from "lucide-react";

type Tab = "chat" | "comments";

export default function NotePage({ noteId }: { noteId: number }) {
  const [note, setNote] = useState<Note>();
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const { data } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNote(noteId),
  });

  useEffect(() => {
    if (data) {
      setNote(data);
    }
  }, [data]);

  const TabButton = ({
    tab,
    label,
    icon: Icon,
  }: {
    tab: Tab;
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200
        ${
          activeTab === tab
            ? "text-accent border-b-2 border-accent bg-accent/5"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col space-y-6">
            {/* Main content area */}
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
              {/* PDF Viewer */}
              <div className="w-full lg:w-2/3">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
                  <PDFViewer url={note?.url!} />
                </div>
              </div>

              {/* Chat and Comments Section */}
              <div className="w-full lg:w-1/3 flex flex-col h-[calc(100vh-12rem)]">
                {/* Mobile Tabs */}
                <div className="lg:hidden flex border-b border-gray-200 bg-white rounded-t-lg">
                  <TabButton tab="chat" label="Chat" icon={MessageCircle} />
                  <TabButton
                    tab="comments"
                    label="Comments"
                    icon={MessageSquare}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white shadow-xl rounded-lg lg:rounded-lg overflow-hidden">
                  {/* Desktop View - Always show Chat */}
                  <div className="hidden lg:block h-full">
                    <ChatComponent noteId={noteId} noteUrl={note?.url} />
                  </div>

                  {/* Mobile View - Show based on active tab */}
                  <div className="lg:hidden h-full">
                    <div
                      className={`h-full transition-all duration-300 transform ${
                        activeTab === "chat"
                          ? "translate-x-0 opacity-100"
                          : "translate-x-full opacity-0 hidden"
                      }`}
                    >
                      <ChatComponent noteId={noteId} noteUrl={note?.url} />
                    </div>
                    <div
                      className={`h-full flex flex-col transition-all duration-300 transform ${
                        activeTab === "comments"
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-full opacity-0 hidden"
                      }`}
                    >
                      <div className="flex-1 overflow-y-auto">
                        <CommentSection noteId={noteId} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Comments Section */}
            <div className="hidden lg:block w-full">
              <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <CommentSection noteId={noteId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

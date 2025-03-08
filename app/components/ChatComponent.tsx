"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import { useAuthStore } from "@/stores/store";
import { Message } from "@/types/chat";
import { getChatResponse } from "../api/chat";
import { v4 as uuidv4 } from "uuid";

export default function ChatComponent({
  noteId,
  noteUrl,
}: {
  noteId: number;
  noteUrl: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      content:
        "Hello! I'm your AI assistant. I can help you understand the content of your notes and answer any questions you might have.",
      role: "assistant",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    const storedMessages = sessionStorage.getItem(`${user?.userId}_${noteId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: newMessage,
      role: "user",
    };
    try {
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      setIsLoading(true);
      const assistantMessage = await getChatResponse(newMessage, noteUrl);
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      sessionStorage.setItem(
        `${user?.userId}_${noteId}`,
        JSON.stringify([...messages, userMessage, assistantMessage]),
      );
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content:
            "An error occurred while fetching the chat response. Please try again later.",
          role: "assistant",
        },
      ]);
      setIsLoading(false);
      sessionStorage.setItem(
        `${user?.userId}_${noteId}`,
        JSON.stringify([
          ...messages,
          userMessage,
          {
            id: uuidv4(),
            content:
              "An error occurred while fetching the chat response. Please try again later.",
            role: "assistant",
          },
        ]),
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          AI Chat Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-accent text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "assistant" && (
                  <Bot className="h-6 w-6 mt-0.5 flex-shrink-0 text-accent" />
                )}
                <div className="flex-1">
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <User className="h-5 w-5 mt-0.5 flex-shrink-0 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question about the notes..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="bg-accent text-white p-2 rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import { useAuthStore } from "@/stores/store";
import { Message } from "@/types/chat";
import { getChatResponse } from "../api/chat";
import { v4 as uuidv4 } from 'uuid';

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
      role: "assistant"
    }
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
    try{
      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      setIsLoading(true);
      const assistantMessage = await getChatResponse(newMessage, noteUrl);
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      sessionStorage.setItem(`${user?.userId}_${noteId}`, JSON.stringify([...messages, userMessage, assistantMessage]));
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prev) => [...prev, {
        id: uuidv4(),
        content: "An error occurred while fetching the chat response. Please try again later.",
        role: "assistant"
      }]);
      setIsLoading(false);
      sessionStorage.setItem(`${user?.userId}_${noteId}`, JSON.stringify([...messages, userMessage, {
        id: uuidv4(),
        content: "An error occurred while fetching the chat response. Please try again later.",
        role: "assistant"
      }]));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          Chat Assistant
        </h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-accent/10" : "bg-emerald-100"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-5 w-5 text-accent"/>
                ) : (
                  <Bot className="h-5 w-5 text-emerald-600" />
                )}
              </div>
            </div>

            {/* Message Bubble */}
            <div
              className={`flex flex-col max-w-[80%] ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.role === "user"
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-pulse flex gap-1">
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 pr-10 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-accent text-sm resize-none min-h-[44px] max-h-32"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="flex-shrink-0 bg-accent text-white p-2 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all h-[44px] w-[44px] flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

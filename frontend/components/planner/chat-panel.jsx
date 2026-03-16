"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Render a chat message bubble.
 * Long assistant messages (likely the raw AI plan) are shown in a scrollable
 * pre-formatted block so headings and bullet-lists remain readable.
 */
function MessageBubble({ message, index }) {
  const isUser = message.role === "user";
  const isLong = !isUser && message.content.length > 300;

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
        isUser
          ? "ml-auto bg-[var(--primary)] text-[var(--primary-foreground)]"
          : "bg-white/80 dark:bg-slate-900/80"
      }`}
    >
      {isLong ? (
        <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed" tabIndex={0} aria-label="Trip itinerary details">
          {message.content}
        </pre>
      ) : (
        message.content
      )}
    </motion.div>
  );
}

export function ChatPanel({ initialMessages, suggestionChips, isGenerating = false, onSendMessage }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const scrollRef = useRef(null);

  // Keep messages in sync when the parent updates initialMessages
  // (e.g. after the trip plan is fetched)
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoadingResponse]);

  const responseCount = useMemo(() => messages.filter((m) => m.role === "assistant").length, [messages]);

  const sendMessage = async (content) => {
    if (!content.trim() || isLoadingResponse || isGenerating) return;

    const prompt = content.trim();
    const userMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoadingResponse(true);

    try {
      let answer;
      if (typeof onSendMessage === "function") {
        answer = await onSendMessage(prompt);
      } else {
        // Fallback: simulate a response when no API handler is provided
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
        answer = `Applied: "${prompt}". I updated your plan with smarter sequencing, realistic travel-time gaps, and better local recommendations.`;
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: answer }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't process that request. Please try again."
        }
      ]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const isBusy = isGenerating || isLoadingResponse;

  return (
    <Card className="h-full rounded-2xl">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Trip Assistant</CardTitle>
          <Badge variant="secondary">{responseCount} AI responses</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex h-[620px] flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={isBusy}
              onClick={() => sendMessage(chip)}
              className="rounded-full border px-3 py-1 text-xs transition hover:bg-[var(--muted)] disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}

          {isBusy && (
            <div className="max-w-[80%] space-y-2 rounded-2xl border bg-white/80 p-4 dark:bg-slate-900/80">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-60" />
              <Skeleton className="h-3 w-52" />
            </div>
          )}
        </div>

        <form
          className="sticky bottom-0 mt-auto flex items-center gap-2 rounded-2xl border bg-white/90 p-2 dark:bg-slate-950/70"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isBusy ? "Generating your trip…" : "Refine this itinerary…"}
            disabled={isBusy}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button size="icon" type="submit" disabled={isBusy} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

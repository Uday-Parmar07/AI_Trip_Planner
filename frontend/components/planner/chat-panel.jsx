"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatPanel({ initialMessages, suggestionChips }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const responseCount = useMemo(() => messages.filter((message) => message.role === "assistant").length, [messages]);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const prompt = content.trim();
    const userMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoadingResponse(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/query`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: prompt })
        }
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't reach the AI assistant right now. Please make sure the backend server is running on port 8000 and try again."
        }
      ]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

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
              onClick={() => sendMessage(chip)}
              className="rounded-full border px-3 py-1 text-xs transition hover:bg-[var(--muted)]"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.role === "user"
                  ? "ml-auto bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-white/80 dark:bg-slate-900/80"
              }`}
            >
              {message.content}
            </motion.div>
          ))}

          {isLoadingResponse && (
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
            placeholder="Refine this itinerary..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button size="icon" type="submit" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

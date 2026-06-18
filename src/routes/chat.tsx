import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Worklytic" },
      { name: "description", content: "Chat with your AI workplace productivity assistant." },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me prep talking points for a 1:1 with my manager.",
  "Rewrite this Slack message to sound more diplomatic.",
  "Brainstorm 5 ways to improve our weekly team meeting.",
];

function ChatPage() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  async function submit(text: string) {
    if (!text.trim() || isLoading) return;
    setInput("");
    await sendMessage({ text });
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <PageHeader
        icon={MessageSquare}
        title="AI Chatbot"
        description="Conversational assistant for any work question."
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border bg-card p-5 shadow-sm"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">How can I help today?</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Ask anything about your work — drafting, planning, summarizing, brainstorming.
            </p>
            <div className="mt-6 flex w-full max-w-md flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-lg border bg-background px-4 py-2.5 text-left text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  {isUser ? (
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                      {text}
                    </div>
                  ) : (
                    <div className="max-w-[85%]">
                      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Worklytic AI
                      </div>
                      <div className="ai-prose">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking…
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); submit(input); }}
        className="mt-3 flex items-end gap-2 rounded-xl border bg-card p-2 shadow-sm"
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(input);
            }
          }}
          rows={1}
          placeholder="Ask anything…"
          className="min-h-[44px] flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        ⚠ AI-generated content may require human review.
      </p>
    </div>
  );
}

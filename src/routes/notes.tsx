import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { summarizeMeeting } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Worklytic" },
      { name: "description", content: "Turn raw meeting notes into key points, decisions, and action items." },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Quick sync on Q4 roadmap.
- Alex: backend latency P95 is up 22% since Oct, owner = Priya, fix by Nov 15
- Sam: design for onboarding revamp ready for review next Tue
- Decision: kill the legacy export feature after EOY
- New customer (Northwind) wants SSO by Dec; CSM to confirm scope by Friday
- Hiring: open senior PM req approved, JD ready next week`;

function NotesPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (notes.trim().length < 10) {
      toast.error("Paste at least a few lines of notes.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { notes } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Summarization failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get a structured summary with action items and deadlines."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Raw notes / transcript</Label>
              <button
                type="button"
                onClick={() => setNotes(SAMPLE)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Load sample
              </button>
            </div>
            <Textarea
              rows={16}
              placeholder="Paste meeting notes, transcript, or bullet points…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Summarizing…" : "Summarize meeting"}
          </Button>
        </form>
        <AiOutput text={output} loading={loading} />
      </div>
    </div>
  );
}

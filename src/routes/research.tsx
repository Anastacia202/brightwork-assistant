import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { researchTopic } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Worklytic" },
      { name: "description", content: "Get structured AI briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

const SUGGESTIONS = [
  "AI agents for SaaS support teams",
  "Best practices for async standups",
  "Pricing models for B2B vertical SaaS",
];

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function go(t: string) {
    setTopic(t);
    if (t.trim().length < 3) return toast.error("Enter a research topic.");
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { topic: t } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Research failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Get an executive-style briefing with insights, trends, risks, and next steps."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => { e.preventDefault(); go(topic); }}
          className="space-y-4 rounded-xl border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input
              placeholder="e.g. Generative AI in customer onboarding"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Try one of these</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => go(s)}
                  className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Researching…" : "Research topic"}
          </Button>
        </form>
        <AiOutput text={output} loading={loading} />
      </div>
    </div>
  );
}

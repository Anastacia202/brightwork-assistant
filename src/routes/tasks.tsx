import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { planTasks } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Worklytic" },
      { name: "description", content: "Prioritize and schedule your tasks with AI." },
    ],
  }),
  component: TasksPage,
});

const horizons = ["today", "tomorrow", "this week", "this sprint", "this month"];

function TasksPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("this week");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tasks.trim().length < 5) {
      toast.error("Add a few tasks to plan.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { tasks, horizon } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Planning failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Drop in your to-dos and get a prioritized, time-blocked plan."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label>Horizon</Label>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {horizons.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tasks (one per line)</Label>
            <Textarea
              rows={12}
              placeholder={"Prepare board deck\nReview hiring loop feedback\nFix billing webhook bug\nDraft Q1 OKRs\n…"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Planning…" : "Plan my tasks"}
          </Button>
        </form>
        <AiOutput text={output} loading={loading} />
      </div>
    </div>
  );
}

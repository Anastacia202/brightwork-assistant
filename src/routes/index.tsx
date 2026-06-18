import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Worklytic" },
      { name: "description", content: "Your AI-powered productivity workspace overview." },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft polished emails with tone and audience controls.",
    icon: Mail,
    to: "/email" as const,
    accent: "from-indigo-500/15 to-violet-500/10",
  },
  {
    title: "Meeting Summarizer",
    description: "Turn raw notes into key points, decisions, and action items.",
    icon: FileText,
    to: "/notes" as const,
    accent: "from-emerald-500/15 to-teal-500/10",
  },
  {
    title: "AI Task Planner",
    description: "Prioritize and schedule your work using proven frameworks.",
    icon: ListChecks,
    to: "/tasks" as const,
    accent: "from-amber-500/15 to-orange-500/10",
  },
  {
    title: "Research Assistant",
    description: "Get structured briefings, trends, and insights on any topic.",
    icon: Search,
    to: "/research" as const,
    accent: "from-sky-500/15 to-blue-500/10",
  },
  {
    title: "AI Chatbot",
    description: "Conversational assistant for any work question.",
    icon: MessageSquare,
    to: "/chat" as const,
    accent: "from-pink-500/15 to-rose-500/10",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-accent/40 to-background p-8 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Workspace
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Automate your daily work, beautifully.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Worklytic combines five AI workflows — emails, meetings, planning, research, and chat —
          into one calm, focused workspace.
        </p>
        <p className="mt-4 inline-flex items-center rounded-full border bg-card/70 px-3 py-1 text-[11px] text-muted-foreground">
          ⚠ AI-generated content may require human review.
        </p>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100 ${f.accent}`}
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
            <div className="mt-4 inline-flex items-center text-xs font-medium text-primary">
              Open
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

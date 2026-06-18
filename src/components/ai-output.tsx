import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Check, Info } from "lucide-react";
import { useState } from "react";

export function AiOutput({ text, loading }: { text: string; loading?: boolean }) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-3 w-1/3 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
          <div className="h-3 w-4/6 rounded bg-muted" />
          <div className="h-3 w-3/6 rounded bg-muted" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Generating…</p>
      </div>
    );
  }

  if (!text) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/40 p-10 text-center text-sm text-muted-foreground">
        <Info className="mb-2 h-5 w-5 opacity-60" />
        Output will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          AI Output
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="ai-prose">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      <p className="mt-5 border-t pt-3 text-[11px] text-muted-foreground">
        ⚠ AI-generated content may require human review.
      </p>
    </div>
  );
}

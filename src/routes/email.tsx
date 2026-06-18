import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { generateEmail } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Worklytic" },
      { name: "description", content: "Generate professional emails with AI by tone and audience." },
    ],
  }),
  component: EmailPage,
});

const tones = ["Professional", "Friendly", "Persuasive", "Apologetic", "Direct", "Enthusiastic"];
const audiences = ["Executive", "Client", "Teammate", "Manager", "Vendor", "Candidate"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [audience, setAudience] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recipient || !purpose) {
      toast.error("Please fill in recipient and purpose.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { recipient, audience, tone, purpose, keyPoints } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Draft polished, on-brand emails tuned for your audience and tone."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Input
              placeholder="e.g. Sarah, Head of Marketing at Acme"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Purpose</Label>
            <Input
              placeholder="e.g. Follow up on Q3 proposal and propose a meeting"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Key points (optional)</Label>
            <Textarea
              rows={5}
              placeholder="Bullet the facts, dates, names, or asks to include."
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </form>
        <AiOutput text={output} loading={loading} />
      </div>
    </div>
  );
}

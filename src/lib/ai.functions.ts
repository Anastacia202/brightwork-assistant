import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key);
}

async function run(system: string, prompt: string) {
  const { text } = await generateText({
    model: gateway()(MODEL),
    system,
    prompt,
  });
  return { text };
}

// --- Email generator ---
const EmailInput = z.object({
  recipient: z.string().min(1),
  audience: z.string().min(1),
  tone: z.string().min(1),
  purpose: z.string().min(1),
  keyPoints: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert business communication assistant. Write polished, professional emails.
Rules:
- Match the requested tone precisely.
- Tailor language to the specified audience.
- Use a clear subject line, greeting, body, and sign-off.
- Be concise. Avoid filler. Avoid clichés.
- Output ONLY the email (subject + body). No commentary.`;
    const prompt = `Write an email.
Recipient: ${data.recipient}
Audience: ${data.audience}
Tone: ${data.tone}
Purpose: ${data.purpose}
Key points to include: ${data.keyPoints || "(none provided — infer reasonable defaults)"}

Format:
Subject: <subject line>

<email body with greeting and sign-off>`;
    return run(system, prompt);
  });

// --- Meeting summarizer ---
const NotesInput = z.object({ notes: z.string().min(10) });
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an executive meeting analyst. Convert raw meeting notes into a structured, scannable summary.
Output strictly in markdown with these sections:
## Summary
A 2–3 sentence executive overview.
## Key Points
Bulleted critical discussion points.
## Action Items
Bulleted as: **[Owner]** — task — _due: date_ (use "Unassigned" or "No date" when missing).
## Decisions
Bulleted key decisions made.
## Deadlines
Bulleted dates and what they refer to.
Be faithful to the source. Do not invent owners or dates.`;
    return run(system, `Meeting notes:\n\n${data.notes}`);
  });

// --- Task planner ---
const TaskInput = z.object({
  tasks: z.string().min(5),
  horizon: z.string().default("this week"),
});
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TaskInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are a productivity coach who applies the Eisenhower Matrix and time-blocking.
Produce a clear plan in markdown:
## Prioritized List
Numbered list. Each item: **Task** — _Priority: P1/P2/P3_ — _Effort: S/M/L_ — short rationale.
## Suggested Schedule
A simple time-blocked schedule across the user's horizon (mornings = deep work, afternoons = meetings/admin).
## Risks & Watch-outs
Bulleted potential blockers.
Be realistic about capacity. Group related tasks.`;
    return run(system, `Horizon: ${data.horizon}\n\nTasks:\n${data.tasks}`);
  });

// --- Research assistant ---
const ResearchInput = z.object({ topic: z.string().min(3) });
export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are a senior research analyst. Produce a structured briefing in markdown.
Sections:
## Overview
2–3 sentence definition and context.
## Key Insights
5–7 bullets, each a substantive insight (not a definition).
## Trends & Drivers
Current movement in the space.
## Opportunities & Risks
Two short bulleted subsections.
## Suggested Next Steps
Concrete actions for a professional exploring this topic.
Be specific. Avoid generic statements. Note when something is your reasoning vs. widely accepted.`;
    return run(system, `Research topic: ${data.topic}`);
  });

import type { Analysis } from "@/lib/types";
import {
  geminiResponseSchema,
  isCompleteAnalysis,
  parseAnalysis,
} from "@/lib/analysis-schema";
import { MAX_JD_CHARS, MAX_RESUME_CHARS } from "@/lib/constants";

const SYSTEM_PROMPT = `You are a senior recruiter and resume editor with 15 years of experience hiring for the exact role in the job description. You are direct, specific, and kind. You never invent experience. You quote the resume. You optimise for truthfulness, clarity, and ATS readability.

You will receive a JOB DESCRIPTION and a RESUME. Return a rigorous review as JSON matching the provided schema.

CALIBRATION
- 85–100: exceptional. Clearly meets nearly every must-have with evidence.
- 70–84: strong. A credible fit with a few specific gaps.
- 55–69: mixed. Some relevant evidence, but significant gaps.
- 0–54: weak or misaligned.

RULES
1. Evidence only. Never invent employers, titles, metrics, tools, or skills. If a metric is absent from the resume, use a bracketed placeholder such as [X%] in a rewrite and tell the candidate to replace it with real data.
2. Keywords: choose 18–26 exact, role-relevant terms or short phrases from the job description. Prioritise requirements over nice-to-haves. Use "matched" when the resume contains the term or an unambiguous equivalent, "partial" when the evidence is adjacent, and "missing" when it is absent. Each note must cite resume evidence or give a specific placement suggestion. Importance must be "must-have" for requirements, "important" for core day-to-day work, and "nice-to-have" for bonuses.
3. Missing skills: 3–5 broader skills that are distinct from the exact keyword gaps. Explain why each matters for this role and how to add it truthfully. Never advise the candidate to claim something they cannot discuss in an interview.
4. Bullet rewrites: pick the 3–4 weakest bullets. Quote each original exactly (trim to 220 characters). Rewrite with a strong verb, clear scope, and a measurable outcome. Preserve every fact. Use [X%] placeholders when the original has no metric. The issue label is short (e.g. "Duty-first, no outcome"). The why is one sentence.
5. Score breakdown: exactly five categories labelled "Keyword alignment", "Impact & metrics", "Clarity & structure", "ATS readiness", "Role relevance". Each score 0–100. Each note must cite a count or concrete evidence.
6. Section feedback: 4–6 sections (Summary, Experience, Skills, Education, Formatting, and Projects if relevant). One or two sentences each, specific about what to change.
7. ATS checks: 6–8 checks, including Contact details, Standard headings, File readability, Keyword coverage, Dates and titles, Links, and Length. Status is "pass", "warn", or "fail". You cannot see visual formatting, so only judge what the text supports.
8. Action plan: exactly five prioritised steps, ordered by impact. Each has a short imperative title, a specific detail, and a realistic effort estimate.
9. Verdict: two or three sentences. Name the fit, cite evidence, and name the biggest gap. No hype, no emojis, no "unlock", no exclamation marks.
10. Do not mention or infer age, gender, nationality, race, religion, disability, marital status, photos, or other protected traits. Review only job-relevant evidence.
11. Output valid JSON only. Do not wrap it in markdown fences.

TONE
Warm, plain, honest. Short sentences. No corporate filler. Write like a thoughtful recruiter who wants the candidate to succeed.`;

export class GeminiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
const FALLBACK_GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-flash-latest",
];
const GEMINI_TOTAL_BUDGET_MS = 52_000;
const GEMINI_ATTEMPT_TIMEOUT_MS = 32_000;
const GEMINI_MIN_ATTEMPT_MS = 8_000;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function buildUserPrompt(resumeText: string, jobDescription: string): string {
  const resume = resumeText.slice(0, MAX_RESUME_CHARS);
  const jd = jobDescription.slice(0, MAX_JD_CHARS);
  const truncatedResume = resumeText.length > MAX_RESUME_CHARS;
  const truncatedJd = jobDescription.length > MAX_JD_CHARS;

  return `JOB DESCRIPTION
<<<
${jd}
${truncatedJd ? "\n[The job description was truncated for length.]" : ""}
>>>

RESUME
<<<
${resume}
${truncatedResume ? "\n[The resume was truncated for length.]" : ""}
>>>

Review the resume against this job description. Follow the system rules exactly and return the JSON object.`;
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

async function analyzeWithModel(
  model: string,
  apiKey: string,
  input: { resumeText: string; jobDescription: string },
  timeoutMs: number,
): Promise<Analysis> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        {
          role: "user",
          parts: [{ text: buildUserPrompt(input.resumeText, input.jobDescription) }],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        topP: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: geminiResponseSchema,
      },
    }),
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as {
        error?: { message?: string; status?: string };
      };
      detail = body.error?.message ?? body.error?.status ?? "";
    } catch {
      // Ignore unreadable error bodies.
    }
    throw new GeminiError(
      `Gemini returned ${response.status}${detail ? `: ${detail.slice(0, 180)}` : "."}`,
      response.status,
    );
  }

  const body = (await response.json()) as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string }> };
    }>;
    promptFeedback?: { blockReason?: string };
  };

  if (body.promptFeedback?.blockReason) {
    throw new GeminiError("Gemini blocked the request. Try a different resume or job description.");
  }

  const candidate = body.candidates?.[0];
  if (!candidate) throw new GeminiError("Gemini returned an empty response.");

  if (candidate.finishReason && !["STOP", "MAX_TOKENS"].includes(candidate.finishReason)) {
    throw new GeminiError(`Gemini stopped early (${candidate.finishReason}).`);
  }

  const text = (candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) throw new GeminiError("Gemini returned no text.");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(extractJson(text));
  } catch {
    throw new GeminiError("Gemini returned a response we couldn't read.");
  }

  const analysis = parseAnalysis(parsedJson);
  if (!analysis) {
    throw new GeminiError("Gemini returned a review with missing fields.");
  }

  if (!isCompleteAnalysis(analysis)) {
    throw new GeminiError("Gemini returned an incomplete review.");
  }

  return analysis;
}

export async function analyzeWithGemini(input: {
  resumeText: string;
  jobDescription: string;
}): Promise<Analysis> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new GeminiError("Gemini is not configured.");

  const configuredModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const models = [configuredModel, ...FALLBACK_GEMINI_MODELS].filter(
    (model, index, all) => all.indexOf(model) === index,
  );

  const startedAt = Date.now();
  let lastError: unknown;
  let sawOverloaded = false;
  let sawMissingModel = false;

  for (const model of models) {
    const remaining = GEMINI_TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (remaining < GEMINI_MIN_ATTEMPT_MS) break;

    try {
      const analysis = await analyzeWithModel(
        model,
        apiKey,
        input,
        Math.min(GEMINI_ATTEMPT_TIMEOUT_MS, remaining),
      );
      if (model !== configuredModel) {
        console.info(`[gemini] ${configuredModel} was unavailable; used ${model}.`);
      }
      return analysis;
    } catch (error) {
      lastError = error;
      const status = error instanceof GeminiError ? error.status : undefined;
      const message = error instanceof Error ? error.message : "";
      const timedOut = /aborted|timeout|timed out/i.test(message);
      const networkFailure = /fetch failed|network|ECONN/i.test(message);
      const retryable = timedOut || networkFailure || status === 404 || status === 503;

      if (!retryable) throw error;
      if (status === 503) sawOverloaded = true;
      if (status === 404) sawMissingModel = true;

      const reason = timedOut
        ? "timed out"
        : networkFailure
          ? "network error"
          : `unavailable (${status})`;
      console.warn(`[gemini] ${model} ${reason}; trying the next model.`);
    }
  }

  if (sawOverloaded) {
    throw new GeminiError("All Gemini fallback models are temporarily overloaded.", 503);
  }
  if (sawMissingModel) {
    throw new GeminiError("The configured Gemini model and its fallbacks are unavailable.", 404);
  }

  throw lastError instanceof Error ? lastError : new GeminiError("Gemini is unavailable.");
}

import { NextResponse } from "next/server";
import { analyzeWithGemini, GeminiError, isGeminiConfigured } from "@/lib/gemini";
import { analyzeLocally } from "@/lib/local-analyzer";
import {
  extractResumeFromFile,
  ResumeError,
  sanitizeFileName,
  validateJobDescription,
  validateResumeText,
} from "@/lib/extract";
import type { ReviewMode, ReviewRecord } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const LOCAL_NOTICE =
  "This review used local heuristics. Add a Gemini API key for deeper, role-specific feedback.";
const FALLBACK_NOTICE =
  "Gemini was unavailable, so this review used local heuristics. Scores are directional.";

function fallbackNotice(error: unknown): string {
  if (error instanceof GeminiError) {
    if (error.message.toLowerCase().includes("blocked")) return error.message;
    if (error.status === 503) {
      return "Gemini is temporarily overloaded, so this review used local heuristics. Scores are directional.";
    }
    if (error.status === 404) {
      return "The configured Gemini model is unavailable, so this review used local heuristics. Scores are directional.";
    }
    if (error.status === 429) {
      return "Gemini's rate limit was reached, so this review used local heuristics. Scores are directional.";
    }
  }

  const message = error instanceof Error ? error.message : "";
  if (/timeout|aborted|timed out/i.test(message)) {
    return "Gemini took too long to respond, so this review used local heuristics. Scores are directional.";
  }

  return FALLBACK_NOTICE;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Send the resume and job description as form data.", code: "bad_content_type" },
        { status: 415 },
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "We couldn't read that upload. Try a smaller file or paste the text.", code: "bad_form_data" },
        { status: 400 },
      );
    }

    const jobDescriptionValue = formData.get("jobDescription");
    if (typeof jobDescriptionValue !== "string") {
      return NextResponse.json(
        { error: "Paste the job description before starting the review.", code: "missing_jd" },
        { status: 400 },
      );
    }
    const jobDescription = validateJobDescription(jobDescriptionValue);

    let resumeText = "";
    let fileName: string | null = null;
    const fileValue = formData.get("resume");

    if (fileValue instanceof File && fileValue.size > 0) {
      const extracted = await extractResumeFromFile(fileValue);
      resumeText = extracted.text;
      fileName = sanitizeFileName(extracted.fileName ?? fileValue.name ?? "resume");
    } else {
      const resumeTextValue = formData.get("resumeText");
      if (typeof resumeTextValue !== "string") {
        return NextResponse.json(
          { error: "Add your resume as a file or paste the text.", code: "missing_resume" },
          { status: 400 },
        );
      }
      resumeText = validateResumeText(resumeTextValue);
    }

    let analysis;
    let mode: ReviewMode;
    let notice: string | undefined;

    if (isGeminiConfigured()) {
      try {
        analysis = await analyzeWithGemini({ resumeText, jobDescription });
        mode = "gemini";
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown Gemini error";
        console.warn(`[analyze] Gemini failed, using local analysis: ${reason}`);
        analysis = analyzeLocally({ resumeText, jobDescription });
        mode = "local";
        notice = fallbackNotice(error);
      }
    } else {
      analysis = analyzeLocally({ resumeText, jobDescription });
      mode = "local";
      notice = LOCAL_NOTICE;
    }

    const review: ReviewRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      fileName,
      mode,
      notice,
      jobDescription: jobDescription.slice(0, 12_000),
      analysis,
    };

    return NextResponse.json(
      { review },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    if (error instanceof ResumeError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[analyze] Unhandled error: ${message}`);
    return NextResponse.json(
      {
        error: "We couldn't finish that review. Your inputs are still here — try again in a moment.",
        code: "analysis_failed",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

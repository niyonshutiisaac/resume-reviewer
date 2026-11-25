import {
  MAX_FILE_BYTES,
  MAX_JD_CHARS,
  MAX_RESUME_CHARS,
  MIN_JD_CHARS,
  MIN_RESUME_CHARS,
  SUPPORTED_EXTENSIONS,
} from "@/lib/constants";
import { formatFileSize } from "@/lib/format";

export type ResumeMode = "file" | "text";

export interface Draft {
  resumeMode: ResumeMode;
  file: File | null;
  resumeText: string;
  jobDescription: string;
}

export interface DraftErrors {
  resume?: string;
  jobDescription?: string;
}

export function emptyDraft(jobDescription = ""): Draft {
  return {
    resumeMode: "file",
    file: null,
    resumeText: "",
    jobDescription,
  };
}

export function validateFile(file: File): string | null {
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (!SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    return "Upload a PDF, DOCX, TXT, or MD file. For older .doc files, save as .docx first.";
  }
  if (file.size === 0) return "That file is empty. Try another copy.";
  if (file.size > MAX_FILE_BYTES) {
    return `That file is ${formatFileSize(file.size)}. Keep it under 4 MB, or paste the text.`;
  }
  return null;
}

export function validateDraft(draft: Draft): DraftErrors {
  const errors: DraftErrors = {};

  if (draft.resumeMode === "file") {
    if (!draft.file) {
      errors.resume = "Add your resume file to start the review.";
    } else {
      const fileError = validateFile(draft.file);
      if (fileError) errors.resume = fileError;
    }
  } else if (draft.resumeText.trim().length < MIN_RESUME_CHARS) {
    errors.resume =
      draft.resumeText.trim().length === 0
        ? "Paste your resume text to start the review."
        : "Add a little more resume text — at least a summary and some experience.";
  }

  if (draft.jobDescription.trim().length < MIN_JD_CHARS) {
    errors.jobDescription =
      draft.jobDescription.trim().length === 0
        ? "Paste the job description to start the review."
        : "Add a little more of the job description — at least a few sentences.";
  }

  return errors;
}

export function hasDraftContent(draft: Draft): boolean {
  return Boolean(
    draft.file ||
      draft.resumeText.trim() ||
      draft.jobDescription.trim(),
  );
}

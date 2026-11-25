import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";
import {
  MAX_FILE_BYTES,
  MAX_JD_CHARS,
  MAX_RESUME_CHARS,
  MIN_JD_CHARS,
  MIN_RESUME_CHARS,
  SUPPORTED_EXTENSIONS,
} from "@/lib/constants";

export class ResumeError extends Error {
  code: string;

  constructor(message: string, code = "invalid_input") {
    super(message);
    this.name = "ResumeError";
    this.code = code;
  }
}

export interface ExtractedResume {
  text: string;
  fileName: string | null;
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

export function normalizeExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validateJobDescription(value: string): string {
  const normalized = normalizeExtractedText(value);
  if (normalized.length < MIN_JD_CHARS) {
    throw new ResumeError(
      `Add a little more of the job description — at least ${MIN_JD_CHARS} characters.`,
      "jd_too_short",
    );
  }
  if (normalized.length > MAX_JD_CHARS) {
    throw new ResumeError("That job description is too long. Trim it to the role and requirements.", "jd_too_long");
  }
  return normalized;
}

export function validateResumeText(value: string): string {
  const normalized = normalizeExtractedText(value);
  if (normalized.length < MIN_RESUME_CHARS) {
    throw new ResumeError(
      "We need a little more resume text to review. Add your experience and skills, or upload a file.",
      "resume_too_short",
    );
  }
  if (normalized.length > MAX_RESUME_CHARS) {
    throw new ResumeError("That resume is too long. Keep it to your most relevant experience.", "resume_too_long");
  }
  return normalized;
}

export async function extractResumeFromFile(file: File): Promise<ExtractedResume> {
  const fileName = sanitizeFileName(file.name || "resume");
  const extension = fileName.toLowerCase().slice(fileName.lastIndexOf("."));

  if (!SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    throw new ResumeError(
      "Upload a PDF, DOCX, TXT, or MD file. For older .doc files, save as .docx first.",
      "unsupported_file",
    );
  }

  if (file.size === 0) {
    throw new ResumeError("That file is empty. Try another copy.", "empty_file");
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new ResumeError("That file is larger than 4 MB. Try a smaller PDF or paste the text.", "file_too_large");
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  let text = "";

  try {
    if (extension === ".pdf") {
      const pdf = await getDocumentProxy(buffer, { maxImageSize: 16_777_216 });
      if (pdf.numPages > 30) {
        throw new ResumeError("That PDF has too many pages. Keep it to your resume, under 30 pages.", "pdf_too_long");
      }
      const result = await extractText(pdf, { mergePages: true });
      text = Array.isArray(result.text) ? result.text.join("\n\n") : result.text;
    } else if (extension === ".docx") {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      text = result.value;
    } else {
      text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    }
  } catch (error) {
    if (error instanceof ResumeError) throw error;
    throw new ResumeError(
      "We couldn't read that file. It may be damaged or password-protected. Try another PDF, DOCX, or paste the text.",
      "extract_failed",
    );
  }

  const normalized = normalizeExtractedText(text);

  if (normalized.length < MIN_RESUME_CHARS) {
    throw new ResumeError(
      "We couldn't find enough text in that file. If it's a scanned PDF, paste the text instead.",
      "no_text",
    );
  }

  if (normalized.length > MAX_RESUME_CHARS) {
    throw new ResumeError("That resume is too long. Keep it to your most relevant experience.", "resume_too_long");
  }

  return { text: normalized, fileName };
}

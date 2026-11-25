"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  FileText,
  FileUp,
  Upload,
  X,
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/format";
import { MAX_RESUME_CHARS, MIN_RESUME_CHARS } from "@/lib/constants";
import { validateFile, type ResumeMode } from "@/lib/draft";

interface ResumeFieldProps {
  mode: ResumeMode;
  file: File | null;
  text: string;
  error?: string;
  onModeChange: (mode: ResumeMode) => void;
  onFileChange: (file: File | null) => void;
  onTextChange: (text: string) => void;
  onError: (message: string | undefined) => void;
}

export function ResumeField({
  mode,
  file,
  text,
  error,
  onModeChange,
  onFileChange,
  onTextChange,
  onError,
}: ResumeFieldProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(nextFile: File | undefined | null) {
    if (!nextFile) return;
    const fileError = validateFile(nextFile);
    if (fileError) {
      onError(fileError);
      return;
    }
    onError(undefined);
    onFileChange(nextFile);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.currentTarget.files?.[0];
    acceptFile(nextFile);
    event.currentTarget.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  const textCount = text.trim().length;
  const textReady = textCount >= MIN_RESUME_CHARS;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="segmented" role="group" aria-label="Resume input method">
          <button
            type="button"
            className="segmented-item"
            aria-pressed={mode === "file"}
            onClick={() => onModeChange("file")}
          >
            <FileUp size={13} strokeWidth={2} />
            Upload file
          </button>
          <button
            type="button"
            className="segmented-item"
            aria-pressed={mode === "text"}
            onClick={() => onModeChange("text")}
          >
            <FileText size={13} strokeWidth={2} />
            Paste text
          </button>
        </div>
        <span className="text-[10.5px] text-muted">PDF, DOCX, TXT · up to 4 MB</span>
      </div>

      {mode === "file" ? (
        file ? (
          <div>
            <div className="file-row">
              <span className="icon-tile icon-tile-brand">
                <FileText size={17} strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight">{file.name}</p>
                <div className="mt-1 flex items-center gap-2 text-[10.5px] text-muted">
                  <span className="tabular">{formatFileSize(file.size)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-success-ink">
                    <CheckCircle2 size={11} strokeWidth={2.2} />
                    Ready
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon-sm text-muted"
                onClick={() => onFileChange(null)}
                aria-label="Remove resume file"
              >
                <X size={16} strokeWidth={1.9} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10.5px] text-muted">
                We extract the text. The file is not stored.
              </span>
              <label
                htmlFor="resume-file-replace"
                className="link-quiet cursor-pointer text-[11px]"
              >
                Replace file
                <input
                  id="resume-file-replace"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>
        ) : (
          <label
            htmlFor="resume-file"
            className="dropzone"
            data-dragging={dragging}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              id="resume-file"
              type="file"
              className="sr-only"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleInputChange}
              aria-describedby="resume-file-help"
            />
            <span className="icon-tile icon-tile-brand icon-tile-lg">
              <Upload size={20} strokeWidth={1.8} />
            </span>
            <span className="mt-1 text-[13px] font-semibold text-ink">
              Drop your resume here
            </span>
            <span id="resume-file-help" className="text-[11px] text-muted">
              or choose a file from your computer
            </span>
            <span className="btn btn-secondary btn-sm mt-2" aria-hidden="true">
              Browse files
            </span>
          </label>
        )
      ) : (
        <div>
          <label htmlFor="resume-text" className="sr-only">
            Resume text
          </label>
          <textarea
            id="resume-text"
            className="textarea min-h-[210px]"
            value={text}
            maxLength={MAX_RESUME_CHARS}
            onChange={(event) => {
              onTextChange(event.target.value);
              if (error) onError(undefined);
            }}
            placeholder="Paste your resume text here — summary, experience, skills, and education."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "resume-text-error" : "resume-text-help"}
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span id="resume-text-help" className="field-help">
              Plain text is fine. Include the parts a recruiter would read.
            </span>
            <span
              className={cn(
                "tabular flex-none text-[10.5px] font-medium",
                textReady ? "text-success-ink" : "text-muted",
              )}
            >
              {textCount.toLocaleString()} / {MIN_RESUME_CHARS} min
            </span>
          </div>
        </div>
      )}

      {error ? (
        <p
          id="resume-text-error"
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[11.5px] font-medium leading-relaxed text-danger-ink"
        >
          <CircleAlert size={13} className="mt-0.5 flex-none" strokeWidth={2} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

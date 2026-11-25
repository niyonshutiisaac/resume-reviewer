"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  CircleAlert,
  Clock,
  Lock,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { ResumeField } from "@/components/new-review/resume-field";
import { WhatYouGet } from "@/components/new-review/what-you-get";
import { SampleCard } from "@/components/new-review/sample-card";
import { cn } from "@/lib/format";
import { MAX_JD_CHARS, MIN_JD_CHARS } from "@/lib/constants";
import {
  type Draft,
  type DraftErrors,
  validateDraft,
} from "@/lib/draft";

interface NewReviewProps {
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  onSubmit: () => void;
  onOpenSample: () => void;
  onLoadSampleInputs: () => void;
  error: string | null;
  onClearError: () => void;
}

export function NewReview({
  draft,
  onDraftChange,
  onSubmit,
  onOpenSample,
  onLoadSampleInputs,
  error,
  onClearError,
}: NewReviewProps) {
  const [errors, setErrors] = useState<DraftErrors>({});
  const errorBannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error) return;
    errorBannerRef.current?.focus();
  }, [error]);

  useEffect(() => {
    setErrors((current) => {
      if (!current.resume && !current.jobDescription) return current;
      const validation = validateDraft(draft);
      const next = { ...current };
      if (!validation.resume) delete next.resume;
      if (!validation.jobDescription) delete next.jobDescription;
      return Object.keys(next).length === Object.keys(current).length ? current : next;
    });
  }, [draft]);

  function updateDraft(patch: Partial<Draft>) {
    onDraftChange({ ...draft, ...patch });
    onClearError();
  }

  function clearFieldError(field: keyof DraftErrors) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sectionId = nextErrors.resume ? "resume-section" : "job-description";
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
      window.setTimeout(() => {
        const inputId = nextErrors.resume
          ? draft.resumeMode === "file"
            ? "resume-file"
            : "resume-text"
          : "job-description-input";
        document.getElementById(inputId)?.focus();
      }, 60);
      return;
    }

    onSubmit();
  }

  const jdCount = draft.jobDescription.trim().length;
  const jdReady = jdCount >= MIN_JD_CHARS;

  return (
    <div className="animate-fade-in">
      <header className="animate-fade-up">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          New review
        </div>
        <h1 className="mt-3 max-w-[780px] text-[32px] font-semibold leading-[1.06] tracking-[-0.038em] text-ink sm:text-[38px] md:text-[42px]">
          Make your resume earn the read.
        </h1>
        <p className="mt-3 max-w-[630px] text-[14px] leading-relaxed text-muted sm:text-[14.5px]">
          Paste a role, add your resume, and get a specific review in about a minute. No account,
          no generic advice.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="chip chip-outline">
            <Clock size={11} strokeWidth={2} />
            ~1 minute
          </span>
          <span className="chip chip-outline">
            <ShieldCheck size={11} strokeWidth={2} />
            ATS-aware
          </span>
          <span className="chip chip-outline">
            <Sparkles size={11} strokeWidth={2} />
            Evidence-based
          </span>
        </div>
      </header>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <form
          className="card overflow-hidden xl:col-span-7"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Start a review</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">Two inputs. One clear read.</p>
            </div>
            <span className="chip chip-brand-soft">
              <Lock size={10} strokeWidth={2.2} />
              Not stored
            </span>
          </div>

          <div className="space-y-6 px-5 py-5 md:px-6 md:py-6">
            {error ? (
              <div
                ref={errorBannerRef}
                tabIndex={-1}
                role="alert"
                className="notice-danger flex items-start gap-2.5 rounded-sm px-3.5 py-3 text-[12px] font-medium leading-relaxed"
              >
                <CircleAlert size={16} className="mt-0.5 flex-none" strokeWidth={2} />
                <span>{error}</span>
              </div>
            ) : null}

            <section id="resume-section" aria-labelledby="resume-label">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="step-number">01</span>
                  <h3 id="resume-label" className="text-[13px] font-semibold">
                    Your resume
                  </h3>
                </div>
                <span className="text-[10.5px] text-muted">Required</span>
              </div>

              <ResumeField
                mode={draft.resumeMode}
                file={draft.file}
                text={draft.resumeText}
                error={errors.resume}
                onModeChange={(resumeMode) => {
                  updateDraft({ resumeMode });
                  clearFieldError("resume");
                }}
                onFileChange={(file) => {
                  updateDraft({ file });
                  clearFieldError("resume");
                }}
                onTextChange={(resumeText) => {
                  updateDraft({ resumeText });
                  clearFieldError("resume");
                }}
                onError={(message) => {
                  setErrors((current) => ({ ...current, resume: message }));
                  if (!message) clearFieldError("resume");
                }}
              />
            </section>

            <div className="divider" />

            <section id="job-description" aria-labelledby="job-description-label">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="step-number">02</span>
                  <h3 id="job-description-label" className="text-[13px] font-semibold">
                    The job description
                  </h3>
                </div>
                <span className="text-[10.5px] text-muted">Required</span>
              </div>

              <label htmlFor="job-description-input" className="sr-only">
                Job description
              </label>
              <textarea
                id="job-description-input"
                className="textarea min-h-[190px]"
                value={draft.jobDescription}
                maxLength={MAX_JD_CHARS}
                onChange={(event) => {
                  updateDraft({ jobDescription: event.target.value });
                  clearFieldError("jobDescription");
                }}
                placeholder={
                  "Paste the role here.\n\nInclude responsibilities, requirements, and nice-to-haves — the details are what make the review specific."
                }
                aria-invalid={Boolean(errors.jobDescription)}
                aria-describedby={
                  errors.jobDescription ? "job-description-error" : "job-description-help"
                }
              />

              <div className="mt-1.5 flex items-center justify-between gap-3">
                <span id="job-description-help" className="field-help">
                  Include the responsibilities and requirements, not just the title.
                </span>
                <span
                  className={cn(
                    "tabular flex-none text-[10.5px] font-medium",
                    jdReady ? "text-success-ink" : "text-muted",
                  )}
                >
                  {jdCount.toLocaleString()} / {MIN_JD_CHARS} min
                </span>
              </div>

              {errors.jobDescription ? (
                <p
                  id="job-description-error"
                  role="alert"
                  className="mt-2 flex items-start gap-1.5 text-[11.5px] font-medium leading-relaxed text-danger-ink"
                >
                  <CircleAlert size={13} className="mt-0.5 flex-none" strokeWidth={2} />
                  {errors.jobDescription}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <button type="button" className="link-quiet" onClick={onLoadSampleInputs}>
                  <Wand2 size={13} strokeWidth={2} />
                  Try sample inputs
                </button>
                <span className="text-[10.5px] text-muted">Paste as much as you have.</span>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-3 border-t border-line bg-canvas/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="flex items-start gap-1.5 text-[10.5px] leading-relaxed text-muted">
              <Lock size={12} className="mt-0.5 flex-none" strokeWidth={2} />
              Your file is processed for this review and never stored on a server.
            </p>
            <button type="submit" className="btn btn-primary btn-lg w-full sm:w-auto">
              <Sparkles size={15} strokeWidth={2} />
              Review my resume
              <ArrowRight size={15} strokeWidth={2.2} />
            </button>
          </div>
        </form>

        <aside className="flex flex-col gap-5 xl:col-span-5">
          <WhatYouGet />
          <SampleCard onOpenSample={onOpenSample} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-[10.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Lock size={11} strokeWidth={2} />
              Private by default
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={11} strokeWidth={2} />
              No invented experience
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

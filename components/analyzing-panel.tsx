"use client";

import { useEffect, useState } from "react";
import {
  Check,
  FileText,
  Lightbulb,
  ListChecks,
  PenLine,
  ScanSearch,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/format";

const STEPS = [
  {
    title: "Reading your resume",
    icon: FileText,
    active: "Pulling out your roles, bullets, skills, and dates.",
    done: "Resume text extracted.",
  },
  {
    title: "Comparing it to the role",
    icon: ScanSearch,
    active: "Matching your evidence against the posting's requirements.",
    done: "Role requirements mapped.",
  },
  {
    title: "Checking ATS and keywords",
    icon: ShieldCheck,
    active: "Looking for the quiet reasons a resume gets filtered.",
    done: "ATS checks complete.",
  },
  {
    title: "Writing your feedback",
    icon: PenLine,
    active: "Turning the gaps into specific, honest edits.",
    done: "Feedback drafted.",
  },
] as const;

const TIPS = [
  {
    icon: ListChecks,
    title: "Use the full posting",
    body: "Requirements and nice-to-haves change what the review prioritises.",
  },
  {
    icon: ShieldCheck,
    title: "Keep it honest",
    body: "We suggest language, not invented experience. You decide what is true.",
  },
  {
    icon: PenLine,
    title: "Read the rewrites out loud",
    body: "If you can't defend a line in an interview, cut it.",
  },
] as const;

export function AnalyzingPanel({
  fileName,
  onCancel,
}: {
  fileName: string | null;
  onCancel: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setActiveStep(1), 800),
      window.setTimeout(() => setActiveStep(2), 1800),
      window.setTimeout(() => setActiveStep(3), 3000),
      window.setTimeout(() => setActiveStep(4), 4500),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const current = Math.min(activeStep, STEPS.length - 1);
  const finished = activeStep >= STEPS.length;

  return (
    <div className="animate-fade-in">
      <header className="flex flex-wrap items-start justify-between gap-4 animate-fade-up">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Review in progress
          </div>
          <h1 className="mt-3 text-[32px] font-semibold leading-[1.06] tracking-[-0.038em] text-ink sm:text-[38px] md:text-[42px]">
            One careful pass.
          </h1>
          <p className="mt-3 max-w-[620px] text-[14px] leading-relaxed text-muted sm:text-[14.5px]">
            We&apos;re reading your resume against the role, then turning the gaps into edits you
            can make today.
          </p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
          <X size={13} strokeWidth={2.2} />
          Cancel review
        </button>
      </header>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="card overflow-hidden xl:col-span-7">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <span className="relative grid size-9 place-items-center rounded-sm bg-brand-100 text-brand-700">
                <FileText size={17} strokeWidth={1.8} />
                <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full border-2 border-white bg-brand-600">
                  <span className="size-1.5 animate-pulse rounded-full bg-white" />
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight">Reading between the lines.</p>
                <p className="mt-0.5 max-w-[360px] truncate text-[10.5px] text-muted">
                  {fileName ? `Reading ${fileName}` : "Reading your pasted resume"}
                </p>
              </div>
            </div>
            <span className="chip chip-brand-soft flex-none">Working</span>
          </div>

          <div className="px-5 py-5 md:px-6 md:py-6">
            <div className="sr-only" role="status" aria-live="polite">
              {finished
                ? "Still finishing your review."
                : `Step ${current + 1} of ${STEPS.length}: ${STEPS[current].title}.`}
            </div>

            <ol>
              {STEPS.map((step, index) => {
                const state =
                  index < activeStep ? "done" : index === activeStep ? "active" : "pending";
                const Icon = step.icon;
                return (
                  <li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < STEPS.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px",
                          state === "done" ? "bg-brand-300" : "bg-line",
                        )}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-10 grid size-8 flex-none place-items-center rounded-full border transition-colors duration-300",
                        state === "done"
                          ? "border-brand-600 bg-brand-600 text-white"
                          : state === "active"
                            ? "border-brand-200 bg-brand-100 text-brand-700"
                            : "border-line bg-canvas text-muted",
                      )}
                    >
                      {state === "done" ? (
                        <Check size={14} strokeWidth={2.4} />
                      ) : state === "active" ? (
                        <span className="spinner size-3.5" aria-hidden="true" />
                      ) : (
                        <Icon size={14} strokeWidth={1.8} />
                      )}
                    </span>
                    <div className="min-w-0 pt-1">
                      <p
                        className={cn(
                          "text-[12.5px] font-semibold leading-tight",
                          state === "pending" ? "text-muted" : "text-ink",
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
                        {state === "active"
                          ? step.active
                          : state === "done"
                            ? step.done
                            : "Waiting."}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-2 rounded-sm border border-line bg-canvas/60 p-4" aria-hidden="true">
              <div className="flex items-center gap-3">
                <span className="skeleton size-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <span className="skeleton block h-2.5 w-36" />
                  <span className="skeleton block h-2 w-24" />
                </div>
                <span className="skeleton size-11 rounded-full" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <span className="skeleton block h-2 w-full" />
                <span className="skeleton block h-2 w-full" />
                <span className="skeleton block h-2 w-full" />
              </div>
              <div className="mt-4 space-y-2.5">
                <span className="skeleton block h-2 w-full" />
                <span className="skeleton block h-2 w-[92%]" />
                <span className="skeleton block h-2 w-[74%]" />
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 text-[10.5px] text-muted">
              <span className="spinner size-3 text-brand-500" aria-hidden="true" />
              This usually takes 10–20 seconds. Longer resumes take a little more time.
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-5 xl:col-span-5">
          <div className="card p-5 md:p-6">
            <div className="flex items-center gap-2.5">
              <span className="icon-tile icon-tile-warm icon-tile-sm">
                <Lightbulb size={14} strokeWidth={1.9} />
              </span>
              <div>
                <h2 className="text-[14px] font-semibold">While you wait</h2>
                <p className="mt-0.5 text-[10.5px] text-muted">Three things that improve any review.</p>
              </div>
            </div>
            <ul className="mt-5 space-y-4">
              {TIPS.map((tip) => {
                const Icon = tip.icon;
                return (
                  <li key={tip.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 flex-none place-items-center rounded-[6px] bg-canvas text-muted">
                      <Icon size={13} strokeWidth={1.9} />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold leading-tight">{tip.title}</p>
                      <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{tip.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hero-pattern bg-chrome rounded-md p-5 text-white shadow-hero">
            <div className="hero-content">
              <p className="text-[13px] font-semibold">A good review is specific.</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
                We compare exact language, not vibes. Every gap should point to a line you can add
                or a claim you can prove.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  RotateCcw,
} from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import { loadPlanProgress, savePlanProgress } from "@/lib/storage";
import type { ActionStep } from "@/lib/types";

export function ActionPlan({
  reviewId,
  steps,
}: {
  reviewId: string;
  steps: ActionStep[];
}) {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const stored = loadPlanProgress(reviewId).filter(
      (index) => index >= 0 && index < steps.length,
    );
    setCompleted(stored);
  }, [reviewId, steps.length]);

  function toggle(index: number) {
    setCompleted((current) => {
      const next = current.includes(index)
        ? current.filter((value) => value !== index)
        : [...current, index].sort((a, b) => a - b);
      savePlanProgress(reviewId, next);
      return next;
    });
  }

  function reset() {
    setCompleted([]);
    savePlanProgress(reviewId, []);
  }

  const percent = steps.length ? Math.round((completed.length / steps.length) * 100) : 0;
  const allDone = steps.length > 0 && completed.length === steps.length;

  return (
    <div className="card p-5 md:p-6">
      <CardHeader
        icon={ClipboardCheck}
        tone="brand"
        title="Your action plan"
        caption="Five edits, in order. Check them off as you go."
        action={
          <div className="flex items-center gap-2">
            <span className="tabular text-[10.5px] font-semibold text-muted">
              {completed.length}/{steps.length}
            </span>
            {completed.length > 0 ? (
              <button type="button" className="link-quiet text-[10px]" onClick={reset}>
                <RotateCcw size={11} strokeWidth={2} />
                Reset
              </button>
            ) : null}
          </div>
        }
      />

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-standard"
          style={{ width: `${percent}%` }}
        />
      </div>

      {steps.length > 0 ? (
        <ol className="mt-2 divide-y divide-line">
          {steps.map((step, index) => {
            const done = completed.includes(index);
            return (
              <li
                key={`${step.title}-${index}`}
                className="plan-row flex gap-3 py-3.5"
                data-done={done}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={done}
                  className="plan-checkbox"
                  onClick={() => toggle(index)}
                  aria-label={`Mark step ${index + 1} ${done ? "incomplete" : "complete"}: ${step.title}`}
                >
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="plan-title text-[12.5px] font-semibold leading-tight text-ink">
                      {step.title}
                    </p>
                    <span className="chip chip-neutral">
                      <Clock size={9} strokeWidth={2} />
                      {step.effort}
                    </span>
                  </div>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          No action steps were returned. Try the review again with a fuller job description.
        </p>
      )}

      {allDone ? (
        <div className="notice-success mt-4 flex items-start gap-2 rounded-sm p-3 text-[11px] leading-relaxed animate-fade-in">
          <CheckCircle2 size={14} className="mt-0.5 flex-none" strokeWidth={2.2} />
          <span>
            <span className="font-semibold">You&apos;re ready for the next application.</span>{" "}
            Download the report or run an updated version through Merit.
          </span>
        </div>
      ) : null}
    </div>
  );
}

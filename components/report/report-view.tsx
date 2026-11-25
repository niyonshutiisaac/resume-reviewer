"use client";

import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Info,
  Printer,
  Sparkles,
} from "lucide-react";
import { ReportHero } from "@/components/report/report-hero";
import { ReportNav, type ReportNavSection } from "@/components/report/report-nav";
import { ScoreBreakdown } from "@/components/report/score-breakdown";
import { AtsCard } from "@/components/report/ats-card";
import { PriorityStrip } from "@/components/report/priority-strip";
import { KeywordSection } from "@/components/report/keyword-section";
import { MissingSkillsCard } from "@/components/report/missing-skills-card";
import { RewriteSection } from "@/components/report/rewrite-section";
import { StrengthsCard } from "@/components/report/strengths-card";
import { SectionFeedback } from "@/components/report/section-feedback";
import { ActionPlan } from "@/components/report/action-plan";
import { ReportFooter } from "@/components/report/report-footer";
import { formatDate } from "@/lib/format";
import { scrollToId } from "@/lib/scroll";
import type { ReviewRecord } from "@/lib/types";

interface ReportViewProps {
  review: ReviewRecord;
  onNewReview: () => void;
  onReviewUpdatedResume: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onOpenHowItWorks: () => void;
}

export function ReportView({
  review,
  onNewReview,
  onReviewUpdatedResume,
  onDownload,
  onPrint,
  onOpenHowItWorks,
}: ReportViewProps) {
  const { analysis } = review;
  const isSample = review.mode === "sample";
  const roleLine =
    [analysis.targetRole, analysis.company].filter(Boolean).join(" · ") || "your target role";

  const navSections = useMemo<ReportNavSection[]>(
    () => [
      { id: "summary", label: "Overview" },
      { id: "keywords", label: "Keywords", count: analysis.keywords.length },
      { id: "rewrites", label: "Rewrites", count: analysis.bulletRewrites.length },
      { id: "feedback", label: "Feedback" },
      { id: "plan", label: "Plan", count: analysis.actionPlan.length },
    ],
    [
      analysis.keywords.length,
      analysis.bulletRewrites.length,
      analysis.actionPlan.length,
    ],
  );

  const modeChip = isSample ? (
    <span className="chip chip-brand">
      <Sparkles size={10} strokeWidth={2.2} />
      Sample report
    </span>
  ) : review.mode === "gemini" ? (
    <span className="chip chip-brand-soft">
      <Sparkles size={10} strokeWidth={2.2} />
      AI review
    </span>
  ) : (
    <span className="chip chip-warm">
      <Info size={10} strokeWidth={2.2} />
      Local analysis
    </span>
  );

  const notice = isSample ? (
    <div className="notice-brand mt-5 flex flex-col gap-2.5 rounded-sm px-3.5 py-3 text-[11px] leading-relaxed sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex min-w-0 items-start gap-2.5 sm:flex-1">
        <Sparkles size={13} className="mt-0.5 flex-none text-brand-600" strokeWidth={2} />
        <span className="min-w-0">
          <span className="font-semibold">This is a sample report for a fictional candidate.</span>{" "}
          The numbers and rewrites are illustrative. Run your own resume to get a review grounded
          in your experience.
        </span>
      </div>
      <button
        type="button"
        className="link-action w-full justify-between sm:ml-auto sm:w-auto"
        onClick={onNewReview}
      >
        Review my resume
        <ArrowRight size={12} strokeWidth={2.2} />
      </button>
    </div>
  ) : review.mode === "local" ? (
    <div className="notice-warm mt-5 flex items-start gap-2.5 rounded-sm px-3.5 py-3 text-[11px] leading-relaxed">
      <Info size={13} className="mt-0.5 flex-none" strokeWidth={2} />
      <span>
        {review.notice ??
          "This review used local heuristics rather than an AI model. Scores are directional."}
      </span>
    </div>
  ) : null;

  return (
    <div className="print-full animate-fade-in">
      <header className="animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="link-quiet" onClick={onNewReview}>
            <ArrowLeft size={13} strokeWidth={2} />
            New review
          </button>
          <div className="flex flex-wrap items-center gap-2">
            {modeChip}
            <span className="text-[10.5px] text-muted">
              Reviewed {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Review report
            </div>
            <h1 className="mt-2 max-w-[720px] text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[36px]">
              {isSample ? "See what a review looks like." : "Your review is ready."}
            </h1>
            <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-muted">
              {isSample
                ? "A full report for a fictional candidate. Explore the structure, then run your own."
                : `A clear read on ${roleLine}, with the edits that move the needle first.`}
            </p>
          </div>

          <div className="report-actions ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-icon-sm sm:w-auto sm:px-3"
              onClick={onPrint}
              aria-label="Print report"
            >
              <Printer size={14} strokeWidth={1.9} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onDownload}>
              <Download size={14} strokeWidth={1.9} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </header>

      {notice}

      <div id="summary" className="mt-5 scroll-mt-32">
        <ReportHero review={review} />
      </div>

      <ReportNav sections={navSections} />

      <div className="mt-5 space-y-5">
        <div className="grid gap-5 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <ScoreBreakdown
              verdict={analysis.verdict}
              scores={analysis.scoreBreakdown}
              onOpenHowItWorks={onOpenHowItWorks}
            />
          </div>
          <div className="xl:col-span-5">
            <AtsCard checks={analysis.atsChecks} />
          </div>
        </div>

        <PriorityStrip
          steps={analysis.actionPlan}
          onSeePlan={() => scrollToId("plan")}
        />

        <section id="keywords" className="scroll-mt-32">
          <div className="grid gap-5 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <KeywordSection keywords={analysis.keywords} />
            </div>
            <div className="xl:col-span-5">
              <MissingSkillsCard skills={analysis.missingSkills} />
            </div>
          </div>
        </section>

        <section id="rewrites" className="scroll-mt-32">
          <RewriteSection rewrites={analysis.bulletRewrites} />
        </section>

        <section id="feedback" className="scroll-mt-32">
          <div className="grid gap-5 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <StrengthsCard strengths={analysis.strengths} />
            </div>
            <div className="xl:col-span-7">
              <SectionFeedback sections={analysis.sectionFeedback} />
            </div>
          </div>
        </section>

        <section id="plan" className="scroll-mt-32">
          <ActionPlan reviewId={review.id} steps={analysis.actionPlan} />
        </section>

        <ReportFooter
          isSample={isSample}
          onNewReview={onNewReview}
          onReviewUpdatedResume={onReviewUpdatedResume}
          onDownload={onDownload}
        />
      </div>
    </div>
  );
}

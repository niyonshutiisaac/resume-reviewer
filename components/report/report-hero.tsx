import { cn, formatDate, initials } from "@/lib/format";
import {
  atsCounts,
  keywordCounts,
  matchLabel,
  type ReviewRecord,
} from "@/lib/types";
import { ScoreRing } from "@/components/ui/score-ring";

export function ReportHero({ review }: { review: ReviewRecord }) {
  const { analysis } = review;
  const keywords = keywordCounts(analysis.keywords);
  const ats = atsCounts(analysis.atsChecks);
  const label = matchLabel(analysis.overallScore);
  const roleLine =
    [analysis.targetRole, analysis.company].filter(Boolean).join(" · ") || "Role not specified";

  const dotTone =
    label.tone === "strong"
      ? "bg-success"
      : label.tone === "weak"
        ? "bg-danger"
        : "bg-warm";

  return (
    <div className="hero-pattern bg-chrome relative overflow-hidden rounded-lg p-5 text-white shadow-hero md:p-7">
      <div className="hero-content">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-12 flex-none place-items-center rounded-full border border-white/25 bg-white/10 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] md:size-14 md:text-[17px]">
              {initials(analysis.candidateName)}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-white/50">
                Prepared for
              </p>
              <h2 className="mt-1 truncate text-[21px] font-semibold leading-tight tracking-[-0.025em] md:text-[25px]">
                {analysis.candidateName}
              </h2>
              <p className="mt-1 text-[11.5px] leading-relaxed text-white/75">{roleLine}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-white/80">
                  <span className={cn("size-1.5 rounded-full", dotTone)} aria-hidden="true" />
                  {label.label}
                </span>
                <span className="hidden text-white/25 sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="text-[10px] text-white/55">
                  Reviewed {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <ScoreRing score={analysis.overallScore} size={82} stroke={5} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 sm:gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
              Keywords
            </p>
            <p className="tabular mt-1.5 text-[16px] font-semibold leading-none text-white">
              {keywords.matched}/{keywords.total}
            </p>
            <p className="mt-1 truncate text-[9px] text-white/50">
              {keywords.partial} partial
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
              ATS checks
            </p>
            <p className="tabular mt-1.5 text-[16px] font-semibold leading-none text-white">
              {ats.passed}/{ats.total}
            </p>
            <p className="mt-1 truncate text-[9px] text-white/50">
              {ats.warnings > 0
                ? `${ats.warnings} warning${ats.warnings === 1 ? "" : "s"}`
                : "All checks passed"}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
              Must-have gaps
            </p>
            <p className="tabular mt-1.5 text-[16px] font-semibold leading-none text-white">
              {keywords.mustHaveGaps === 0 ? "None" : keywords.mustHaveGaps}
            </p>
            <p className="mt-1 truncate text-[9px] text-white/50">
              {keywords.mustHaveGaps > 0
                ? "Close before applying"
                : keywords.mustHavePartial > 0
                  ? `${keywords.mustHavePartial} partial`
                  : "Strong coverage"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

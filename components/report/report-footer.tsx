import { ArrowRight, Download, Sparkles } from "lucide-react";

export function ReportFooter({
  isSample,
  onNewReview,
  onReviewUpdatedResume,
  onDownload,
}: {
  isSample: boolean;
  onNewReview: () => void;
  onReviewUpdatedResume: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="report-footer-cta hero-pattern bg-chrome relative overflow-hidden rounded-md p-5 text-white shadow-hero md:p-6">
      <div className="hero-content flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 flex-none place-items-center rounded-sm border border-white/15 bg-white/10">
            <Sparkles size={17} strokeWidth={1.9} />
          </span>
          <div>
            <p className="text-[15px] font-semibold leading-tight tracking-[-0.01em]">
              {isSample ? "Want this for your resume?" : "Ready to apply with a stronger resume?"}
            </p>
            <p className="mt-1 max-w-[480px] text-[11px] leading-relaxed text-white/70">
              {isSample
                ? "Run your own resume through the same review. No account needed."
                : "Make the edits, then run an updated version through Merit before you send it."}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:flex-none">
          <button
            type="button"
            className="btn btn-sm border border-white/15 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
            onClick={onDownload}
          >
            <Download size={13} strokeWidth={2} />
            {isSample ? "Download sample" : "Download report"}
          </button>
          <button
            type="button"
            className="btn btn-lavender btn-sm"
            onClick={isSample ? onNewReview : onReviewUpdatedResume}
          >
            {isSample ? "Review my resume" : "Review updated resume"}
            <ArrowRight size={13} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Clock,
  FileText,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { cn, formatRelativeDate } from "@/lib/format";
import type { ReviewRecord } from "@/lib/types";

interface HistoryDialogProps {
  open: boolean;
  reviews: ReviewRecord[];
  currentReviewId: string | null;
  onClose: () => void;
  onOpenReview: (review: ReviewRecord) => void;
  onDeleteReview: (id: string) => void;
  onNewReview: () => void;
}

const MODE_LABEL: Record<ReviewRecord["mode"], string> = {
  gemini: "AI review",
  local: "Local analysis",
  sample: "Sample",
};

export function HistoryDialog({
  open,
  reviews,
  currentReviewId,
  onClose,
  onOpenReview,
  onDeleteReview,
  onNewReview,
}: HistoryDialogProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <Modal
      open={open}
      onClose={() => {
        setConfirmingId(null);
        onClose();
      }}
      title="Review history"
      description="Saved in this browser. Up to 12 reviews, newest first."
      width={640}
      footer={
        <>
          <span className="mr-auto text-[10.5px] text-muted">
            {reviews.length} of 12 saved
          </span>
          <button type="button" className="btn btn-primary btn-sm" onClick={onNewReview}>
            <Plus size={13} strokeWidth={2.2} />
            New review
          </button>
        </>
      }
    >
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center rounded-sm border border-dashed border-brand-200 bg-brand-50/40 px-6 py-10 text-center">
          <span className="icon-tile icon-tile-brand icon-tile-lg">
            <Clock size={20} strokeWidth={1.8} />
          </span>
          <p className="mt-3 text-[14px] font-semibold">No saved reviews yet.</p>
          <p className="mt-1 max-w-[300px] text-[11.5px] leading-relaxed text-muted">
            Your reports stay in this browser. Run a review and it will appear here.
          </p>
          <button type="button" className="btn btn-primary btn-sm mt-4" onClick={onNewReview}>
            <Sparkles size={13} strokeWidth={2} />
            Start a review
          </button>
        </div>
      ) : (
        <ul className="-mx-2 divide-y divide-line">
          {reviews.map((review) => {
            const isCurrent = review.id === currentReviewId;
            const isConfirming = confirmingId === review.id;
            return (
              <li key={review.id} className="px-2 py-3">
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-3 rounded-sm p-2 text-left transition-colors duration-150",
                      isCurrent ? "bg-brand-50" : "hover:bg-canvas",
                    )}
                    onClick={() => onOpenReview(review)}
                    aria-current={isCurrent ? "true" : undefined}
                  >
                    <span
                      className={cn(
                        "tabular grid size-9 flex-none place-items-center rounded-full border text-[11px] font-semibold",
                        isCurrent
                          ? "border-brand-300 bg-white text-brand-700"
                          : "border-line bg-canvas text-muted",
                      )}
                    >
                      {review.analysis.overallScore}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[12.5px] font-semibold leading-tight">
                          {review.analysis.targetRole || "Resume review"}
                        </span>
                        {isCurrent ? (
                          <span className="chip chip-brand text-[9px]">Open</span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-[10.5px] text-muted">
                        {[review.analysis.company, review.analysis.candidateName]
                          .filter(Boolean)
                          .join(" · ") || "Candidate not named"}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="chip chip-outline text-[9.5px]">
                          {MODE_LABEL[review.mode]}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9.5px] text-muted">
                          <Clock size={10} strokeWidth={2} />
                          {formatRelativeDate(review.createdAt)}
                        </span>
                        {review.fileName ? (
                          <span className="inline-flex min-w-0 items-center gap-1 text-[9.5px] text-muted">
                            <FileText size={10} strokeWidth={2} className="flex-none" />
                            <span className="max-w-[180px] truncate">{review.fileName}</span>
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>

                  {isConfirming ? (
                    <div className="flex flex-none flex-col items-end gap-1.5 pt-1">
                      <span className="text-[9.5px] font-medium text-danger-ink">
                        Delete this review?
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="btn btn-danger-ghost btn-sm"
                          onClick={() => {
                            onDeleteReview(review.id);
                            setConfirmingId(null);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setConfirmingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon-sm mt-1 flex-none text-muted hover:text-danger-ink"
                      onClick={() => setConfirmingId(review.id)}
                      aria-label={`Delete review for ${review.analysis.targetRole || "resume"}`}
                    >
                      <Trash2 size={15} strokeWidth={1.8} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
        <Clock size={11} className="mt-0.5 flex-none" strokeWidth={2} />
        Reviews are saved on this device. Clearing your browser data removes them.
      </p>
    </Modal>
  );
}

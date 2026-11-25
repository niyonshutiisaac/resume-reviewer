"use client";

import {
  ArrowRight,
  CircleHelp,
  Clock,
  Lock,
  Sparkles,
  X,
} from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/format";
import type { ReviewRecord } from "@/lib/types";

type View = "form" | "analyzing" | "report";

interface SidebarProps {
  reviews: ReviewRecord[];
  currentReviewId: string | null;
  view: View;
  onNewReview: () => void;
  onOpenHistory: () => void;
  onOpenHowItWorks: () => void;
  onOpenReview: (review: ReviewRecord) => void;
  onOpenSample: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar(props: SidebarProps) {
  if (props.mobile) {
    return (
      <div className="h-full bg-surface">
        <SidebarContent {...props} />
      </div>
    );
  }

  return (
    <aside className="app-sidebar sticky top-16 hidden h-[calc(100vh-4rem)] w-[236px] shrink-0 overflow-hidden rounded-tr-[20px] border-r border-line bg-surface lg:block">
      <SidebarContent {...props} />
    </aside>
  );
}

function SidebarContent({
  reviews,
  currentReviewId,
  view,
  onNewReview,
  onOpenHistory,
  onOpenHowItWorks,
  onOpenReview,
  onOpenSample,
  mobile,
  onClose,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-1 pt-5">
        <span className="eyebrow">Workspace</span>
        {mobile ? (
          <button
            type="button"
            className="btn btn-ghost btn-icon-sm -mr-1 text-muted"
            onClick={onClose}
            aria-label="Close workspace menu"
            autoFocus
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        ) : null}
      </div>

      <nav className="mt-2 space-y-0.5 px-3" aria-label="Workspace">
        <button
          type="button"
          className="nav-item"
          onClick={onNewReview}
          aria-current={view !== "report" ? "page" : undefined}
        >
          <Sparkles size={16} strokeWidth={1.9} />
          New review
        </button>
        <button type="button" className="nav-item" onClick={onOpenHistory}>
          <Clock size={16} strokeWidth={1.9} />
          Review history
          <span className="nav-count">{reviews.length}</span>
        </button>
        <button type="button" className="nav-item" onClick={onOpenHowItWorks}>
          <CircleHelp size={16} strokeWidth={1.9} />
          How it works
        </button>
      </nav>

      <div className="mt-5 flex items-center justify-between px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Recent
        </span>
        {reviews.length > 0 ? (
          <button type="button" className="link-quiet text-[10.5px]" onClick={onOpenHistory}>
            View all
          </button>
        ) : null}
      </div>

      <div className="mt-2 px-3">
        {reviews.length === 0 ? (
          <div className="rounded-sm border border-dashed border-brand-200 bg-brand-50/50 p-3">
            <p className="text-[11.5px] font-semibold text-ink">No saved reviews yet.</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
              Reports stay in this browser.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {reviews.slice(0, 3).map((review) => {
              const isActive = review.id === currentReviewId;
              return (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => onOpenReview(review)}
                  className={cn(
                    "group flex min-h-11 w-full items-center gap-2.5 rounded-sm px-2 py-2 text-left transition-colors duration-150",
                    isActive ? "bg-brand-50" : "hover:bg-canvas",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "tabular grid size-7 flex-none place-items-center rounded-full border text-[10px] font-semibold",
                      isActive
                        ? "border-brand-300 bg-white text-brand-700"
                        : "border-line bg-canvas text-muted",
                    )}
                  >
                    {review.analysis.overallScore}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-semibold leading-tight text-ink">
                      {review.analysis.targetRole || "Resume review"}
                    </span>
                    <span className="mt-0.5 block truncate text-[9.5px] text-muted">
                      {review.analysis.company ||
                        review.fileName ||
                        formatRelativeDate(review.createdAt)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-auto px-3 pb-4 pt-5">
        <div className="hero-pattern bg-chrome rounded-md p-4 text-white shadow-card">
          <div className="hero-content">
            <div className="flex items-center justify-between">
              <span className="chip chip-on-dark min-h-[20px] px-2 text-[9.5px]">Sample report</span>
              <Sparkles size={14} className="text-warm" aria-hidden="true" />
            </div>
            <p className="mt-3 text-[13px] font-semibold leading-snug">
              See a review before you share yours.
            </p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-white/70">
              Keywords, rewrites, ATS checks. No upload.
            </p>
            <button
              type="button"
              className="btn btn-lavender btn-sm btn-block mt-3 h-8 text-[11px]"
              onClick={onOpenSample}
            >
              Open sample
              <ArrowRight size={12} strokeWidth={2.2} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-[10px] text-muted">
          <Lock size={11} strokeWidth={2} />
          Saved on this device
        </div>
      </div>
    </div>
  );
}

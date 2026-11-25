"use client";

import { CircleHelp, Lock, Menu, Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";

type View = "form" | "analyzing" | "report";

interface TopBarProps {
  view: View;
  onOpenMenu: () => void;
  onNewReview: () => void;
  onOpenHowItWorks: () => void;
}

const VIEW_LABELS: Record<View, string> = {
  form: "New review",
  analyzing: "Review in progress",
  report: "Review report",
};

export function TopBar({ view, onOpenMenu, onNewReview, onOpenHowItWorks }: TopBarProps) {
  return (
    <header className="app-topbar sticky top-0 z-40 h-16 bg-topbar text-white">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-2 px-3 md:px-6">
        <button
          type="button"
          className="btn btn-ghost btn-icon text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-white/70 lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open workspace menu"
        >
          <Menu size={19} strokeWidth={1.9} />
        </button>

        <button
          type="button"
          onClick={onNewReview}
          className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-white/70"
          aria-label="Merit home — start a new review"
        >
          <Logo />
        </button>

        <span className="mx-2 hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
        <span className="hidden text-[11px] font-medium text-white/60 sm:block" aria-live="polite">
          {VIEW_LABELS[view]}
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10.5px] font-medium text-white/75 md:inline-flex">
            <Lock size={11} strokeWidth={2} />
            Private by default
          </span>

          <button
            type="button"
            className="btn btn-ghost btn-icon-sm text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-white/70"
            onClick={onOpenHowItWorks}
            aria-label="How Merit works"
          >
            <CircleHelp size={18} strokeWidth={1.8} />
          </button>

          {view === "report" ? (
            <button
              type="button"
              className="btn btn-on-dark btn-sm ml-1 w-11 px-0 focus-visible:outline-white/70 sm:w-auto sm:px-3"
              onClick={onNewReview}
              aria-label="Start a new review"
            >
              <Plus size={14} strokeWidth={2.2} />
              <span className="hidden sm:inline">New review</span>
            </button>
          ) : null}

          {view === "analyzing" ? (
            <span className="ml-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80">
              <span className="spinner size-3.5" aria-hidden="true" />
              Reviewing
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}

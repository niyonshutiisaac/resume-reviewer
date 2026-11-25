"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Sidebar } from "@/components/sidebar";
import { NewReview } from "@/components/new-review/new-review";
import { AnalyzingPanel } from "@/components/analyzing-panel";
import { ReportView } from "@/components/report/report-view";
import { HistoryDialog } from "@/components/dialogs/history-dialog";
import { HowItWorksDialog } from "@/components/dialogs/how-it-works-dialog";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME, SAMPLE_REVIEW } from "@/lib/sample";
import { emptyDraft, type Draft, validateDraft } from "@/lib/draft";
import { deleteReview, loadReviews, saveReview, setActiveReviewId } from "@/lib/storage";
import { reviewFileName, reviewToMarkdown } from "@/lib/markdown";
import type { ReviewRecord } from "@/lib/types";

type View = "form" | "analyzing" | "report";

const MIN_ANALYSIS_MS = 1100;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AppShell() {
  const [view, setView] = useState<View>("form");
  const [draft, setDraft] = useState<Draft>(() => emptyDraft());
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [currentReview, setCurrentReview] = useState<ReviewRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const mobileDrawerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setReviews(loadReviews());
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3400);
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [toast]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const drawer = mobileDrawerRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileNavOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => element.offsetParent !== null,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!drawer.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileNavOpen]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const startNewReview = useCallback(
    (prefillJobDescription = "") => {
      abortRef.current?.abort();
      abortRef.current = null;
      setCurrentReview(null);
      setDraft(emptyDraft(prefillJobDescription));
      setError(null);
      setView("form");
      setActiveReviewId(null);
      setMobileNavOpen(false);
      setHistoryOpen(false);
      scrollToTop();
    },
    [scrollToTop],
  );

  const openSample = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setCurrentReview(SAMPLE_REVIEW);
    setError(null);
    setView("report");
    setActiveReviewId(null);
    setMobileNavOpen(false);
    scrollToTop();
  }, [scrollToTop]);

  const openReview = useCallback(
    (review: ReviewRecord) => {
      abortRef.current?.abort();
      abortRef.current = null;
      setCurrentReview(review);
      setError(null);
      setView("report");
      setActiveReviewId(review.id);
      setHistoryOpen(false);
      setMobileNavOpen(false);
      scrollToTop();
    },
    [scrollToTop],
  );

  const loadSampleInputs = useCallback(() => {
    setDraft({
      resumeMode: "text",
      file: null,
      resumeText: SAMPLE_RESUME,
      jobDescription: SAMPLE_JOB_DESCRIPTION,
    });
    setError(null);
    setView("form");
    scrollToTop();
  }, [scrollToTop]);

  const analyze = useCallback(async () => {
    const errors = validateDraft(draft);
    if (Object.keys(errors).length > 0) {
      setError("Check the highlighted fields and try again.");
      return;
    }

    const formData = new FormData();
    if (draft.resumeMode === "file" && draft.file) {
      formData.append("resume", draft.file, draft.file.name);
    } else {
      formData.append("resumeText", draft.resumeText);
    }
    formData.append("jobDescription", draft.jobDescription);

    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);
    setView("analyzing");
    scrollToTop();
    const startedAt = Date.now();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => null)) as
        | { review?: ReviewRecord; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "We couldn't finish that review. Try again in a moment.");
      }
      if (!payload?.review) {
        throw new Error("The review came back empty. Try again in a moment.");
      }

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_ANALYSIS_MS) await wait(MIN_ANALYSIS_MS - elapsed);
      if (controller.signal.aborted) return;

      const review = payload.review;
      setCurrentReview(review);
      setReviews(saveReview(review));
      setActiveReviewId(review.id);
      setDraft(emptyDraft());
      setView("report");
      scrollToTop();
    } catch (caught) {
      if (controller.signal.aborted || (caught instanceof DOMException && caught.name === "AbortError")) {
        setView("form");
        return;
      }
      setView("form");
      setError(
        caught instanceof Error
          ? caught.message
          : "We couldn't finish that review. Your inputs are still here.",
      );
      scrollToTop();
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, [draft, scrollToTop]);

  const cancelAnalysis = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setView("form");
    setError(null);
    scrollToTop();
  }, [scrollToTop]);

  const removeReview = useCallback(
    (id: string) => {
      const next = deleteReview(id);
      setReviews(next);
      if (currentReview?.id === id) {
        setCurrentReview(null);
        setView("form");
        setError(null);
        scrollToTop();
      }
    },
    [currentReview?.id, scrollToTop],
  );

  const downloadReview = useCallback(
    (review: ReviewRecord) => {
      const markdown = reviewToMarkdown(review);
      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = reviewFileName(review);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setToast("Report downloaded");
    },
    [],
  );

  const reviewUpdatedResume = useCallback(() => {
    const jobDescription = currentReview?.jobDescription ?? "";
    startNewReview(jobDescription);
  }, [currentReview?.jobDescription, startNewReview]);

  return (
    <div className="min-h-screen bg-canvas">
      <TopBar
        view={view}
        onOpenMenu={() => setMobileNavOpen(true)}
        onNewReview={() => startNewReview()}
        onOpenHowItWorks={() => setHowOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-[1440px]">
        <Sidebar
          reviews={reviews}
          currentReviewId={currentReview?.id ?? null}
          view={view}
          onNewReview={() => startNewReview()}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenHowItWorks={() => setHowOpen(true)}
          onOpenReview={openReview}
          onOpenSample={openSample}
        />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-7 md:py-8">
          <div className="mx-auto w-full max-w-[1200px]">
            {view === "form" ? (
              <NewReview
                draft={draft}
                onDraftChange={setDraft}
                onSubmit={analyze}
                onOpenSample={openSample}
                onLoadSampleInputs={loadSampleInputs}
                error={error}
                onClearError={() => setError(null)}
              />
            ) : null}

            {view === "analyzing" ? (
              <AnalyzingPanel
                fileName={draft.resumeMode === "file" ? draft.file?.name ?? null : null}
                onCancel={cancelAnalysis}
              />
            ) : null}

            {view === "report" && currentReview ? (
              <ReportView
                review={currentReview}
                onNewReview={() => startNewReview()}
                onReviewUpdatedResume={reviewUpdatedResume}
                onDownload={() => downloadReview(currentReview)}
                onPrint={() => window.print()}
                onOpenHowItWorks={() => setHowOpen(true)}
              />
            ) : null}
          </div>
        </main>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 animate-fade-in bg-brand-900/45 backdrop-blur-[2px]"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close workspace menu"
          />
          <aside
            ref={mobileDrawerRef}
            className="absolute inset-y-0 left-0 w-[290px] animate-slide-in-left bg-surface shadow-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Workspace menu"
          >
            <Sidebar
              mobile
              reviews={reviews}
              currentReviewId={currentReview?.id ?? null}
              view={view}
              onNewReview={() => startNewReview()}
              onOpenHistory={() => {
                setMobileNavOpen(false);
                setHistoryOpen(true);
              }}
              onOpenHowItWorks={() => {
                setMobileNavOpen(false);
                setHowOpen(true);
              }}
              onOpenReview={openReview}
              onOpenSample={openSample}
              onClose={() => setMobileNavOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <HistoryDialog
        open={historyOpen}
        reviews={reviews}
        currentReviewId={currentReview?.id ?? null}
        onClose={() => setHistoryOpen(false)}
        onOpenReview={openReview}
        onDeleteReview={removeReview}
        onNewReview={() => startNewReview()}
      />

      <HowItWorksDialog
        open={howOpen}
        onClose={() => setHowOpen(false)}
        onOpenSample={() => {
          setHowOpen(false);
          openSample();
        }}
        onStartReview={() => {
          setHowOpen(false);
          startNewReview();
        }}
      />

      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end"
        role="status"
        aria-live="polite"
      >
        {toast ? (
          <div className="pointer-events-auto flex animate-fade-up items-center gap-3 rounded-sm border border-white/10 bg-brand-900 px-4 py-3 text-[12.5px] font-medium text-white shadow-menu">
            <CheckCircle2 size={16} className="text-success" />
            {toast}
          </div>
        ) : null}
      </div>
    </div>
  );
}



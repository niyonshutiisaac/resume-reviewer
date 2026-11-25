import type { ReviewRecord } from "@/lib/types";
import { MAX_REVIEWS } from "@/lib/constants";

const REVIEWS_KEY = "merit.reviews.v1";
const ACTIVE_KEY = "merit.active.v1";
const PLAN_PREFIX = "merit.plan.v1.";

function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isReviewRecord(value: unknown): value is ReviewRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ReviewRecord>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.mode === "string" &&
    Boolean(candidate.analysis) &&
    typeof candidate.analysis === "object" &&
    typeof candidate.analysis.overallScore === "number" &&
    Array.isArray(candidate.analysis.keywords)
  );
}

export function loadReviews(): ReviewRecord[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(REVIEWS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isReviewRecord).slice(0, MAX_REVIEWS);
  } catch {
    return [];
  }
}

export function saveReview(review: ReviewRecord): ReviewRecord[] {
  if (!hasStorage()) return [review];
  try {
    const current = loadReviews().filter((entry) => entry.id !== review.id);
    const next = [review, ...current].slice(0, MAX_REVIEWS);
    window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [review];
  }
}

export function deleteReview(id: string): ReviewRecord[] {
  if (!hasStorage()) return [];
  try {
    const next = loadReviews().filter((entry) => entry.id !== id);
    window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
    if (getActiveReviewId() === id) setActiveReviewId(null);
    return next;
  } catch {
    return loadReviews();
  }
}

export function setActiveReviewId(id: string | null): void {
  if (!hasStorage()) return;
  try {
    if (id) window.localStorage.setItem(ACTIVE_KEY, id);
    else window.localStorage.removeItem(ACTIVE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function getActiveReviewId(): string | null {
  if (!hasStorage()) return null;
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function loadPlanProgress(reviewId: string): number[] {
  if (!hasStorage() || reviewId === "sample") return [];
  try {
    const raw = window.localStorage.getItem(`${PLAN_PREFIX}${reviewId}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => Number.isInteger(value) && value >= 0);
  } catch {
    return [];
  }
}

export function savePlanProgress(reviewId: string, completed: number[]): void {
  if (!hasStorage() || reviewId === "sample") return;
  try {
    window.localStorage.setItem(`${PLAN_PREFIX}${reviewId}`, JSON.stringify(completed));
  } catch {
    // Ignore storage failures.
  }
}

export function clearAllReviews(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(REVIEWS_KEY);
    window.localStorage.removeItem(ACTIVE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

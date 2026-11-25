export const KEYWORD_STATUSES = ["matched", "partial", "missing"] as const;
export type KeywordStatus = (typeof KEYWORD_STATUSES)[number];

export const IMPORTANCE_LEVELS = ["must-have", "important", "nice-to-have"] as const;
export type Importance = (typeof IMPORTANCE_LEVELS)[number];

export const SEVERITY_LEVELS = ["critical", "important", "optional"] as const;
export type Severity = (typeof SEVERITY_LEVELS)[number];

export const ATS_STATUSES = ["pass", "warn", "fail"] as const;
export type AtsStatus = (typeof ATS_STATUSES)[number];

export type ReviewMode = "gemini" | "local" | "sample";

export interface ScoreCategory {
  label: string;
  score: number;
  note: string;
}

export interface KeywordItem {
  keyword: string;
  status: KeywordStatus;
  importance: Importance;
  note: string;
}

export interface MissingSkill {
  skill: string;
  severity: Severity;
  why: string;
}

export interface BulletRewrite {
  original: string;
  issue: string;
  rewrite: string;
  why: string;
}

export interface AtsCheck {
  label: string;
  status: AtsStatus;
  detail: string;
}

export interface SectionFeedback {
  section: string;
  score: number;
  feedback: string;
}

export interface ActionStep {
  title: string;
  detail: string;
  effort: string;
}

export interface Analysis {
  candidateName: string;
  targetRole: string;
  company: string;
  overallScore: number;
  verdict: string;
  scoreBreakdown: ScoreCategory[];
  keywords: KeywordItem[];
  missingSkills: MissingSkill[];
  bulletRewrites: BulletRewrite[];
  strengths: string[];
  sectionFeedback: SectionFeedback[];
  atsChecks: AtsCheck[];
  actionPlan: ActionStep[];
}

export interface ReviewRecord {
  id: string;
  createdAt: string;
  fileName: string | null;
  mode: ReviewMode;
  notice?: string;
  jobDescription?: string;
  analysis: Analysis;
}

export interface AnalyzeErrorResponse {
  error: string;
  code?: string;
}

export interface MatchLabel {
  label: string;
  tone: "strong" | "promising" | "mixed" | "weak";
}

export function matchLabel(score: number): MatchLabel {
  if (score >= 80) return { label: "Strong match", tone: "strong" };
  if (score >= 65) return { label: "Promising match", tone: "promising" };
  if (score >= 50) return { label: "Needs work", tone: "mixed" };
  return { label: "Low match", tone: "weak" };
}

export function keywordCounts(keywords: KeywordItem[]) {
  return {
    total: keywords.length,
    matched: keywords.filter((keyword) => keyword.status === "matched").length,
    partial: keywords.filter((keyword) => keyword.status === "partial").length,
    missing: keywords.filter((keyword) => keyword.status === "missing").length,
    mustHaveGaps: keywords.filter(
      (keyword) => keyword.importance === "must-have" && keyword.status === "missing",
    ).length,
    mustHavePartial: keywords.filter(
      (keyword) => keyword.importance === "must-have" && keyword.status === "partial",
    ).length,
  };
}

export function atsCounts(checks: AtsCheck[]) {
  return {
    total: checks.length,
    passed: checks.filter((check) => check.status === "pass").length,
    warnings: checks.filter((check) => check.status === "warn").length,
    failed: checks.filter((check) => check.status === "fail").length,
  };
}

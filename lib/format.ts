export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function initials(name: string): string {
  const cleaned = name
    .replace(/\b(resume|cv|curriculum vitae)\b/gi, "")
    .trim();
  if (!cleaned) return "MR";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = Date.now();
  const diff = now - date.getTime();
  const day = 86_400_000;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))} min ago`;
  if (diff < day) return `${Math.floor(diff / 3_600_000)} hr ago`;
  if (diff < day * 7) return `${Math.floor(diff / day)}d ago`;
  return formatDate(iso);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function plural(count: number, singular: string, pluralWord = `${singular}s`): string {
  return count === 1 ? singular : pluralWord;
}

export function sentenceCase(value: string): string {
  if (!value) return value;
  const trimmed = value.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function stripTrailingPeriod(value: string): string {
  return value.trim().replace(/[.!?]+$/, "");
}

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function scoreTone(score: number): "strong" | "mid" | "weak" {
  if (score >= 75) return "strong";
  if (score >= 55) return "mid";
  return "weak";
}

import { Check, CircleAlert, CircleDashed, ScanSearch } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import { cn } from "@/lib/format";
import { keywordCounts, type KeywordItem } from "@/lib/types";

const IMPORTANCE_RANK: Record<KeywordItem["importance"], number> = {
  "must-have": 0,
  important: 1,
  "nice-to-have": 2,
};

const IMPORTANCE_CHIP: Record<KeywordItem["importance"], string> = {
  "must-have": "chip chip-danger",
  important: "chip chip-outline",
  "nice-to-have": "chip chip-neutral",
};

export function KeywordSection({ keywords }: { keywords: KeywordItem[] }) {
  const counts = keywordCounts(keywords);
  const total = Math.max(1, counts.total);
  const gaps = keywords
    .filter((keyword) => keyword.status !== "matched")
    .sort((a, b) => {
      const importance = IMPORTANCE_RANK[a.importance] - IMPORTANCE_RANK[b.importance];
      if (importance !== 0) return importance;
      if (a.status !== b.status) return a.status === "missing" ? -1 : 1;
      return a.keyword.localeCompare(b.keyword);
    });
  const matchedKeywords = keywords.filter((keyword) => keyword.status === "matched");

  return (
    <div className="card h-full p-5 md:p-6">
      <CardHeader
        icon={ScanSearch}
        tone="warm"
        title="Keyword alignment"
        caption="What the posting asks for, and whether your resume says it."
        action={
          <span className="chip chip-brand-soft">
            {counts.matched}/{counts.total} matched
          </span>
        }
      />

      <div
        className="split-bar mt-4"
        role="img"
        aria-label={`${counts.matched} keywords matched, ${counts.partial} partial, ${counts.missing} missing`}
      >
        {counts.matched > 0 ? (
          <span
            className="split-segment bg-brand-600"
            style={{ width: `${(counts.matched / total) * 100}%` }}
          />
        ) : null}
        {counts.partial > 0 ? (
          <span
            className="split-segment bg-warm"
            style={{ width: `${(counts.partial / total) * 100}%`, animationDelay: "80ms" }}
          />
        ) : null}
        {counts.missing > 0 ? (
          <span
            className="split-segment bg-line-strong"
            style={{ width: `${(counts.missing / total) * 100}%`, animationDelay: "160ms" }}
          />
        ) : null}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="legend-dot bg-brand-600" aria-hidden="true" />
          {counts.matched} matched
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="legend-dot bg-warm" aria-hidden="true" />
          {counts.partial} partial
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="legend-dot bg-line-strong" aria-hidden="true" />
          {counts.missing} missing
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          Gaps to close
        </h3>
        <span className="text-[10px] text-muted">
          {gaps.length} {gaps.length === 1 ? "term" : "terms"}
        </span>
      </div>

      {gaps.length > 0 ? (
        <ul className="mt-1 divide-y divide-line">
          {gaps.map((keyword) => {
            const isMissing = keyword.status === "missing";
            const StatusIcon = isMissing ? CircleAlert : CircleDashed;
            const iconTone = isMissing
              ? keyword.importance === "must-have"
                ? "text-danger-ink"
                : keyword.importance === "important"
                  ? "text-warm-ink"
                  : "text-muted"
              : "text-warm-ink";
            return (
              <li key={keyword.keyword} className="flex gap-2.5 py-3">
                <StatusIcon
                  size={14}
                  strokeWidth={2}
                  className={cn("mt-0.5 flex-none", iconTone)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[12px] font-semibold leading-tight text-ink">
                      {keyword.keyword}
                    </p>
                    <span className={IMPORTANCE_CHIP[keyword.importance]}>
                      {keyword.importance}
                    </span>
                    {!isMissing ? (
                      <span className="chip chip-warm">Partial</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{keyword.note}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="notice-success mt-3 flex items-start gap-2 rounded-sm p-3 text-[11px] leading-relaxed">
          <Check size={13} className="mt-0.5 flex-none" strokeWidth={2.4} />
          No keyword gaps found. Keep the language specific to the role.
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          Already covered
        </h3>
        <span className="text-[10px] text-muted">{matchedKeywords.length}</span>
      </div>
      {matchedKeywords.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {matchedKeywords.map((keyword) => (
            <span
              key={keyword.keyword}
              className="chip chip-brand-soft"
              title={keyword.note}
            >
              <Check size={10} strokeWidth={2.6} />
              {keyword.keyword}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
          No exact matches yet. Start with the must-haves above.
        </p>
      )}
    </div>
  );
}

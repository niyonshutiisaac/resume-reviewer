import type { CSSProperties } from "react";
import { Gauge, Quote } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import { scoreTone } from "@/lib/format";
import type { ScoreCategory } from "@/lib/types";

export function ScoreBreakdown({
  verdict,
  scores,
  onOpenHowItWorks,
}: {
  verdict: string;
  scores: ScoreCategory[];
  onOpenHowItWorks: () => void;
}) {
  return (
    <div className="card h-full p-5 md:p-6">
      <CardHeader
        icon={Gauge}
        tone="brand"
        title="How you scored"
        caption="Weighted against the job description."
        action={
          <button type="button" className="link-quiet text-[10.5px]" onClick={onOpenHowItWorks}>
            How scoring works
          </button>
        }
      />

      <div className="notice-brand mt-4 rounded-sm p-3.5">
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-700">
          <Quote size={11} strokeWidth={2.2} />
          Recruiter&apos;s read
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink">{verdict}</p>
      </div>

      <div className="mt-5 space-y-4">
        {scores.map((item, index) => (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] font-semibold text-ink">{item.label}</span>
              <span className="tabular text-[11.5px] font-semibold text-muted">
                {item.score}
                <span className="ml-0.5 text-[9px] font-medium text-muted/70">/100</span>
              </span>
            </div>
            <div className="score-bar mt-1.5">
              <div
                className="score-bar-fill"
                data-tone={scoreTone(item.score)}
                style={
                  {
                    "--bar-value": `${item.score}%`,
                    "--bar-delay": `${index * 70}ms`,
                  } as CSSProperties
                }
              />
            </div>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

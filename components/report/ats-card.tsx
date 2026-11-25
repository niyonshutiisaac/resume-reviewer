import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, Info, ShieldCheck, XCircle } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import { cn } from "@/lib/format";
import { atsCounts, type AtsCheck } from "@/lib/types";

const STATUS_ICON = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
} as const;

const STATUS_CLASS = {
  pass: "text-success-ink",
  warn: "text-warm-ink",
  fail: "text-danger-ink",
} as const;

export function AtsCard({ checks }: { checks: AtsCheck[] }) {
  const counts = atsCounts(checks);
  const percent = Math.round((counts.passed / Math.max(1, counts.total)) * 100);
  const tone = percent >= 80 ? "strong" : percent >= 50 ? "mid" : "weak";

  return (
    <div className="card flex h-full flex-col p-5 md:p-6">
      <CardHeader
        icon={ShieldCheck}
        tone="warm"
        title="ATS readiness"
        caption={`${counts.passed} of ${counts.total} checks passed.`}
        action={<span className="chip chip-neutral">{percent}%</span>}
      />

      <div className="mt-4">
        <div className="score-bar">
          <div
            className="score-bar-fill"
            data-tone={tone}
            style={{ "--bar-value": `${percent}%`, "--bar-delay": "120ms" } as CSSProperties}
          />
        </div>
      </div>

      <ul className="mt-2 flex-1 divide-y divide-line">
        {checks.map((check) => {
          const Icon = STATUS_ICON[check.status];
          return (
            <li key={check.label} className="flex gap-2.5 py-2.5">
              <Icon
                size={14}
                strokeWidth={2}
                className={cn("mt-0.5 flex-none", STATUS_CLASS[check.status])}
              />
              <div className="min-w-0">
                <p className="text-[11.5px] font-semibold leading-tight text-ink">{check.label}</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">{check.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 flex items-start gap-1.5 border-t border-line pt-3 text-[9.5px] leading-relaxed text-muted">
        <Info size={11} className="mt-0.5 flex-none" strokeWidth={2} />
        ATS checks read the text, not the visual design.
      </p>
    </div>
  );
}

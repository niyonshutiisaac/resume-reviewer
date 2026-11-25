import { ArrowRight, Target } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import { cn } from "@/lib/format";
import type { ActionStep } from "@/lib/types";

export function PriorityStrip({
  steps,
  onSeePlan,
}: {
  steps: ActionStep[];
  onSeePlan: () => void;
}) {
  return (
    <div className="card p-5 md:p-6">
      <CardHeader
        icon={Target}
        tone="warm"
        title="Start here"
        caption="The three edits with the biggest payoff."
        action={
          <button type="button" className="link-quiet text-[10.5px]" onClick={onSeePlan}>
            See full plan
            <ArrowRight size={12} strokeWidth={2.2} />
          </button>
        }
      />

      <ol className="mt-4 grid gap-0 md:grid-cols-3 md:divide-x md:divide-line">
        {steps.slice(0, 3).map((step, index) => (
          <li
            key={step.title}
            className={cn(
              "py-3.5 md:px-4 md:py-0",
              index > 0 && "border-t border-line md:border-t-0",
              index === 0 && "pt-0 md:pl-0",
              index === steps.slice(0, 3).length - 1 && "pb-0 md:pr-0",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="tabular grid size-5 flex-none place-items-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
                {index + 1}
              </span>
              <span className="chip chip-neutral">{step.effort}</span>
            </div>
            <p className="mt-2 text-[12px] font-semibold leading-snug text-ink">{step.title}</p>
            <p className="mt-1 line-clamp-3 text-[10.5px] leading-relaxed text-muted">
              {step.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

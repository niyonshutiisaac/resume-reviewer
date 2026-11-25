import { ArrowRight, Info, Lightbulb, PenLine } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import { CopyButton } from "@/components/report/copy-button";
import type { BulletRewrite } from "@/lib/types";

export function RewriteSection({ rewrites }: { rewrites: BulletRewrite[] }) {
  return (
    <div className="card p-5 md:p-6">
      <CardHeader
        icon={PenLine}
        tone="brand"
        title="Bullet rewrites"
        caption="Stronger phrasing that keeps your facts."
        action={
          <span className="chip chip-neutral">
            {rewrites.length} {rewrites.length === 1 ? "rewrite" : "rewrites"}
          </span>
        }
      />

      <div className="notice-warm mt-4 flex items-start gap-2 rounded-sm p-3 text-[10.5px] leading-relaxed">
        <Info size={13} className="mt-0.5 flex-none" strokeWidth={2} />
        <span>
          <span className="font-semibold">Bracketed numbers are prompts, not facts.</span> Replace
          them with your real data, or remove them.
        </span>
      </div>

      {rewrites.length > 0 ? (
        <div className="mt-2 divide-y divide-line">
          {rewrites.map((item, index) => (
            <article key={`${item.original.slice(0, 24)}-${index}`} className="py-5 last:pb-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Bullet {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="chip chip-warm">{item.issue}</span>
                </div>
                <CopyButton text={item.rewrite} />
              </div>

              <div className="mt-3 grid gap-2.5 md:grid-cols-[1fr_28px_1fr] md:items-stretch">
                <div className="rounded-sm border border-line bg-canvas p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    Before
                  </p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{item.original}</p>
                </div>

                <div className="flex items-center justify-center">
                  <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-brand-700">
                    <ArrowRight
                      size={13}
                      strokeWidth={2.2}
                      className="rotate-90 md:rotate-0"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="rounded-sm border border-brand-200 bg-brand-50 p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-700">
                    After
                  </p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-ink">{item.rewrite}</p>
                </div>
              </div>

              <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
                <Lightbulb
                  size={12}
                  className="mt-0.5 flex-none text-brand-500"
                  strokeWidth={2}
                />
                <span>
                  <span className="font-semibold text-ink">Why it works:</span> {item.why}
                </span>
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="notice-success mt-4 rounded-sm p-3 text-[11px] leading-relaxed">
          No weak bullets found. Keep each line focused on one result.
        </div>
      )}
    </div>
  );
}

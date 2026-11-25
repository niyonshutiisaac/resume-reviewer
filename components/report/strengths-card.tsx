import { CheckCircle2, Sparkles } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";

export function StrengthsCard({ strengths }: { strengths: string[] }) {
  return (
    <div className="card flex h-full flex-col p-5 md:p-6">
      <CardHeader
        icon={Sparkles}
        tone="success"
        title="What's working"
        caption="Keep these as you edit."
        action={<span className="chip chip-neutral">{strengths.length}</span>}
      />

      {strengths.length > 0 ? (
        <ul className="mt-4 flex-1 space-y-3">
          {strengths.map((strength) => (
            <li key={strength} className="flex gap-2.5">
              <CheckCircle2
                size={14}
                className="mt-0.5 flex-none text-success-ink"
                strokeWidth={2.2}
              />
              <p className="text-[11.5px] leading-relaxed text-ink">{strength}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          No strengths were called out. That usually means the resume needs more evidence, not
          more adjectives.
        </p>
      )}

      <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
        These are the parts a recruiter will remember. Protect them when you rewrite.
      </p>
    </div>
  );
}

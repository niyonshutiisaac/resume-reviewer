import { CheckCircle2, ShieldCheck, Target } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import type { MissingSkill } from "@/lib/types";

const SEVERITY_LABEL: Record<MissingSkill["severity"], string> = {
  critical: "Critical",
  important: "Important",
  optional: "Optional",
};

const SEVERITY_CLASS: Record<MissingSkill["severity"], string> = {
  critical: "chip chip-danger",
  important: "chip chip-warm",
  optional: "chip chip-neutral",
};

export function MissingSkillsCard({ skills }: { skills: MissingSkill[] }) {
  return (
    <div className="card flex h-full flex-col p-5 md:p-6">
      <CardHeader
        icon={Target}
        tone="warm"
        title="Skills to add"
        caption="Only add what you can back up."
        action={<span className="chip chip-neutral">{skills.length}</span>}
      />

      {skills.length > 0 ? (
        <ul className="mt-2 flex-1 divide-y divide-line">
          {skills.map((skill) => (
            <li key={skill.skill} className="py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={SEVERITY_CLASS[skill.severity]}>
                  {SEVERITY_LABEL[skill.severity]}
                </span>
                <p className="text-[12px] font-semibold leading-tight text-ink">{skill.skill}</p>
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{skill.why}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="notice-success mt-4 flex items-start gap-2 rounded-sm p-3 text-[11px] leading-relaxed">
          <CheckCircle2 size={13} className="mt-0.5 flex-none" strokeWidth={2.2} />
          No critical skill gaps found. Focus on evidence and outcomes.
        </div>
      )}

      <div className="notice-warm mt-4 flex items-start gap-2 rounded-sm p-3 text-[10.5px] leading-relaxed">
        <ShieldCheck size={13} className="mt-0.5 flex-none" strokeWidth={2} />
        <span>
          <span className="font-semibold">Never claim a skill you can&apos;t discuss.</span> Add it
          only where you have real evidence.
        </span>
      </div>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/format";

type Tone = "brand" | "warm" | "success" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  brand: "icon-tile-brand",
  warm: "icon-tile-warm",
  success: "icon-tile-success",
  neutral: "icon-tile-neutral",
};

export function CardHeader({
  icon: Icon,
  tone = "brand",
  title,
  caption,
  action,
}: {
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  caption?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className={cn("icon-tile icon-tile-sm", TONE_CLASS[tone])}>
          <Icon size={15} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <h2 className="text-[14.5px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {title}
          </h2>
          {caption ? (
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{caption}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="flex flex-none items-center gap-2">{action}</div> : null}
    </div>
  );
}

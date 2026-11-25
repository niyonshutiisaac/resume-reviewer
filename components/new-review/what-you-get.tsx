import type { LucideIcon } from "lucide-react";
import {
  Gauge,
  PenLine,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/format";

const ITEMS: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
  tone: "brand" | "warm" | "success";
}> = [
  {
    icon: Gauge,
    title: "A match score with reasons",
    body: "Five weighted categories, not a black-box number.",
    tone: "brand",
  },
  {
    icon: ScanSearch,
    title: "Keyword alignment",
    body: "What the posting asks for, what your resume says, and what to add.",
    tone: "warm",
  },
  {
    icon: PenLine,
    title: "Bullet rewrites",
    body: "Your weakest lines, rewritten without inventing facts.",
    tone: "brand",
  },
  {
    icon: ShieldCheck,
    title: "ATS readiness",
    body: "Seven checks that catch the quiet reasons resumes get filtered.",
    tone: "success",
  },
];

const TONE_CLASS: Record<(typeof ITEMS)[number]["tone"], string> = {
  brand: "icon-tile-brand",
  warm: "icon-tile-warm",
  success: "icon-tile-success",
};

export function WhatYouGet() {
  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">What you&apos;ll get</h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            A report you can act on, not a score to stare at.
          </p>
        </div>
        <span className="icon-tile icon-tile-brand icon-tile-sm">
          <Sparkles size={14} strokeWidth={1.9} />
        </span>
      </div>

      <ul className="mt-5 space-y-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="flex gap-3">
              <span className={cn("icon-tile icon-tile-sm", TONE_CLASS[item.tone])}>
                <Icon size={15} strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold leading-tight text-ink">{item.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="notice-brand mt-5 rounded-sm p-3 text-[11px] leading-relaxed">
        <span className="font-semibold">No generic tips.</span> Every note points at your resume or
        the posting.
      </div>
    </div>
  );
}

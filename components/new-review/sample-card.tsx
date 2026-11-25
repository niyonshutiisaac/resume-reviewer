"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";

export function SampleCard({ onOpenSample }: { onOpenSample: () => void }) {
  return (
    <div className="hero-pattern bg-chrome relative overflow-hidden rounded-md p-5 text-white shadow-hero md:p-6">
      <div className="hero-content">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <ScoreRing score={84} size={60} stroke={4} />
            <div>
              <p className="text-[12.5px] font-semibold leading-tight">Senior Product Designer</p>
              <p className="mt-1 text-[10.5px] text-white/65">Northwind Labs · Sample</p>
            </div>
          </div>
          <ArrowUpRight size={16} className="mt-0.5 text-white/45" aria-hidden="true" />
        </div>

        <h2 className="mt-5 text-[19px] font-semibold leading-tight tracking-[-0.02em]">
          See what a review looks like.
        </h2>
        <p className="mt-2 text-[11.5px] leading-relaxed text-white/70">
          A full report with keyword gaps, bullet rewrites, and ATS checks. No upload needed.
        </p>
        <button
          type="button"
          className="btn btn-lavender btn-sm mt-4 w-full"
          onClick={onOpenSample}
        >
          Open sample report
          <ArrowRight size={13} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

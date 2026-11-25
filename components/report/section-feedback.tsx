"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, ListChecks } from "lucide-react";
import { CardHeader } from "@/components/report/card-header";
import { scoreTone } from "@/lib/format";
import type { SectionFeedback as SectionFeedbackItem } from "@/lib/types";

function scoreChipClass(score: number): string {
  if (score >= 75) return "chip chip-brand";
  if (score >= 60) return "chip chip-warm";
  return "chip chip-danger";
}

export function SectionFeedback({ sections }: { sections: SectionFeedbackItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="card h-full p-5 md:p-6">
      <CardHeader
        icon={ListChecks}
        tone="neutral"
        title="Section by section"
        caption="Where to spend your next hour."
      />

      {sections.length > 0 ? (
        <div className="mt-2">
          {sections.map((section, index) => {
            const isOpen = openIndex === index;
            const panelId = `section-feedback-panel-${index}`;
            return (
              <div key={`${section.section}-${index}`} className="border-b border-line last:border-0">
                <button
                  type="button"
                  className="accordion-trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-ink">{section.section}</span>
                    <span className={scoreChipClass(section.score)}>{section.score}</span>
                  </span>
                  <ChevronDown
                    size={15}
                    strokeWidth={1.9}
                    className="accordion-chevron flex-none text-muted"
                    aria-hidden="true"
                  />
                </button>
                <div id={panelId} className="accordion-content" data-open={isOpen}>
                  <div className="accordion-inner">
                    <div className="pb-4 pr-4">
                      <div className="score-bar">
                        <div
                          className="score-bar-fill"
                          data-tone={scoreTone(section.score)}
                          style={
                            {
                              "--bar-value": `${section.score}%`,
                              "--bar-delay": "80ms",
                            } as CSSProperties
                          }
                        />
                      </div>
                      <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
                        {section.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          No section feedback was returned. Try the review again with a fuller resume.
        </p>
      )}
    </div>
  );
}

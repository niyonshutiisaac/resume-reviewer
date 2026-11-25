"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/format";
import { scrollToId } from "@/lib/scroll";

export interface ReportNavSection {
  id: string;
  label: string;
  count?: number;
}

export function ReportNav({ sections }: { sections: ReportNavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -58% 0px", threshold: [0, 0.1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <div className="report-nav sticky top-16 z-30 -mx-4 mt-5 bg-canvas/85 px-4 py-2 backdrop-blur-md md:-mx-7 md:px-7">
      <nav
        className="card flex items-center gap-1 overflow-x-auto p-1.5 no-scrollbar"
        aria-label="Report sections"
      >
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              className={cn(
                "flex h-8 min-h-11 flex-none items-center gap-1.5 rounded-[6px] px-3 text-[11px] font-semibold transition-colors duration-150",
                isActive
                  ? "bg-brand-100 text-brand-700"
                  : "text-muted hover:bg-canvas hover:text-ink",
              )}
              onClick={() => {
                setActive(section.id);
                scrollToId(section.id);
              }}
              aria-current={isActive ? "location" : undefined}
            >
              {section.label}
              {typeof section.count === "number" ? (
                <span
                  className={cn(
                    "tabular rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                    isActive ? "bg-white/75 text-brand-700" : "bg-canvas text-muted",
                  )}
                >
                  {section.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

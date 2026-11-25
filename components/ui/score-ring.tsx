"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/components/ui/use-count-up";
import { cn } from "@/lib/format";

interface ScoreRingProps {
  score: number;
  size?: number;
  stroke?: number;
  variant?: "dark" | "light";
  label?: string;
  className?: string;
}

export function ScoreRing({
  score,
  size = 88,
  stroke = 6,
  variant = "dark",
  label = "Match",
  className,
}: ScoreRingProps) {
  const [progress, setProgress] = useState(0);
  const display = useCountUp(score);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);
  const isDark = variant === "dark";

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(score);
      return;
    }
    const frame = requestAnimationFrame(() => setProgress(score));
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div
      className={cn("relative grid flex-none place-items-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label} score ${score} out of 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {isDark ? (
          <defs>
            <linearGradient id={`score-ring-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D6D0F4" />
            </linearGradient>
          </defs>
        ) : null}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.16)" : "var(--brand-200)"}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDark ? `url(#score-ring-${size})` : "var(--brand-600)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 900ms var(--ease-enter)",
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center" aria-hidden="true">
        <div>
          <div
            className={cn(
              "tabular font-semibold leading-none tracking-[-0.03em]",
              isDark ? "text-white" : "text-ink",
            )}
            style={{ fontSize: Math.round(size * 0.29) }}
          >
            {display}
          </div>
          <div
            className={cn(
              "mt-1 text-[9px] font-semibold uppercase tracking-[0.13em]",
              isDark ? "text-white/60" : "text-muted",
            )}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

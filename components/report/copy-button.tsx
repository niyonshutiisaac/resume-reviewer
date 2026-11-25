"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/format";

export function CopyButton({
  text,
  label = "Copy",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        // Ignore clipboard failures; the button simply stays unchanged.
      }
      area.remove();
    }
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className={cn("btn btn-ghost btn-sm text-muted", className)}
      onClick={copy}
      aria-label={copied ? "Copied to clipboard" : `${label} rewrite`}
    >
      {copied ? (
        <Check size={13} strokeWidth={2.4} className="text-success-ink" />
      ) : (
        <Copy size={13} strokeWidth={1.9} />
      )}
      <span className="hidden sm:inline">{copied ? "Copied" : label}</span>
    </button>
  );
}

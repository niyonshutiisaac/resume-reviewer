export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5" aria-label="Merit — resume review">
      <span className="relative grid size-9 flex-none place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.35)]">
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
          <path
            d="M5 16.5 9.4 7.5 12 13l2.6-5.5L19 16.5"
            fill="none"
            stroke="var(--brand-600)"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="19.1" cy="6.2" r="1.5" fill="var(--color-accent-warm)" />
        </svg>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-bold tracking-[-0.02em] text-white">Merit</span>
          <span className="mt-1 text-[9.5px] font-medium tracking-[0.09em] text-white/60">
            Resume review
          </span>
        </span>
      ) : null}
    </span>
  );
}

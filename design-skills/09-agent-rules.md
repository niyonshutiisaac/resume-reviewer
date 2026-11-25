# 09 — Agent Rules & Build Checklist

## MUST
1. Use only semantic tokens from `07`. Never write raw hex in components.
2. Keep `--font-sans` single-family; apply the type scale from `02`.
3. Cards: white, r12, shadow-1, 16–24px padding, on `--color-bg-app` canvas.
4. One primary action per view; primary buttons are r8 rectangles, not pills.
5. Dark brand gradient is reserved for chrome: top bar, profile hero, promo card, FAB, footer.
6. Money = large numeral + small unit suffix; mask sensitive IDs by default.
7. Charts: 2px brand line, dashed neutral grid, gradient area fill, amber second series.
8. Motion: only tokens from `05`; honor reduced-motion.
9. Responsive: follow `06 §G`; touch targets ≥ 44px.
10. Accessibility: visible focus ring (3px `--color-border-focus`), semantic HTML, labels for every input, color never sole signal, `aria-current="page"` on active nav, alt text for logos/icons.

## MUST NOT
- No pure black shadows, no neon, no extra accent colors, no gradients on cards.
- No pill-shaped primary buttons, no heavy borders (>1px) except selected state (2px).
- No bounce/spring easing, no auto-playing media.
- No new fonts; no all-caps headings.

## Build checklist
- [ ] Tokens file imported
- [ ] Shell correct (top bar + collapsible sidebar + canvas)
- [ ] Spacing multiples of 4
- [ ] Radii/elevation per `03`
- [ ] Component anatomy matches `04`
- [ ] Hover/focus/active/disabled states implemented
- [ ] Loading skeletons and empty states
- [ ] Motion per `05`
- [ ] Copy tone per `06`
- [ ] Contrast verified after any palette change

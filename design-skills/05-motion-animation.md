# 05 — Motion & Animation

> **Status: mostly [INFERRED]/[VERIFY].** Animations cannot be observed in static screenshots and the research tools could not read the site's CSS/JS keyframes. This file defines a motion language consistent with the visuals (calm, institutional, fast). Replace values with verified ones from `08-verification-checklist.md` if they differ; keep the *structure* (tokens, rules) the same so the whole system stays consistent.

## Principles
1. **Calm and trustworthy:** no bounce, no overshoot, no parallax gimmicks. Financial/government context.
2. **Fast feedback, gentle reveals:** micro-interactions 120–200ms; reveals 300–500ms.
3. **Motion explains:** it shows state change (selected, expanded, loaded), never decorates.
4. **Respect `prefers-reduced-motion`:** disable transforms/parallax, keep opacity fades ≤150ms.

## Tokens
```
--ease-standard: cubic-bezier(0.2, 0, 0, 1);      /* default */
--ease-enter:    cubic-bezier(0, 0, 0.2, 1);      /* elements appearing */
--ease-exit:     cubic-bezier(0.4, 0, 1, 1);      /* elements leaving */
--dur-instant: 80ms;
--dur-fast:   150ms;   /* hover, press, focus */
--dur-base:   240ms;   /* toggles, dropdowns, tabs */
--dur-slow:   400ms;   /* panels, cards, page sections */
--dur-chart: 900ms;    /* chart line draw */
```

## Interaction catalog
| Element | Trigger | Animation | Duration / Easing |
|---|---|---|---|
| Button | hover | bg color shift to hover token | fast / standard |
| Button | press | `scale(.98)` | instant |
| Link-action arrow | hover | arrow `translateX(3px)` | fast / standard |
| Nav item | hover | bg fade to neutral-50 | fast |
| Nav item | become active | bg fade-in + left indicator bar scales Y 0→1 | base / standard |
| Sidebar | collapse/expand | width 240→64px, labels fade out first (80ms) then width animates; collapse arrow rotates 180° | slow / standard |
| Selection card | hover | `translateY(-2px)` + shadow level 1→2 + border to brand-300 | fast / standard |
| Selection card | select | border thickens, bg tints brand-50, check badge scales in .8→1 | base |
| Dropdown menu | open | opacity 0→1, `translateY(-4px)→0`, scale .98→1, origin top | base / enter |
| Dropdown chevron | open | rotate 180° | base |
| Accordion (FAQ) | open | height auto-animate + chevron rotate 180° + content fade | base–slow / standard |
| Tabs (eligibility) | switch | active underline slides to new tab (transform + width); panel cross-fades with 8px upward slide | base |
| Stepper | step complete | number badge morphs to check (scale pop 1→1.1→1 is NOT used; use fade/scale .9→1), connector fills | base |
| Slider thumb | load | thumb travels from 0 to value, fill grows in sync | slow(600ms) / enter |
| Split bars (salary) | load | each bar width 0→100% with 80ms stagger | slow / enter |
| Big numeral | load | count-up from 0 to value | 800–1000ms / enter (public stats strip too) |
| Area chart | load | line draws left→right (stroke-dashoffset), area fill fades in after line; first-point dot scales in | chart / enter |
| Chart | hover | crosshair line fades, tooltip follows with 80ms lag | instant |
| Masked input | eye toggle | text swaps `*****`↔digits with 100ms cross-fade | fast |
| Promo card | dismiss ("×") | opacity→0 + `translateY(8px)` then collapse height | base / exit |
| FAB | scroll | stays fixed; on hover lifts 2px and lip shadow grows | fast |
| Toast | show/hide | slide from bottom-right 16px + fade; auto-dismiss 5s | base / enter, exit |
| Modal | open | backdrop opacity 0→.5 (base); panel scale .96→1 + fade (slow) | enter |
| Skeleton | loading | linear shimmer sweep, 1.4s infinite | linear |
| Page (public site) sections | scroll into view | fade + `translateY(24px→0)`, children stagger 60–80ms, trigger once at 20% visibility | slow / enter |
| Hero | page load | headline lines reveal sequentially (fade-up), then CTA | slow, stagger 100ms |
| Testimonial carousel | auto/arrow | horizontal slide with fade of outgoing slide; autoplay 6s, pause on hover | slow / standard |
| Stats strip | scroll into view | count-up | 1000ms |
| Language selector | open | same as dropdown | base |
| Ishema window | first load | window fades in and rises 16px over the dark patterned backdrop | slow / enter |

## Do / Don't
- Do animate only `transform` and `opacity` (plus color/background and width for bars).
- Do keep one animation per element at a time.
- Don't use spring/bounce easing, rotating loaders larger than 24px, or auto-playing video backgrounds.
- Don't block interaction while animating; every animation is interruptible.

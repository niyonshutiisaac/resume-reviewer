# 08 — Verification Checklist (close the [VERIFY] gaps)

Open each site in Chrome → DevTools (F12). Update the matching file when a value differs.

| Item | Where to find it | Update file |
|---|---|---|
| Exact font family | Elements → pick heading → Computed → "Rendered Fonts"; Network → filter "Font" | 02 |
| Font weights loaded | Network → Font requests (filenames show weights) | 02 |
| Real color tokens | Elements → `:root` / `body` → Styles; look for `--` variables or Tailwind config | 01, 07 |
| Radii, shadows | Select card → Styles → border-radius, box-shadow | 03 |
| Spacing / grid | Select container → Computed → padding, gap; toggle grid overlay | 03 |
| Transitions | Styles → search `transition`; Computed → transition-* | 05 |
| Keyframes | Sources → CSS → search `@keyframes`; Animations panel (⋮ → More tools → Animations) while scrolling | 05 |
| Scroll reveal library | Search JS for `AOS`, `framer-motion`, `gsap`, `IntersectionObserver` | 05 |
| Background pattern | Network → Img/SVG; right-click → Open in new tab; save asset | 01, 03 |
| Icons | Check if SVG sprite / lucide / phosphor; Elements → `<svg>` | 04 |
| Chart library | Sources → look for `recharts`, `chart.js`, `apexcharts`, `d3` | 04, 05 |
| Breakpoints | Resize window; Styles → `@media` rules | 03 |

Sites to inspect: `rssb.rw` (home, /schemes/pension-scheme, /news, /senior-management), `ishema.rssb.rw` (login + declaration flow; needs a test account), member portal (Imisanzu) dashboard, EjoHeza portal.

Tip: a "Copy → Copy styles" on key elements, then paste the output to the agent, is the fastest way to lock exact values.

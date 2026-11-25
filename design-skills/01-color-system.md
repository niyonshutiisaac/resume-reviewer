# 01 — Color System

All hex values below were pixel-sampled from the supplied screenshots [OBSERVED] unless noted. Colors are consumed ONLY through semantic tokens (file 07). Changing the palette = changing token values, never component code.

## 1. Brand scale (indigo / ultramarine)
| Token | Hex | Where seen |
|---|---|---|
| `brand-900` | `#120B48` | Ishema login/declaration backdrop (darkest navy) |
| `brand-800` | `#1B1263` | Ishema backdrop, lighter band |
| `brand-700` | `#2813B9` | Dashboard hero card bottom, header bottom edge |
| `brand-600` | `#341CD7` / `#3520C4` | Primary brand: top bar, links, chart line, active slider fill (≈`#2D12C2`) |
| `brand-500` | `#4D36F9` | Primary button on dark bar ("My Applications"), CTA accent |
| `brand-450` | `#452CC6` | Active-nav left indicator bar |
| `brand-400` | `#6E5BD1` | Dropdown chevron icons |
| `brand-300` | `#987FFF` / `#8C81FA` | Illustration/gradient mid-tones, light purple chips |
| `brand-200` | `#D6D0F4` | Slider track, soft borders |
| `brand-100` | `#EAE7F8` | Active nav item background, soft tints |
| `brand-50`  | `#EEECFA` → `#FCFCFE` | Area-chart fill gradient (top → bottom) |

Primary action color = `brand-600`. Dark chrome (top bar, hero card, promo card) = `brand-600 → brand-700` vertical gradient.

## 2. Accent
| Token | Hex | Use |
|---|---|---|
| `accent-sky` | `#54ACFF` / `#5CA2FF` | Secondary data series, illustration highlights |
| `accent-amber-500` | `#FFCF82` | Second data bar (Pension Amount), warm highlight |
| `accent-amber-100` | `#FFE1AA` | Icon tile background (Retirement Projection icon) |
| `accent-amber-icon` | ~`#F5A524` [INFERRED] | Icon stroke on amber tile |
| `accent-green` | ~`#22C55E` [INFERRED] | "RAMA Eligible" status dot, success badge (small green square badge seen on Ishema declaration icon) |
| `accent-red` | ~`#E5484D` [INFERRED] | Required-field asterisk (tiny red `*` in footnote) |

## 3. Neutrals (cool-tinted)
| Token | Hex | Use |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Cards, sidebar, inputs, modals |
| `neutral-25` | `#FBFCFD` | Ishema window surface |
| `neutral-50` | `#F3F4F8` | **App page background** (dashboard canvas) |
| `neutral-75` | `#F5F4F9` | Subtle inner panels |
| `neutral-100` | `#F2F2F8` / `#EBE9F5` | Dividers, skeleton bars, placeholder strips |
| `neutral-300` | `#B5B7C3` | Chip text/borders, disabled |
| `neutral-500` | ~`#6B6F80` [INFERRED] | Secondary text, nav inactive labels |
| `neutral-900` | `#0E0E10` | Primary text, large numerals |

Neutrals carry a very slight blue-violet tint. Never use pure gray (#808080) or warm gray.

## 4. Semantic role map (what agents should reference)
| Semantic token | Default maps to |
|---|---|
| `--color-bg-app` | neutral-50 |
| `--color-bg-surface` | neutral-0 |
| `--color-bg-brand-deep` | brand-900 |
| `--color-bg-chrome` | gradient brand-600 → brand-700 |
| `--color-bg-selected` | brand-100 |
| `--color-text-primary` | neutral-900 |
| `--color-text-secondary` | neutral-500 |
| `--color-text-on-brand` | #FFFFFF |
| `--color-text-link` | brand-600 |
| `--color-border-subtle` | neutral-100 |
| `--color-action-primary` | brand-600 (hover brand-700, pressed brand-800) |
| `--color-action-on-dark` | brand-500 |
| `--color-accent-warm` | accent-amber-500 |
| `--color-status-success` | accent-green |
| `--color-chart-1` / `-2` / `-3` | brand-600 / amber-500 / sky |
| `--color-track` | brand-200 |

## 5. Gradients [OBSERVED/INFERRED]
- **Chrome / hero card:** `linear-gradient(180deg, #381DE5 0%, #2913BE 100%)`; the hero card has a slightly darker 4–6px lower edge (`#2813B9`) that reads as a solid "lip".
- **Top bar:** nearly flat `#321FB9 → #3520C4` horizontal.
- **Ishema backdrop:** `#120B48` to `#1B1263` with a faint repeating line-art pattern (woven/adinkra-like curved strokes, ~6–8% lighter than base) [VERIFY the pattern asset].
- **Area chart fill:** `linear-gradient(180deg, #EEECFA 0%, #FCFCFE 100%)` under a 2px brand line.
- **Public site purple-to-blue marketing background (dashboard preview image):** diagonal `#987FFF → #54ACFF` pastel wash behind device mockups.

## 6. Contrast rules
- White text on brand-600/700 passes AA (>7:1).
- Secondary text on white must be ≥ 4.5:1; do not go lighter than `#6B6F80` for body-size text.
- Amber is never used for text on white; only as fill or icon.
- Never encode meaning by color alone (pair with label/icon).

## 7. Re-theming
To change palette: redefine the `brand-*`, `accent-*`, `neutral-*` scales keeping the same **lightness steps** (900 darkest … 50 lightest) so shadows, hovers and tints still work. See file 07.

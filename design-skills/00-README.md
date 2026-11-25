# RSSB / Ishema Design System — Agent Entry Point

Read this file first, then the numbered files in order.

## Purpose
Lets an AI agent build pages and apps that look and behave like the Rwanda Social Security Board (RSSB) ecosystem: the public site `rssb.rw`, the **Ishema** employer platform (`ishema.rssb.rw`), and the member dashboard (pension / contribution / services / account).

## Evidence levels (IMPORTANT)
Every spec is tagged:
- **[OBSERVED]** measured or read directly from the supplied screenshots (3 images) or fetched page text.
- **[INFERRED]** a reasoned estimate from the visuals. Follow it unless a verified value replaces it.
- **[VERIFY]** could not be confirmed from the available material (live CSS, font files, keyframes, timings). See `08-verification-checklist.md` for how to confirm in DevTools in ~10 minutes.

> Honesty note: the research tools used to build this system return page *text* and images, not raw HTML/CSS/JS. Exact font files, CSS values, easing curves and animation durations of the live site were therefore NOT readable. Colors and component anatomy come from pixel sampling of your screenshots. Motion and font specs are best-fit recommendations marked [INFERRED]/[VERIFY].

## What must stay fixed vs what may change
| Layer | Rule |
|---|---|
| Component anatomy, radii, spacing rhythm, elevation, states | **FIXED** (files 03, 04) |
| Typography family, scale, weights | **FIXED** (file 02) |
| Motion language (durations, easing, behaviors) | **FIXED** (file 05) |
| Color palette | **SWAPPABLE** via semantic tokens only (files 01, 07) |
| Copy / content | Free, but follow tone in 06 |

## File index
1. `01-color-system.md` palette, semantic roles, gradients, data-viz colors
2. `02-typography.md` font, scale, weights, numerals
3. `03-layout-spacing-elevation.md` grid, shell, spacing, radii, shadows
4. `04-components.md` every component with anatomy, sizes, states
5. `05-motion-animation.md` motion principles and specs
6. `06-page-patterns.md` public site sections, Ishema flow, member dashboard
7. `07-theming-and-tokens.md` copy-paste CSS variables and how to re-theme
8. `08-verification-checklist.md` how to confirm [VERIFY] items from the live site
9. `09-agent-rules.md` do/don't rules and build checklist

## One-paragraph visual identity
Trustworthy, calm, institutional-modern. A saturated **indigo/ultramarine** brand color on **near-white cool-gray** surfaces; white rounded cards with very soft shadows; a deep-navy hero/frame for onboarding screens; **amber** as the single warm accent; generous whitespace; small, quiet secondary text; large confident numerals for money.

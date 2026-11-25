# 02 — Typography

## Font family
**Status: [VERIFY]** The font files could not be read from the live site. From the screenshots the type is a **modern geometric/humanist sans-serif** with: double-storey `a`, round `o`/`e`, slightly squarish numerals, medium-high x-height, friendly but corporate. Closest matches: **DM Sans** (best match for the numerals "10,495,395" and heading "Julie Ineza"), then **Plus Jakarta Sans**.

**Working choice until verified:** `DM Sans`.
```
--font-sans: "DM Sans", "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```
Load weights 400, 500, 600, 700. Use `font-display: swap`. One family only; no serif, no mono except for code/IDs if ever needed (use `ui-monospace`).

To confirm the exact font: DevTools → Elements → select a heading → Computed → scroll to "Rendered Fonts". Replace the value of `--font-sans` ONLY; the scale below stays.

## Scale (estimated from a 1080px-wide dashboard capture; rem at 16px base) [INFERRED]
| Role | Size | Weight | Line-height | Letter-spacing | Example |
|---|---|---|---|---|---|
| Display (marketing hero) | 56–64px (3.5–4rem) | 700 | 1.1 | -0.02em | "Over 62 years, securing your future." |
| H1 page title | 32–40px | 700 | 1.2 | -0.01em | "Our Social Security Schemes" |
| H2 section / card hero name | 24–28px | 600–700 | 1.25 | -0.01em | "Julie Ineza" |
| Big numeral (money KPI) | 32–40px | 600 | 1.1 | -0.01em | "10,495,395" with small unit |
| H3 card title | 15–16px | 600 | 1.3 | 0 | "Salary Breakdown", "Contribution Summary" |
| Body | 14–16px | 400 | 1.5 | 0 | Descriptions |
| Label / nav item | 14px | 500–600 | 1.4 | 0 | "Home", "Contribution" |
| Caption / helper | 12px | 400 | 1.4 | 0 | "Here's a breakdown of the past 4 months." |
| Micro | 10–11px | 400–500 | 1.3 | 0.01em | Footnotes, chip text |
| Link-action | 13–14px | 600 | 1.2 | 0 | "Check breakdown →" (underlined) |

## Rules
1. **Currency:** big numeral + tiny unit suffix. Unit ("RWF") is ~10–11px, weight 500, color `text-secondary`, baseline-aligned, 4px gap. Format with thousands commas; decimals only where money has cents (`620,342.76`).
2. **Field labels** (RSSB Number, National ID, Phone Number, Date of Birth) are two-line pairs: label 11–12px weight 400 at ~70% white; value 14–15px weight 600 white (on dark card).
3. **Masked values** use asterisks (`1 19** * *****172 39`, `+250788***4392`). Never display full national IDs/phones by default.
4. **Links** that are actions: brand color, weight 600, underline, followed by a short right arrow icon (16px).
5. **Headings** are sentence case. Buttons are Title Case ("My Applications", "Start Contributing Voluntarily", "File a Claim").
6. **Numerals** use default proportional figures in prose, tabular figures (`font-variant-numeric: tabular-nums`) in tables and chart axes.
7. Highlighted word in a title uses brand color: "Declaration for **July 2024**" (month-year in `brand-600`, weight 600).
8. Max line length for body copy: 60–72ch.
9. Multilingual: UI supports English, Kinyarwanda and French (language selector "English ⌄" in header). Allow ~30% text expansion.

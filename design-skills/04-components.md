# 04 — Components

Every component: anatomy → sizing → states → tokens. Use semantic tokens from file 07. Sizes are estimates [INFERRED] unless noted.

---
## 1. Top Bar (app header) [OBSERVED]
- Height 64–72px, `bg-chrome`, no border. Logo (RSSB round seal, ~36px, white-ring version) at left, 24px inset.
- Right cluster, 16px gap: **Primary-on-dark button** "My Applications" (leading circle/search-style icon 16px, label 600 white, bg `brand-500`, radius 8px, height ~40px, padding 16–20px) and **Language selector** (globe icon 20px + "English" + chevron, white text, no fill, hover = 10% white overlay).

## 2. Sidebar Navigation [OBSERVED]
- Width ~190–240px, white, items: Home, Contribution, Services, Account. Each item: 36–40px tall, radius 8px, padding 8–12px, icon 18px left + label 14px/500, gap 12px.
- **Default:** icon & label `text-secondary`, transparent bg.
- **Hover:** bg `neutral-50`.
- **Active:** bg `brand-100`, label `brand-600` weight 600, icon filled brand, **3px left indicator bar** `brand-450` flush to the item's left edge (radius on right side).
- **Collapse toggle:** 20–24px square, radius 6px, bg `brand-600`, white left-arrow, positioned straddling the sidebar's top-right edge. Collapsed state shows icons only (width ~64px).
- **Promo card (pinned bottom):** bg `bg-chrome`, white text, radius 8px, padding 12–16px; title 14px/600 ("Want to go further?"), body 11–12px at 85% white, full-width button (bg `brand-200`/light-lavender `#D1D2FF`, text brand-700, radius 6px, 12px/600, height 32px); tiny dismiss "×" circle top-right (16px, white-20% bg).

## 3. Profile Hero Card [OBSERVED]
- Full-width, radius 16px, `bg-chrome` gradient + solid lower lip, padding 20–28px, text white.
- Left: **Avatar** 64px circle, 2px white ring + inner 4px gap ring, initials "JI" 24px/600 centered, transparent fill; to its right: name (24–28px/700) and status line with 8px green dot + "RAMA Eligible" (12px).
- Right: 4 key-value columns with equal spacing (RSSB Number, National ID, Phone Number, Date of Birth) — label 12px 70% white, value 15px/600 white. Hides to 2×2 on tablet, stacked list on mobile.
- Top-right: round 24px white "⋯" overflow button (dark dots).

## 4. Stat / Summary Card (e.g., Salary Breakdown) [OBSERVED]
Anatomy: white card r12, padding 20px, elevation 1.
1. Header row: title (15/600) + subtitle caption (12px, secondary) left; right-aligned text-link action with arrow ("Check breakdown →").
2. Context chip: `neutral-100` bg, 10px text, radius 4px, padding 4×8 ("Previous Contribution (February 2024)").
3. Overline label ("Sum of Gross Salary", 11px, secondary) → Big numeral (36px/600) + unit.
4. **Split bars:** two horizontal bars side-by-side with 8px gap, each 3–4px tall, rounded ends; colors `chart-1` (brand) and `chart-2` (amber). Under each: label 11px secondary, value 13px/600 + unit.

## 5. Projection Card with Slider [OBSERVED]
- Header: 32px icon tile (radius 8px, bg `accent-amber-100`, amber bar-chart icon) + title 15/600 + caption; right text-link "Find out how →".
- Inner bordered panel (1px `neutral-100`, r12, padding 16px) containing:
  - **Masked currency input:** height 44px, r8, 1px border, prefix "RWF" (secondary) + `*********` + trailing eye-off icon (toggle visibility).
  - Label (14/600): "You've been contributing for 5 years and 10 Months".
  - **Slider:** track 6–8px, radius full, `brand-200`; filled portion `brand-600`; **thumb** 24–28px white circle with 2px brand ring and small user/people glyph inside; shows progress, read-only look.
  - Footnote 10px with red asterisk.

## 6. Buttons
| Variant | Style |
|---|---|
| Primary | bg `action-primary`, white text 14/600, h 40–44, px 20, r 8, hover bg brand-700, active brand-800 + scale .98, focus ring 3px `brand-300`@40% |
| Primary on dark | bg `brand-500`, white text; hover +6% lightness |
| Light on dark | bg lavender `#D1D2FF`, text brand-700 |
| Secondary | white bg, 1px border `neutral-100`, text `neutral-900` 600, hover bg neutral-50 |
| Ghost / Link | no bg, brand text, 600, underline on link-actions, arrow icon 16px nudges 2–4px right on hover |
| FAB | "File a Claim": bg `brand-700` with lip shadow, white text, leading chat icon 18px, r 8–10, h 44, px 20, fixed bottom-right |
| Disabled | bg `neutral-100`, text `neutral-300`, no shadow, cursor not-allowed |
Min touch target 44px on mobile. Loading = inline 16px spinner replacing icon, label stays.

## 7. Select / Dropdown trigger [OBSERVED]
White, 1px `neutral-100`, r8, h 36–40, px 12, label 14/600 then small **chevron inside a 16px rounded square tile** (`brand-100` bg, `brand-400` chevron). Examples: "2024", "RSSB". Open menu: elevation 2, r12, items 40px, hover neutral-50, selected brand-100 with check.

## 8. Area / Line Chart (Contribution Summary) [OBSERVED]
- Header: title 15/600 + subtitle; right: two selects (year, scheme).
- Plot: dashed horizontal grid `neutral-100`, y labels (0, 100K, 500K, 1M, 2M, 3M, 4M, 5M — non-linear steps, 12px secondary, left-aligned), x labels months Jan–Dec (12px secondary, centered).
- Series: 2px `chart-1` stroke, smooth step with a rounded bend after the first data point, **dot marker** 10px solid brand with 2px white ring at the first point, area fill gradient (file 01 §5).
- Hover: vertical hairline + tooltip card (white, elevation 2, r8, 12px).
- Empty/loading: gradient shimmer on the grid area.

## 9. Stepper (Ishema declaration) [OBSERVED]
Vertical list inside a white rounded card (r16, padding 12–16px). 5 steps: Select The Declaration, Select The Declaration, Payroll Validation, Review Declaration, Submit Declaration.
- Item: h 36–40, r8, px 12; number in 20px circle (white with 1px border; active = brand fill? shown as light-gray rounded tab with dark text), label 13px/500.
- **Active:** bg `neutral-100`/`neutral-50`, label 600 `neutral-900`, number badge filled.
- **Completed:** badge turns brand with check icon [INFERRED].
- **Upcoming:** label secondary.

## 10. Selection Card (choose a declaration) [OBSERVED]
Wide white card r12, 1px `brand-100` border, soft brand-tinted shadow. Left 36px icon tile (document icon, light-gray tile, tiny green status badge bottom-right 10px square r2). Title 16/600 **brand** ("Declaration"), subtitle 12px secondary ("Click here to file declaration"). Hover: border `brand-300`, shadow level 2, slight translateY(-2px). Selected: 2px brand border + brand-50 bg. Placeholder skeleton bars sit above/below as loading preview.

## 11. Window Pill Nav [OBSERVED]
Top-nav tabs: `Home`, `Contributions`, `Services`. Pill r10, px 20, h 36; active = light gray `neutral-50` fill + `neutral-900` 600 text; inactive = very low-opacity text (disabled/coming-soon look); hover on enabled = neutral-50.

## 12. Back Button
32px circle, white, 1px border `neutral-100`, `‹` chevron 16px secondary; hover bg neutral-50.

## 13. Badges / Chips / Status
- Status dot 8px + text (success green).
- Chip: r4, h 20–24, px 8, 10–11px/500, bg `neutral-100`, text `neutral-500`.
- Tag on feature: r full, brand-100 bg, brand text.

## 14. Public-site components [INFERRED from content structure]
- **Scheme Card** (×6): white card r16, 24px padding, 48px icon tile (brand-100 bg), title 18/600, 2-line description 14px secondary, "Learn more →" link; hover lift + border brand-200.
- **Stat Block:** big numeral 40–56px/700 brand-600 (`12 Million +`, `6`, `RWF 3.9TRn`), label 14px secondary.
- **Service Feature Row:** alternating image/text (device mockup on a purple→sky diagonal gradient panel, r20), headline 28–32px/700, paragraph 16px, CTA button.
- **CEO Message:** portrait (r16) + long-form text + name 16/600 + title 14px secondary.
- **Testimonial/Investment Carousel:** quote card (white, r16, padding 24–32) with company logo, 5 slides (MTN Rwanda, Katapult Africa, Zipline, Bank of Kigali, vaccine manufacturing), dots or arrows below.
- **FAQ Accordion** (pension page): row h 56–64, question 16/600, chevron right-aligned rotating 180° when open, 1px dividers.
- **Eligibility/Process Tabs:** tabs for Old-age, Invalidity, Survivors, Voluntary; content as numbered requirement lists.
- **News card:** image top r12, date caption, title 16/600, excerpt 2 lines.
- **Footer:** deep navy `brand-900`, white text, 4 columns (schemes, services, contact `4044`/`5006`, social), small legal row.

## 15. Forms
Label 13/600 above field (8px gap); input h 44, r8, 1px border, px 12, placeholder `neutral-300`; focus: border `brand-600` + 3px ring `brand-300`@35%; error: border red + 12px red helper text with icon; helper text 12px secondary. OTP field (Ishema login uses 5-digit code): 5 boxes 48×56, r8, gap 8, auto-advance.

## 16. Empty / Loading / Error
Skeleton bars `neutral-100` with shimmer; empty states: 64px line-icon in brand-100 circle + title 16/600 + 14px secondary + primary button.

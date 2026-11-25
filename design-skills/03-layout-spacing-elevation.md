# 03 — Layout, Spacing, Radii, Elevation

## Spacing scale (4px base) [INFERRED from screenshots]
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96`
- Card inner padding: **16–24px** (dashboard cards ~16px at 1080 capture ≈ 20–24px at full size)
- Gap between cards: **16–20px**
- Page gutter: 16–24px from sidebar and edge

## App shell (member dashboard) [OBSERVED]
```
┌──────────────────────────────────────────────────────────┐
│ TOP BAR (brand gradient, ~54px @1080 ≈ 64–72px)          │ logo left … [My Applications] [🌐 English ⌄] right
├────────────┬─────────────────────────────────────────────┤
│ SIDEBAR    │ CANVAS (neutral-50)                         │
│ white,     │  Profile hero card (full width)             │
│ ~190px     │  Row: Salary Breakdown | Retirement Projection (2 equal cols)
│ collapsible│  Contribution Summary chart (full width)    │
│ promo card │                                  [File a Claim FAB bottom-right]
└────────────┴─────────────────────────────────────────────┘
```
- Sidebar: white, rounded top-right corner on the canvas side, items stacked with 8px gap, collapse toggle (small brand-filled square with `←` arrow) hanging on the sidebar's top-right edge.
- Sidebar bottom: dismissible promo card pinned to bottom.
- Canvas is a 12-col grid; the two mid cards each span 6; others span 12. Below 1024px stack to 1 col; sidebar becomes a drawer.
- Floating action button ("File a Claim") fixed bottom-right, 24px from edges.

## Ishema window layout [OBSERVED]
Deep-navy full-screen backdrop with pattern → centered white rounded "app window" (≈ 90% width, max ~1200px), containing:
1. Window header: logo + product name "Ishema" at left, pill nav centered/right (`Home` active pill with light-gray fill; other tabs `Contributions`, `Services` appear faded/disabled).
2. Sub-header row: round back button (32px circle, light border) + title "Declaration for **July 2024**".
3. Two-column body: left stepper card (~30%), right content panel (~70%).

## Public site (rssb.rw) layout [OBSERVED from text structure, [INFERRED] styling]
Full-width stacked sections: Hero → Schemes grid (6 cards: Pension, EjoHeza, CBHI/Mutuelle, Occupational Hazard, Maternity Leave, Medical/RAMA) → Stats strip (12 Million+ Members Served, 6 Growing Inclusive Schemes, RWF 3.9TRn Assets) → Services (4 feature rows: Ishema, Contributions, EjoHeza, Healthcare providers) → CEO message → Investments (32 companies, 11 sectors) → Testimonials carousel → Footer. Content max-width ~1200–1280px; section vertical padding 64–96px.

## Breakpoints [INFERRED]
`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`

## Radii [INFERRED from screenshots]
| Token | Value | Use |
|---|---|---|
| `radius-xs` | 4px | chips, tiny badges |
| `radius-sm` | 8px | buttons, inputs, nav items, selects |
| `radius-md` | 12px | cards, sub-panels |
| `radius-lg` | 16–20px | hero card, Ishema window, big containers |
| `radius-full` | 999px | avatar, slider thumb, pills, back button, dots |
Button radius is **8px** (rounded rectangle, NOT pill) for primary actions.

## Elevation [INFERRED]
| Level | Style | Use |
|---|---|---|
| 0 | none, 1px border `neutral-100` | inline panels, inputs |
| 1 | `0 1px 2px rgba(18,11,72,.04), 0 4px 12px rgba(18,11,72,.04)` | standard white cards on canvas |
| 2 | `0 8px 24px rgba(18,11,72,.10)` | dropdown menus, popovers |
| 3 | `0 16px 48px rgba(18,11,72,.20)` | modals, Ishema window over dark backdrop |
| Lip | `0 4px 0 #2813B9` (solid, no blur) | Hero profile card bottom edge; FAB; promo card |
Shadows are tinted with the deep brand navy, never pure black.

## Borders
1px `neutral-100`, dashed 1px `neutral-100` for chart gridlines, 1px `brand-200` for focus/selected soft outlines. Inputs have 1px border `#E6E6F0`-ish.

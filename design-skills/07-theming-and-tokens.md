# 07 — Theming & Tokens (copy-paste)

Components NEVER reference raw hex. They use only the semantic tokens at the bottom. To change the palette, edit **Layer 1** only.

```css
:root {
  /* ===== LAYER 1: PALETTE (edit these to re-theme) ===== */
  --brand-900:#120B48; --brand-800:#1B1263; --brand-700:#2813B9; --brand-600:#341CD7;
  --brand-500:#4D36F9; --brand-450:#452CC6; --brand-400:#6E5BD1; --brand-300:#987FFF;
  --brand-200:#D6D0F4; --brand-100:#EAE7F8; --brand-50:#F5F3FD;

  --accent-sky:#54ACFF; --accent-amber-500:#FFCF82; --accent-amber-100:#FFE1AA;
  --accent-green:#22C55E; --accent-red:#E5484D;

  --neutral-0:#FFFFFF; --neutral-25:#FBFCFD; --neutral-50:#F3F4F8; --neutral-75:#F5F4F9;
  --neutral-100:#EBE9F5; --neutral-300:#B5B7C3; --neutral-500:#6B6F80; --neutral-900:#0E0E10;

  /* ===== LAYER 2: SEMANTIC (components use ONLY these) ===== */
  --color-bg-app: var(--neutral-50);
  --color-bg-surface: var(--neutral-0);
  --color-bg-deep: var(--brand-900);
  --color-bg-chrome: linear-gradient(180deg, #381DE5 0%, var(--brand-700) 100%);
  --color-bg-selected: var(--brand-100);
  --color-bg-muted: var(--neutral-100);
  --color-text-primary: var(--neutral-900);
  --color-text-secondary: var(--neutral-500);
  --color-text-on-brand: #FFFFFF;
  --color-text-link: var(--brand-600);
  --color-border-subtle: var(--neutral-100);
  --color-border-focus: var(--brand-300);
  --color-action-primary: var(--brand-600);
  --color-action-primary-hover: var(--brand-700);
  --color-action-primary-active: var(--brand-800);
  --color-action-on-dark: var(--brand-500);
  --color-accent-warm: var(--accent-amber-500);
  --color-accent-warm-soft: var(--accent-amber-100);
  --color-status-success: var(--accent-green);
  --color-status-danger: var(--accent-red);
  --color-chart-1: var(--brand-600);
  --color-chart-2: var(--accent-amber-500);
  --color-chart-3: var(--accent-sky);
  --color-track: var(--brand-200);

  /* ===== FIXED: type, shape, elevation, motion ===== */
  --font-sans: "DM Sans","Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --radius-xs:4px; --radius-sm:8px; --radius-md:12px; --radius-lg:20px; --radius-full:999px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:20px; --space-6:24px;
  --space-8:32px; --space-10:40px; --space-12:48px; --space-16:64px; --space-24:96px;
  --shadow-1:0 1px 2px rgba(18,11,72,.04),0 4px 12px rgba(18,11,72,.04);
  --shadow-2:0 8px 24px rgba(18,11,72,.10);
  --shadow-3:0 16px 48px rgba(18,11,72,.20);
  --shadow-lip:0 4px 0 var(--brand-700);
  --ease-standard:cubic-bezier(.2,0,0,1); --ease-enter:cubic-bezier(0,0,.2,1); --ease-exit:cubic-bezier(.4,0,1,1);
  --dur-instant:80ms; --dur-fast:150ms; --dur-base:240ms; --dur-slow:400ms; --dur-chart:900ms;
}
@media (prefers-reduced-motion: reduce){ *{animation-duration:.01ms!important;transition-duration:.01ms!important} }
```

## Re-theme recipe
1. Pick a new brand hue. Generate a 9-step scale with the **same lightness curve** as `brand-900…50` (900 ≈ L12%, 600 ≈ L42% high-chroma, 100 ≈ L94%, 50 ≈ L97%).
2. Keep neutrals tinted toward the new brand hue (≈ 3–5% chroma).
3. Keep ONE warm accent distinct from brand for the second data series.
4. Verify contrast: white on `brand-600` ≥ 4.5:1; `neutral-500` on white ≥ 4.5:1.
5. Do not touch Layer 2/FIXED values.

## Example alt theme (green, matches the "green payroll" Ishema filename idea)
```css
:root{ --brand-900:#06281A; --brand-800:#0B3B27; --brand-700:#0E6B3F; --brand-600:#12864D;
 --brand-500:#1BA862; --brand-450:#14793F; --brand-400:#4CAF7A; --brand-300:#7FD1A2;
 --brand-200:#CDEBD9; --brand-100:#E5F5EC; --brand-50:#F2FAF5; }
```

## Tailwind mapping (if used)
```js
theme.extend = {
  colors:{ brand:{900:'var(--brand-900)',800:'var(--brand-800)',700:'var(--brand-700)',600:'var(--brand-600)',500:'var(--brand-500)',300:'var(--brand-300)',200:'var(--brand-200)',100:'var(--brand-100)',50:'var(--brand-50)'},
           ink:'var(--neutral-900)', muted:'var(--neutral-500)', canvas:'var(--neutral-50)' },
  fontFamily:{ sans:'var(--font-sans)' },
  borderRadius:{ sm:'8px', md:'12px', lg:'20px' },
  boxShadow:{ 1:'var(--shadow-1)', 2:'var(--shadow-2)', 3:'var(--shadow-3)' }
}
```

# EjoHeza Design Spec (`ejoheza.rssb.rw`) — Combined with the RSSB / Ishema System

Self-contained file for the EjoHeza voluntary long-term savings site. It **inherits** every foundation (color tokens, type, radii, shadows, motion tokens) from the RSSB design system files `01`–`09`, and adds everything EjoHeza-specific: structure, sections, the savings calculator (with exact math), content rules, and motion.

## 0. Evidence levels
- **[OBSERVED]** read directly from the fetched pages (`/`, `/about`, `/benefits`): structure, copy, section order, tech stack, image sources, numbers.
- **[DERIVED]** computed/reverse-engineered from observed numbers (e.g., the calculator formula, verified to the shilling).
- **[INHERITED]** taken from the RSSB design system (files 01–09).
- **[VERIFY]** not readable with the available tools (live CSS, exact hex values, font file, keyframes, easing, durations). Confirm via `08-verification-checklist.md`.

> The tools return page text/markup, not stylesheets or rendered pixels. So EjoHeza's exact colors, font and animation timings are NOT confirmed. Defaults below reuse the RSSB tokens, because EjoHeza is an RSSB product (RSSB logo, same footer links, RSSB helplines). If EjoHeza's live CSS differs, change only the Layer‑1 palette in file `07`; every component here stays the same.

## 1. Site facts [OBSERVED]
| Item | Value |
|---|---|
| Framework | **Next.js** (assets served via `/_next/image`, `meta-next-size-adjust`) |
| Image delivery | `next/image` on **Cloudflare Images** (`imagedelivery.net`) and **Cloudinary** (`res.cloudinary.com`); most illustrations and the dashboard preview are **SVG**; photos requested at `w=3840&q=75` |
| Primary language | **Kinyarwanda** (default); header has a **flag button** language switcher (flag image 48px) |
| Domains | Marketing: `ejoheza.rssb.rw` · Web app: `app.ejoheza.rssb.rw` (`/` login, `/register`, `/public-claim`) · USSD: `*506#` |
| Pages | `/` (Ahabanza), `/about` (Menya EjoHeza), `/benefits` (Ibyo ugenerwa), privacy link goes to `rssb.rw/privacy-policy` |
| Helplines | RSSB toll-free **4044**; EjoHeza toll-free **5006** |
| Footer legal | "© Ejoheza 2026" |
| Audience | Salaried and informal-sector Rwandans, diaspora, foreign residents; ages 18–55+; parents saving for children under 16; many users on feature phones (USSD) |

## 2. Brand personality & voice [OBSERVED]
- Name meaning: *Ejo heza* = "a brighter tomorrow". Tone: **optimistic, reassuring, personal, second person** ("Tangira…", "Iyandikishe", "Izigamire byoroshye").
- Short imperative CTAs; conversational headlines; a touch of emoji in body ("ku migabane 7 y'isi 🚀") only in playful statements.
- Reassure on money: always add the disclaimer line near projections ("Iyi ni imibare y'igereranya, si icyizere ntakuka" = *These are estimates, not guarantees*).
- Inclusivity is visible: photos of ordinary Rwandans (smiling woman, woman in a market, woman on a plantation), testimonials from a teacher, student, and trader.
- Always offer the **no-smartphone path**: "Kanda *506#".
- Copy must be written Kinyarwanda-first; plan for EN/FR variants with ~30% expansion.

## 3. Information architecture [OBSERVED]
```
Header: [RSSB logo] Ahabanza · Menya EjoHeza · Ibyo ugenerwa     [Injira (secondary)] [Iyandikishe (primary)] [flag]
Pages
 ├─ Ahabanza (home)
 ├─ Menya EjoHeza (about)
 └─ Ibyo ugenerwa (benefits)
Footer: logo · helplines · 4 links · ©
```
Global conversion goals, in priority order: **Iyandikishe** (register) → **Izigamire** (save) → **Ohereza ubusabe** (submit claim) → **Bara ubwizigame** (calculate).

## 4. Global components

### 4.1 Header [OBSERVED structure / INHERITED styling]
- Logo left (RSSB seal `logo.svg`, rendered ~48px, `next/image` w=96). Center/left nav of 3 text links; right: **Injira** (secondary/outlined, r8) + **Iyandikishe** (primary filled, r8) + language flag button (round, 32–40px).
- Sticky on scroll; on scroll add `shadow-1` and solid `bg-surface`; at top it sits transparent over hero [INFERRED].
- Active link: brand color + 2px underline or brand-100 pill [INFERRED].
- Mobile: hamburger → full-height drawer; the two CTAs stay visible inside the drawer; flag stays in the bar.

### 4.2 Buttons
Inherit file `04 §6`. Usage here: primary **Iyandikishe**, **Tangira**, **Izigamire**, **Ohereza ubusabe**; secondary **Injira**, **Bara ubwizigame** (calculate), **Soma ibikurikira** (read next, ghost/link with arrow), **Soma bike** (read less, ghost).

### 4.3 Footer [OBSERVED]
Logo → two helpline lines ("Umurongo utishyuzwa (RSSB): 4044", "Umurongo utishyuzwa (Ejoheza): 5006") → four links (Ahabanza, Menya EjoHeza, Ibyo ugenerwa, Politiki yo Kurinda Amakuru Bwite) → copyright. Deep brand background (`brand-900`) with white text [INFERRED].

### 4.4 Section header pattern [OBSERVED]
Every H2 appears **twice in the DOM** (e.g., "Menya EjoHezaMenya EjoHeza"). This is the signature of an animated heading: one copy is the visible text and the other is a duplicate used for a **reveal/mask or word-by-word color-fill animation** (see §9). Agents must reproduce the *effect* (one accessible copy; duplicate `aria-hidden`), never the duplicated visible text.

### 4.5 FAQ accordion [OBSERVED]
Section "Tubaze. Turasubiza." ("Ask us. We answer.") + one-line intro, then 4 collapsed questions as H3 rows. Row h 56–64px, question 16/600, chevron right (rotates 180° open), 1px dividers; only one open at a time [INFERRED]. Questions: claim for a deceased family member; claim as a member; saving for a child via phone; foreigner resident registration.

### 4.6 USSD banner CTA [OBSERVED]
Full-width promotional band appearing at the end of every page: H2 "Kanda *506# aka kanya, utangire wizigamire!" + sub-copy ("Hehe no kwizigamira bigoranye…") + primary button **Tangira** + illustration (effortless saving). Brand-tinted background, rounded container r20, illustration right/overflowing the edge.

### 4.7 Testimonial card [OBSERVED]
Quote paragraph + name (e.g., Uzaliba, Samuel, Jeanne) + role (Umwarimu = teacher, Umunyeshuri = student, Umucuruzi = trader). Three cards; carousel or 3-col grid. Card: white, r16, shadow-1, padding 24–32, optional large quote glyph in brand-100 [INFERRED]. Quotes should be 2–4 lines, first person, concrete benefit (retirement payout, bereavement payout, saving for children).

## 5. Home page (`/`) — section by section [OBSERVED order]

1. **Hero.** H1 (animated, duplicated in DOM): "Gutegura ejo heza hawe bitangirira aha" ("Preparing your bright tomorrow starts here"). Sub-copy: age-agnostic reassurance ("Waba ufite imyaka 18 cyangwa 55, uri umunyarwanda cyangwa umunyamahanga utuye mu Rwanda…"). Two actions: **Bara ubwizigame** (secondary, scrolls to calculator) + **Iyandikishe** (primary). Visuals: a **dashboard preview SVG** (the member app) plus **three portrait photos** (smiling woman, woman in a market, woman in a plantation) arranged as an overlapping collage with rounded masks (r20–24) around the dashboard [INFERRED arrangement]. Display type 48–64px/700.
2. **Menya EjoHeza** (what it is). One paragraph + ghost link **Soma ibikurikira**. Short, left text with right illustration [INFERRED].
3. **Sobanukirwa ibigenerwa abanyamuryango** (understand member benefits). Five benefit items as H3 + one-liner: retirement from 55; illness/disability cover; health insurance & funeral; building a home (*Kubaka icumbi*); "know what you're entitled to" (links to benefits page). Layout: 2-col feature list with icon tiles (brand-100, r12, 48px) or an interactive tab/list with image [INFERRED].
4. **Hitamo EjoHeza hawe n'abawe** (choose EjoHeza for you and yours). **Three alternating image/text rows**, each with H3, paragraph, SVG illustration and **Iyandikishe**: (a) save for your children (under 16); (b) use EjoHeza anywhere in the world; (c) calculate your savings (calculator teaser).
5. **Tangira kwizigamira muri EjoHeza** — **3 numbered steps** with big numerals `01 02 03`, H3, short text and a feature illustration each: (01) visit the website, (02) register on web or dial `*506#`, (03) save easily via phone, bank, etc. Closing CTA **Izigamire**. Numerals: 48–64px/700 in brand-200/brand-600; steps connected by a thin dashed line [INFERRED]. Illustration comes from Cloudflare Images/Cloudinary SVGs.
6. **Savings calculator** — "Tegura ejo hazaza hawe na EjoHeza" (full spec in §6).
7. **Diaspora CTA** — "Kwizigamira uri Mu mahanga ni nk'ako kanya!" + globe illustration + **Tangira**.
8. **Claim CTA** — "Urashaka gusaba ibyo ugenerwa?" with a twisted-arrow illustration and a 2-option segmented control/tabs: **Icyo usaba** / **Hitamo ibigenerwa** (choose what you're claiming).
9. **Testimonials** — "Ibyishimo by'abamenye Ejoheza" (§4.7).
10. **FAQ** — §4.5.
11. **USSD banner** — §4.6.
12. **Footer** — §4.3.

## 6. Savings calculator — full spec

### 6.1 Anatomy [OBSERVED]
Heading "Tegura ejo hazaza hawe na EjoHeza" and four **goal tabs/chips**: *Kuzamura ubwizigame bwanjye* (grow my savings) · *Kugera ku ntego* (reach a goal) · *Amafaranga y'izabukuru* (retirement money) · *Konti ebyiri* (two accounts).
Sub-heading: "Reba icyo ubwizigame bwawe bushobora kuzavamo." (See what your savings can become.)

Left panel — inputs (in order):
1. **Imyaka ufite ubu** — current age (number/stepper or slider).
2. **Nzahagarika kwizigama mfite imyaka** — age I'll stop saving (retirement age; default 55).
3. **Nizigama** — amount, with `RWF` prefix.
4. **Inshuro** — frequency (monthly/yearly select).
5. Link-button **Hindura igenamigambi ryawe** ("Change your assumptions") ↔ **Si ngombwa** ("Not necessary") toggles an advanced drawer showing the assumptions chip line: **"Inyungu 10% ku mwaka · Ibiciro bizamuka 0% ku mwaka"** (interest 10%/yr · inflation 0%/yr).
6. Live-update note: "Igisubizo cyawe kigenda gihinduka uko wandika" (your result changes as you type) → **no submit button; results recompute on every input change** (debounce ≤150ms).

Right panel — results card:
- Overline: "Ufite imyaka 55, ushobora kuzaba ufite" (At age 55 you could have)
- **Hero number** `RWF98,096,414` (40–56px/700, count-up on change) 
- Sub-line: "Bingana na RWF 98.1M mu gaciro k'uyu munsi" (equals RWF 98.1M in today's value)
- Two stat tiles: **Ayo wizigamye** RWF 17.4M (contributed) · **Inyungu wabonye** RWF 80.7M (interest earned) — compact "M" formatting.
- Explanatory sentence paragraph (plain-language recap of the two numbers) and **payout line**: "Ibyo byashobora kuguha hafi RWF 408,735 buri kwezi mu myaka 20." + link **Reba uburyo bwo guhabwa amafaranga** (see payout options).
- Fine-print disclaimer.

Below: **Chart "Uko ubwizigame bwawe bwiyongera buri mwaka"** — stacked column/area by age (x: 27, 30, 35, 40, 45, 50, 55) with two series, legend **Ayo wizigamye** (contributed, brand) and **Inyungu yabonetse** (interest earned, amber/sky). Interest segment grows exponentially — visually shows compounding.

**"Tangira kare" (Start early) comparison** — H3 "Ubwizigame bumwe, igihe cyo gutangira gitandukanye" with a 3-row list/bars: start at 26 → **RWF 98.1M**; start at 31 → **RWF 58.4M**; start at 36 → **RWF 33.8M**. Callout: "Gutegereza imyaka 10 bigutwara RWF 64.3M." (Waiting 10 years costs you RWF 64.3M.) Bars use brand fill with widths proportional to value; the final bar highlighted with amber "cost of waiting" tag.
Extra helper: "Nta telefoni igezweho ufite? Kanda *506# …" and globe illustration after the block.

### 6.2 Exact math [DERIVED — reproduces the page to the shilling]
The page's default shows age 26 → 55 (29 years), saving **RWF 50,000 / month = RWF 600,000 / year**, interest **10% per year**, inflation **0%**.

```ts
// annual compounding; contributions made at the START of each year
const yearsSaving = stopAge - currentAge;                // 29
const yearlyContribution = amount * (frequency === 'monthly' ? 12 : 1); // 600_000
const i = interestPct / 100;                              // 0.10
const futureValue =
  yearlyContribution * ((Math.pow(1 + i, yearsSaving) - 1) / i) * (1 + i);
// → 98,096,414  ✔ (also 58,408,236 for 24y, 33,765,000 for 19y)
const contributed = yearlyContribution * yearsSaving;     // 17,400,000
const interestEarned = futureValue - contributed;         // 80,696,414  (shown 80.7M)
const todayValue = futureValue / Math.pow(1 + inflationPct/100, yearsSaving); // inflation 0% → same
const monthlyPayout = futureValue / (20 * 12);            // 408,735  (simple division over 20 years)
const costOfWaiting10 = FV(startAge) - FV(startAge + 10); // 64.3M
```
Rules: the three "start early" rows use the same contribution, interest and stop age with start ages `current`, `current+5`, `current+10`. Format: full number with `RWF` prefix for hero; `M` suffix with 1 decimal for tiles; Kinyarwanda "miliyoni" only in stats. Never show negative or NaN: when inputs invalid show em-dash and helper error in red 12px.
Always show the disclaimer: *"Iyi ni imibare y'igereranya, si icyizere ntakuka."*

### 6.3 Behaviour
- Inputs: numeric keyboard on mobile (`inputmode="numeric"`), thousands separators while typing, min/max validation (age 18–55; stop age > current).
- On change: number count-up 400ms; chart series animate heights from previous to new (400ms, `ease-standard`); start-early bars animate width.
- Goal tabs change preset defaults and labels (not the math) [INFERRED].

## 7. About page (`/about`) [OBSERVED]
1. **Hero:** H1 "Dufasha buri munyarwanda kuzagira amasaziro meza" + paragraph + **Iyandikishe** + illustration.
2. **Amateka yacu (History):** large year numeral "2026" (timeline/year ticker), long paragraph (created by Government via Ministry of Finance on 29 June 2017; implemented from 2019; open to Rwandans and foreign residents) and a playful line "Abanyamuryango bacu bari ku migabane 7 y'isi 🚀".
3. **Global reach:** "Koresha EjoHeza aho waba uri ku isi yose" with a **grid of ~19 circular country flags** (GA, ZA, TZ, KE, GB, BE, RW, BI, UG, RU, CA, US, CN, FR, JP, PL, DE, IT, AE, CD) arranged in staggered rows (5 per row); each flag 48–64px circle, 1px border, **auto-scrolling marquee rows moving in opposite directions** [INFERRED from the row grouping].
4. **Growth stats:** "Uko EjoHeza yagutse" + 3 count-up stats: *miliyoni* Abanyamuryango (members) · *+* Ibigenerwa abanyamuryango (benefits) · *BRWF* Ubwizigame (savings in billions RWF). Page markup shows values as `0` → they **count up from 0 when scrolled into view** [OBSERVED: initial "0" state]. Numerals 48–64px/700 brand, labels 14–16px secondary. Building icon illustration beside.
5. **Partners:** "Dore abafatanyabikorwa bacu" logo strip (Access to Finance Rwanda, Airtel‑Tigo, Bank of Kigali, Republic of Rwanda, BNR, Mobicash, MTN) — grayscale logos 128px wide, color on hover [INFERRED], with "Tuvugishe" (contact us) link for new partners.
6. **Legal:** "Menya amategeko ya EjoHeza" + paragraph + document cards/links (laws & regulations downloads).
7. USSD banner + footer.

## 8. Benefits page (`/benefits`) [OBSERVED]
1. **Hero:** H1 "Turi kumwe mu gutegura ahazaza hawe hatekanye" + paragraph + **Iyandikishe** + dashboard illustration.
2. **Ibigenerwa abanyamuryango ba EjoHeza** — a **filter/segment control** ("Abemerewe" = eligible) and **6 expandable benefit cards** (each with H3, 2–3 line teaser, and **Soma ibikurikira** / **Soma bike** toggling expand): retirement from 55; health insurance & funeral; home-building (*icumbi*); care for loved ones when absent (heirs' benefits); continuing education; benefits for departing foreign nationals (lump-sum). Expanded cards reveal full text in place (height animation).
3. **"Dore uko wasaba ibyo ugenerwa"** — 3-step process with illustration per step: (1) choose claim type, (2) submit documents & choose payment method, (3) send request and wait for the response.
4. **"Saba ibigenerwa uwitabye Imana"** — card for claiming on behalf of a deceased member (legal heir) with **Ohereza ubusabe** → `app…/public-claim` (no login), illustration "Join us".
5. FAQ, USSD banner, footer (same as home).

## 9. Motion [OBSERVED hints + INHERITED tokens from file 05]
| Element | Behaviour | Evidence |
|---|---|---|
| H1/H2 headings | Duplicated text node → animated reveal (line mask rise or left-to-right color fill), triggers once on viewport entry. Use `--dur-slow` (400–600ms), `--ease-enter`; split by words with 40–60ms stagger | OBSERVED duplication; style [VERIFY] |
| Stats (members, benefits, savings) | Count-up from `0` to target when 30% visible, 1000–1500ms, `--ease-enter`, once | OBSERVED (`0` initial values) |
| Country flags | Two/three horizontally auto-scrolling rows in opposite directions, linear infinite, 30–40s, pause on hover, disabled for reduced-motion | INFERRED from grouped rows |
| Section content | Fade + translateY(24→0) on scroll, stagger 60–80ms | INFERRED (Next.js marketing norm) |
| Hero collage | Photos/dash preview float in with staggered fade-scale (.96→1); subtle 4–6px parallax on scroll | INFERRED |
| Numbered steps | Numeral and card slide up sequentially (100ms stagger); connector line draws | INFERRED |
| Calculator | Instant recompute; count-up 400ms; chart/bars tween 400ms | DERIVED from "updates as you type" |
| Benefit cards | Expand/collapse height 240ms + text fade; arrow rotates | INFERRED |
| FAQ | Height auto-animate 240ms, chevron rotate 180° | INFERRED |
| Buttons/links | Hover bg shift 150ms; arrow nudge 3px; press scale .98 | INHERITED |
| Header | Becomes solid + shadow after 8px scroll, 150ms | INFERRED |
All motion honors `prefers-reduced-motion` (replace with instant state, keep ≤150ms fades). Use only `transform`/`opacity`; no bounce.

## 10. Imagery & illustration rules [OBSERVED]
- **Illustrations are flat SVG** (dashboard preview, feature illustrations, globe, twisted arrow, building icon, "effortless saving"). Style: flat vector, rounded geometry, brand palette with soft tints, no outlines heavier than 2px, no gradients except subtle brand washes.
- **Photography:** real Rwandan people, candid smiling, in work contexts (market, plantation); crop with r20–24 masks; warm natural light; never stock-looking offices.
- **Flags:** circular crops. **Partner logos:** neutral, equal visual height (~32–40px).
- Use `next/image` with explicit `width/height`, `priority` only for hero; lazy-load the rest; provide Kinyarwanda `alt` text describing the image.
- Keep image hosts configured in `next.config.js` `images.remotePatterns`: `imagedelivery.net`, `res.cloudinary.com`.

## 11. Layout & responsive [INHERITED + INFERRED]
- Container max-width 1200–1280px, side padding 16 (mobile) / 24 (tablet) / 32+ (desktop). Section vertical padding 64–96px desktop, 40–56px mobile.
- 12-col grid; alternating rows are 6/6; calculator is 5/7 (inputs/results) on desktop, stacked on mobile with results card sticky below inputs.
- Breakpoints from file `03`: 640 / 768 / 1024 / 1280.
- Mobile: header → drawer; hero stacks (text, CTAs full-width, then collage scaled); step rows become single column with numerals above; flags rows reduce to 2; FAQ full-width; USSD banner stacks with illustration below.
- Touch targets ≥ 44px; the `*506#` string should be a tappable `tel:` link on phones (`tel:*506%23`).

## 12. Content & formatting rules [OBSERVED]
- Currency: `RWF` before amounts in prose (`RWF 17.4M`) and with no space in hero (`RWF98,096,414`) → **standardize to `RWF 98,096,414`** in new builds.
- Dates: day-month-year in Kinyarwanda ("29 Kamena 2017").
- Phone strings: `*506#`, `4044`, `5006` set in weight 700 so they stand out.
- Buttons are verbs in Kinyarwanda; keep ≤ 2 words where possible.
- Every projection shows its assumptions (interest %, inflation %, horizon) and the disclaimer.
- Each page ends with the USSD banner and the FAQ (benefits and home).

## 13. Design tokens used (map to file 07)
```css
/* EjoHeza uses the same tokens; no new colors are required */
.ejo-hero      { background: var(--color-bg-app); }
.ejo-cta-band  { background: var(--color-bg-chrome); color: var(--color-text-on-brand); border-radius: var(--radius-lg); }
.ejo-card      { background: var(--color-bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-1); padding: var(--space-6); }
.ejo-numeral   { font: 700 clamp(40px,6vw,64px)/1.05 var(--font-sans); color: var(--color-text-link); font-variant-numeric: tabular-nums; }
.ejo-chip      { background: var(--color-bg-selected); color: var(--color-text-link); border-radius: var(--radius-full); padding: 4px 12px; font: 600 12px var(--font-sans); }
.ejo-series-contributed { color: var(--color-chart-1); }
.ejo-series-interest    { color: var(--color-chart-2); } /* amber, same as "Pension Amount" in the dashboard */
.ejo-cost-of-waiting    { background: var(--color-accent-warm-soft); color: #7A4B00; }
```
If EjoHeza's live palette proves different (e.g., a green/gold savings identity), override only `--brand-*` and `--accent-*` in file `07`.

## 14. Relationship to the other RSSB products
| Product | Surface | Shares with EjoHeza | Differs |
|---|---|---|---|
| rssb.rw | Institutional site | Logo, footer links, helplines, scheme cards link to EjoHeza | Formal tone, English-first |
| Ishema | Employer B2B platform | Tokens, form & stepper components | Dense, dark-backdrop window, wizard flow |
| Member dashboard | Pension app | Chart style, currency formatting, hero profile card | Authenticated, data-heavy |
| **EjoHeza site** | Consumer marketing + calculator | Tokens, buttons, FAQ, footer | Kinyarwanda-first, friendly tone, photography, big numerals, calculator, USSD-first CTA |
| EjoHeza app | `app.ejoheza.rssb.rw` | Login/register/claim flows (not inspected — requires account) | [VERIFY] |

## 15. Agent build checklist (EjoHeza)
- [ ] Kinyarwanda copy first, language switch in header
- [ ] Header: 3 links + Injira + Iyandikishe + flag
- [ ] Hero with animated H1, two CTAs, dashboard SVG + 3 photo collage
- [ ] Benefits list, 3 alternating "choose EjoHeza" rows, numbered 3-step flow
- [ ] Calculator with live recompute using §6.2 formula and the disclaimer
- [ ] Start-early comparison with "cost of waiting"
- [ ] Diaspora CTA, claim CTA with tabs, testimonials (3), FAQ (4), USSD banner, footer with 4044/5006
- [ ] About: history year, flags marquee, count-up stats, partners strip, legal link
- [ ] Benefits: 6 expandable cards, 3-step claim process, deceased-member claim card
- [ ] Count-up and heading-reveal animations once per page view; reduced-motion respected
- [ ] SVG illustrations via `next/image`; alt text in Kinyarwanda
- [ ] Contrast checked after any palette change

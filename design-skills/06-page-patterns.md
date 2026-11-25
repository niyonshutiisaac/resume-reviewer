# 06 — Page Patterns & Content Tone

## Brand voice [OBSERVED from copy]
Warm, member-first, plain language. Short promise headlines, supportive sub-lines. Examples: "Over 62 years, securing your future.", "Payroll deductions made simple", "Your partner in financial security, social protection and health care." Avoid jargon; explain terms (e.g., "Invalidity pension").
Languages: English, Kinyarwanda, French. Currency: `RWF`. Phone: +250. Helplines **4044** / **5006**. Email info@rssb.rw.

## A. Public Home (rssb.rw)
1. **Hero:** large display headline "Over 62 years, securing your future." + sub-line + 2 CTAs (primary: Explore Schemes; secondary: Access Services). Background: deep brand with the faint line-art pattern or light canvas with device mockups on purple→sky gradient.
2. **Our Social Security Schemes:** intro paragraph + 6-card grid (3×2 desktop, 2×3 tablet, 1×6 mobile): Pension · EjoHeza · CBHI (Mutuelle) · Occupational Hazard · Maternity Leave · Medical (RAMA). Each card → scheme page.
3. **Lifecycle statement:** "RSSB protects its members from birth to universal health coverage…" centered text block.
4. **Stats strip:** 12 Million+ Members Served · 6 Growing Inclusive Schemes · RWF 3.9TRn Assets under management.
5. **Empowering You Through Our Services:** 4 alternating feature rows — Ishema (payroll deductions), Contributions/Imisanzu (reports, pension apply), EjoHeza (voluntary savings, anywhere in the world), Healthcare providers (claims). Each with device screenshot + CTA.
6. **The Future We Deserve:** CEO message with portrait, name, title.
7. **Investments:** "Invested in Over 32 Companies Across 11 Sectors" + logo grid.
8. **Testimonials "Building Rwanda's Economic Future":** carousel of investment stories.
9. **Footer.**

## B. Scheme page pattern (e.g., /schemes/pension-scheme)
Order: page hero (title + 1-line promise) → benefit cards (Old-age, Invalidity, Survivors, RAMA continuation) → stats row (Average Monthly Beneficiaries, Average Monthly Pension Payments, Pension Fund Growth Rate) → Eligibility (who can contribute, voluntary insurance) → **How to claim**: tabbed/stepped requirement lists per benefit type → FAQ accordion (8–10 items) → CTA band.
Rates are shown plainly with numerals (e.g., 15% total = 7.5% employer + 7.5% employee; RAMA for pensioners 7.5%; voluntary 6%; retirement age 60).

## C. Other public pages (same shell, different content)
`/news` (card grid + featured), article page (single column 720px), `/senior-management` (person cards: portrait r16, name, role), publications/downloads (file rows with PDF icon + size + download button), service-delivery standards booklets.

## D. Ishema flow (employer platform)
1. **Onboarding/login:** phone number → "Get started" → TIN + confirm company → 5-digit OTP. Centered white card on deep-navy patterned backdrop. One action per screen.
2. **Home:** pill nav (Home · Contributions · Services); Services lists schemes (e.g., Maternity Leave Benefits).
3. **Declaration wizard:** back button + title "Declaration for {Month Year}"; left vertical stepper (Select Declaration → Select Declaration → Payroll Validation → Review Declaration → Submit Declaration); right panel changes per step. Step 1 content: centered heading "Select the declaration" + selection card(s). Footer actions: Back (secondary) / Continue (primary) right-aligned.
4. **Payroll validation:** data table (employee, ID, gross, contribution) with row status chips, inline error rows, upload/import control.
5. **Review & submit:** summary cards (totals), confirmation checkbox, primary "Submit Declaration"; success state with green check, reference number, download receipt.
Principle: "5 minutes, zero paper, zero trip" — progressive, minimal fields, visible progress.

## E. Member dashboard (Home)
Order: Hero profile card → [Salary Breakdown | Retirement Projection] → Contribution Summary chart → sidebar promo + FAB "File a Claim". Other tabs: Contribution (history table + filters + statement download), Services (grid of service cards: apply for pension, update details, claims), Account (personal info, bank details, language, security).

## F. Data tables [INFERRED]
Header row 40px, 12px/600 uppercase-free secondary text on neutral-50; rows 52–56px, 14px; zebra none; hover neutral-50; sticky header; pagination bottom-right (prev/next 32px r8 buttons, page numbers); status chips (Paid green, Pending amber, Overdue red); row actions in "⋯" menu.

## G. Responsive behavior
Desktop ≥1024 full shell; tablet 768–1023 sidebar collapsed to icons; mobile <768 sidebar → bottom tab bar or drawer, cards single column, hero card key-values stacked, chart scrolls horizontally with min-width 560px, FAB becomes 48px round icon button.

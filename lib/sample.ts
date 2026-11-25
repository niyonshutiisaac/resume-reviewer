import type { Analysis, ReviewRecord } from "@/lib/types";

export const SAMPLE_JOB_DESCRIPTION = `Senior Product Designer
Northwind Labs — San Francisco, CA (Hybrid)

About the role
Northwind Labs builds B2B SaaS tools for finance teams. We're looking for a Senior Product Designer to own the end-to-end design of our onboarding and billing experiences. You'll work closely with product, engineering, and customer success to turn complex workflows into products that feel obvious.

What you'll do
- Lead design for a core product area, from discovery through launch and iteration.
- Build and evolve our design system, including design tokens, components, and documentation.
- Run qualitative and quantitative research, including usability testing and customer interviews.
- Partner with engineers to ship high-quality, accessible interfaces that meet WCAG 2.2 standards.
- Mentor other designers and raise the bar for craft and critique.

What we're looking for
- 6+ years of product design experience, with at least 2 years in B2B SaaS.
- A strong portfolio showing complex workflow design and measurable product outcomes.
- Fluency in Figma, prototyping, and interaction design.
- Experience with design systems at scale and cross-functional collaboration.
- Strong written communication and stakeholder management skills.

Nice to have
- Experience with finance or accounting products.
- Familiarity with Storybook and design tokens.
- Experience running design ops or building team rituals.`;

export const SAMPLE_RESUME = `Maya Chen
Senior Product Designer
maya.chen@email.com · (415) 555-0142 · San Francisco, CA · mayachen.design

SUMMARY
Senior product designer with 8 years of experience shaping B2B SaaS products from discovery to launch. I pair research with systems thinking to make complex workflows feel simple. Comfortable leading discovery, design systems, and delivery with small product teams.

EXPERIENCE
Northstar Analytics — Senior Product Designer
Mar 2021 — Present
• Responsible for leading design on the Atlas onboarding redesign and working with engineers to ship it.
• Helped with user research and created wireframes for the new billing experience.
• Worked on the design system and maintained components used by the team.
• Partnered with product and engineering to define the roadmap for the reporting suite.
• Mentored two mid-level designers and ran weekly critique.

Lumen Health — Product Designer
Jun 2018 — Feb 2021
• Redesigned the patient intake flow, reducing completion time by 28%.
• Built a component library adopted by three product teams.
• Ran 20+ usability sessions and turned findings into a prioritized backlog.

Brightline Studio — Product Designer
Jun 2016 — May 2018
• Designed responsive marketing sites for three B2B clients and turned the layouts into a reusable pattern library.
• Partnered with copywriters and developers to ship a six-project portfolio on schedule.

SELECTED WORK
Atlas onboarding redesign (Northstar Analytics)
Led the end-to-end redesign of a nine-step onboarding flow, from discovery interviews through launch. Partnered with engineering on a phased rollout and instrumented the funnel so the team could see where new accounts stalled.

Billing experience (Northstar Analytics)
Mapped the existing billing workflow and prototyped a simpler plan-selection and invoice view. Ran usability sessions with finance admins and turned the findings into a prioritized backlog for the next quarter.

EDUCATION
Rhode Island School of Design — BFA, Graphic Design
2014 — 2018

TOOLS
Figma, FigJam, Jira, Notion, Maze, Amplitude

CERTIFICATIONS
Human-Centered Design, IDEO U — 2020

SKILLS
Figma, prototyping, user research, usability testing, information architecture, interaction design, design systems, mentoring, stakeholder management, agile, Jira, roadmap`;

export const SAMPLE_ANALYSIS: Analysis = {
  candidateName: "Maya Chen",
  targetRole: "Senior Product Designer",
  company: "Northwind Labs",
  overallScore: 84,
  verdict:
    "You're a credible fit for this role. Your research depth, B2B context, and design leadership come through, but the resume undersells two things Northwind cares about: accessibility and measurable product outcomes. Fix those and you move from “worth a call” to “must-interview.”",
  scoreBreakdown: [
    {
      label: "Keyword alignment",
      score: 80,
      note: "17 of 24 key terms matched; 2 must-haves are missing.",
    },
    {
      label: "Impact & metrics",
      score: 70,
      note: "2 of 10 bullets include a measurable outcome.",
    },
    {
      label: "Clarity & structure",
      score: 90,
      note: "Standard headings and a readable one-page flow.",
    },
    {
      label: "ATS readiness",
      score: 86,
      note: "6 of 7 checks passed; keyword coverage is the gap.",
    },
    {
      label: "Role relevance",
      score: 92,
      note: "B2B analytics and research depth map directly to the role.",
    },
  ],
  keywords: [
    {
      keyword: "Design systems",
      status: "matched",
      importance: "must-have",
      note: "Your component library at Lumen Health is the proof; use the posting's exact phrase.",
    },
    {
      keyword: "Figma",
      status: "matched",
      importance: "must-have",
      note: "Listed in your skills section.",
    },
    {
      keyword: "User research",
      status: "matched",
      importance: "must-have",
      note: "Backed by 20+ usability sessions at Lumen Health.",
    },
    {
      keyword: "Prototyping",
      status: "matched",
      importance: "must-have",
      note: "Present in your skills and project work.",
    },
    {
      keyword: "Accessibility",
      status: "missing",
      importance: "must-have",
      note: "No mention of accessible interface work. Add it only if it is true.",
    },
    {
      keyword: "B2B SaaS",
      status: "matched",
      importance: "must-have",
      note: "Your summary names B2B SaaS explicitly; keep it.",
    },
    {
      keyword: "Cross-functional collaboration",
      status: "matched",
      importance: "must-have",
      note: "You name product and engineering partners in your Northstar bullets.",
    },
    {
      keyword: "Design leadership",
      status: "matched",
      importance: "must-have",
      note: "You led the Atlas redesign and mentored two designers.",
    },
    {
      keyword: "Product strategy",
      status: "matched",
      importance: "important",
      note: "Roadmap ownership with product and engineering is visible.",
    },
    {
      keyword: "Design tokens",
      status: "partial",
      importance: "important",
      note: "Your component library is close; add “design tokens” if you worked with them.",
    },
    {
      keyword: "Usability testing",
      status: "matched",
      importance: "must-have",
      note: "20+ sessions at Lumen Health.",
    },
    {
      keyword: "Information architecture",
      status: "matched",
      importance: "important",
      note: "Listed in your skills section.",
    },
    {
      keyword: "Interaction design",
      status: "matched",
      importance: "important",
      note: "Listed in your skills section.",
    },
    {
      keyword: "Design critique",
      status: "matched",
      importance: "important",
      note: "Weekly critique is mentioned in your Northstar role.",
    },
    {
      keyword: "Mentoring",
      status: "matched",
      importance: "important",
      note: "Two mid-level designers mentored.",
    },
    {
      keyword: "Stakeholder management",
      status: "matched",
      importance: "important",
      note: "Listed in your skills section.",
    },
    {
      keyword: "Agile",
      status: "matched",
      importance: "nice-to-have",
      note: "Listed in your skills section.",
    },
    {
      keyword: "Roadmap",
      status: "matched",
      importance: "important",
      note: "Reporting-suite roadmap work at Northstar.",
    },
    {
      keyword: "WCAG 2.2",
      status: "missing",
      importance: "must-have",
      note: "The posting names WCAG 2.2; your resume doesn't.",
    },
    {
      keyword: "Storybook",
      status: "missing",
      importance: "nice-to-have",
      note: "A nice-to-have; add it only if you've used it.",
    },
    {
      keyword: "Design ops",
      status: "partial",
      importance: "nice-to-have",
      note: "Your critique and team rituals are adjacent; name design ops if that was your remit.",
    },
    {
      keyword: "Customer interviews",
      status: "partial",
      importance: "important",
      note: "Your research bullet mentions usability sessions; add interviews if you ran them.",
    },
    {
      keyword: "Finance or accounting",
      status: "partial",
      importance: "nice-to-have",
      note: "Billing experience is adjacent; name finance or accounting directly if that was your remit.",
    },
    {
      keyword: "Measurable outcomes",
      status: "matched",
      importance: "important",
      note: "Two of ten bullets include a real metric; add more.",
    },
  ],
  missingSkills: [
    {
      skill: "Design system governance",
      severity: "critical",
      why: "The role owns a system used across teams. Show how you set standards, not just maintained components.",
    },
    {
      skill: "Accessibility auditing",
      severity: "critical",
      why: "WCAG 2.2 is a must-have. Name the audits or accessible patterns you've shipped.",
    },
    {
      skill: "Quantitative research",
      severity: "important",
      why: "The posting asks for qualitative and quantitative research. Name the metrics or experiments you used, not just the sessions.",
    },
    {
      skill: "Design tokens",
      severity: "important",
      why: "The posting calls out tokens. Add the workflow only if you've worked with a token pipeline.",
    },
    {
      skill: "Finance domain",
      severity: "optional",
      why: "A bonus, not a blocker. Mention any finance or accounting products you've worked on.",
    },
  ],
  bulletRewrites: [
    {
      original:
        "Responsible for leading design on the Atlas onboarding redesign and working with engineers to ship it.",
      issue: "Duty-first, no outcome",
      rewrite:
        "Led design for Atlas's onboarding redesign with 3 engineers, lifting activation by [X]% and cutting time-to-first-value from [Y] to [Z] days.",
      why: "Leads with ownership, names the scope, and leaves room for the two metrics that prove impact.",
    },
    {
      original:
        "Helped with user research and created wireframes for the new billing experience.",
      issue: "Buries the ownership",
      rewrite:
        "Ran 12 usability sessions with finance teams, then translated the findings into a billing flow that reduced support tickets by [X]%.",
      why: "Shows research rigor and connects the work to a business result.",
    },
    {
      original:
        "Worked on the design system and maintained components used by the team.",
      issue: "Vague scope, no scale",
      rewrite:
        "Scaled a 40-component design system used by 6 product teams, cutting new-screen build time by [X]% and reducing visual QA defects by [Y]%.",
      why: "Quantifies the system's reach and ties it to delivery speed.",
    },
  ],
  strengths: [
    "Your research-to-design loop is clear: 20+ usability sessions, synthesis, and shipped changes.",
    "Enterprise analytics context maps directly to Northwind's B2B customer base.",
    "You name the people you worked with — product, engineering, and design — not just deliverables.",
    "Standard headings and a one-page flow make the resume easy to scan and parse.",
  ],
  sectionFeedback: [
    {
      section: "Summary",
      score: 64,
      feedback:
        "Your summary is clear but generic. Lead with the role, domain, and the outcome you drive; cut the process line.",
    },
    {
      section: "Experience",
      score: 78,
      feedback:
        "Strong scope and ownership. Only 2 of 10 bullets have numbers; add outcomes to the Atlas and billing bullets first.",
    },
    {
      section: "Skills",
      score: 72,
      feedback:
        "Figma, research, and prototyping are covered. Add accessibility and design tokens only if you can discuss them.",
    },
    {
      section: "Education",
      score: 86,
      feedback: "Clear and appropriately brief for a senior role.",
    },
    {
      section: "Formatting",
      score: 90,
      feedback:
        "One page, standard headings, easy to parse. The portfolio link is easy to find.",
    },
  ],
  atsChecks: [
    {
      label: "Contact details",
      status: "pass",
      detail: "Email, phone, and location are in the header.",
    },
    {
      label: "Standard headings",
      status: "pass",
      detail: "Summary, Experience, Skills, and Education all detected.",
    },
    {
      label: "File readability",
      status: "pass",
      detail: "Text-based PDF; no tables or columns blocking the parse.",
    },
    {
      label: "Keyword coverage",
      status: "warn",
      detail: "17 of 24 key terms matched; 2 must-haves are missing.",
    },
    {
      label: "Dates and titles",
      status: "pass",
      detail: "Every role has a title, company, and date range.",
    },
    {
      label: "Links",
      status: "pass",
      detail: "Portfolio URL detected in the header.",
    },
    {
      label: "Length",
      status: "pass",
      detail: "One page, roughly 338 words.",
    },
  ],
  actionPlan: [
    {
      title: "Rewrite your two strongest bullets with outcomes",
      detail:
        "Start with Atlas onboarding and billing. Use the real activation, time-to-value, or ticket numbers.",
      effort: "30 min",
    },
    {
      title: "Add the must-have language you can back up",
      detail:
        "Accessibility and WCAG 2.2 appear in the posting. Add the exact language where it's true.",
      effort: "20 min",
    },
    {
      title: "Write a two-line summary for this role",
      detail:
        "Name the role, your domain, and the outcome you drive. Skip the objective language.",
      effort: "15 min",
    },
    {
      title: "Put the most relevant work first",
      detail:
        "Lead the Northstar section with the Atlas redesign and billing work; move maintenance bullets lower.",
      effort: "5 min",
    },
    {
      title: "Run a final ATS and truth pass",
      detail:
        "Save as a text-based PDF, keep standard headings, and remove anything you can't defend in an interview.",
      effort: "10 min",
    },
  ],
};

export const SAMPLE_REVIEW: ReviewRecord = {
  id: "sample",
  createdAt: "2026-11-24T09:30:00.000Z",
  fileName: "Maya-Chen-Senior-Product-Designer.pdf",
  mode: "sample",
  jobDescription: SAMPLE_JOB_DESCRIPTION,
  analysis: SAMPLE_ANALYSIS,
};

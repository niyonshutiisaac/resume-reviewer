import { z } from "zod";
import type { Analysis } from "@/lib/types";

export const analysisSchema = z.object({
  candidateName: z.string().trim().min(1).max(120),
  targetRole: z.string().trim().min(1).max(160),
  company: z.string().trim().max(160).optional().default(""),
  overallScore: z.number().min(0).max(100),
  verdict: z.string().trim().min(20).max(1200),
  scoreBreakdown: z
    .array(
      z.object({
        label: z.string().trim().min(2).max(80),
        score: z.number().min(0).max(100),
        note: z.string().trim().max(400),
      }),
    )
    .min(3)
    .max(7),
  keywords: z
    .array(
      z.object({
        keyword: z.string().trim().min(1).max(100),
        status: z.enum(["matched", "partial", "missing"]),
        importance: z.enum(["must-have", "important", "nice-to-have"]),
        note: z.string().trim().max(400),
      }),
    )
    .min(5)
    .max(32),
  missingSkills: z
    .array(
      z.object({
        skill: z.string().trim().min(1).max(100),
        severity: z.enum(["critical", "important", "optional"]),
        why: z.string().trim().max(400),
      }),
    )
    .min(1)
    .max(10),
  bulletRewrites: z
    .array(
      z.object({
        original: z.string().trim().min(10).max(600),
        issue: z.string().trim().max(160),
        rewrite: z.string().trim().min(10).max(600),
        why: z.string().trim().max(400),
      }),
    )
    .min(1)
    .max(6),
  strengths: z.array(z.string().trim().min(5).max(400)).min(2).max(7),
  sectionFeedback: z
    .array(
      z.object({
        section: z.string().trim().min(2).max(60),
        score: z.number().min(0).max(100),
        feedback: z.string().trim().max(500),
      }),
    )
    .min(3)
    .max(9),
  atsChecks: z
    .array(
      z.object({
        label: z.string().trim().min(2).max(80),
        status: z.enum(["pass", "warn", "fail"]),
        detail: z.string().trim().max(400),
      }),
    )
    .min(4)
    .max(10),
  actionPlan: z
    .array(
      z.object({
        title: z.string().trim().min(3).max(140),
        detail: z.string().trim().max(500),
        effort: z.string().trim().max(40),
      }),
    )
    .min(3)
    .max(8),
});

export function parseAnalysis(value: unknown): Analysis | null {
  const result = analysisSchema.safeParse(value);
  if (!result.success) {
    console.warn(
      "[analysis] Review failed validation:",
      result.error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; "),
    );
    return null;
  }
  return result.data as Analysis;
}

export function isCompleteAnalysis(analysis: Analysis): boolean {
  return (
    analysis.keywords.length >= 6 &&
    analysis.bulletRewrites.length >= 1 &&
    analysis.atsChecks.length >= 4 &&
    analysis.scoreBreakdown.length >= 3 &&
    analysis.actionPlan.length >= 3
  );
}

const stringProperty = (description?: string) => ({
  type: "STRING",
  ...(description ? { description } : {}),
});

const scoreProperty = (description: string) => ({
  type: "NUMBER",
  description,
});

export const geminiResponseSchema = {
  type: "OBJECT",
  properties: {
    candidateName: stringProperty("The candidate's name exactly as it appears on the resume. Use 'Your resume' if no name is found."),
    targetRole: stringProperty("The job title from the job description."),
    company: stringProperty("The hiring company from the job description. Use an empty string if none is named."),
    overallScore: scoreProperty("Overall match score from 0 to 100, calibrated against the role. 85+ exceptional, 70-84 strong, 55-69 mixed, below 55 weak."),
    verdict: stringProperty("Two or three direct, specific sentences summarising fit, evidence, and the biggest gap. No hype, no emojis."),
    scoreBreakdown: {
      type: "ARRAY",
      description: "Five scored categories: Keyword alignment, Impact & metrics, Clarity & structure, ATS readiness, Role relevance.",
      items: {
        type: "OBJECT",
        properties: {
          label: stringProperty("Category label."),
          score: scoreProperty("Category score from 0 to 100."),
          note: stringProperty("One short sentence explaining the score with evidence."),
        },
        required: ["label", "score", "note"],
      },
    },
    keywords: {
      type: "ARRAY",
      description: "18 to 26 exact, role-relevant keywords and phrases drawn from the job description.",
      items: {
        type: "OBJECT",
        properties: {
          keyword: stringProperty("The keyword or short phrase."),
          status: { type: "STRING", enum: ["matched", "partial", "missing"] },
          importance: { type: "STRING", enum: ["must-have", "important", "nice-to-have"] },
          note: stringProperty("One sentence of evidence from the resume, or a specific placement suggestion for a gap."),
        },
        required: ["keyword", "status", "importance", "note"],
      },
    },
    missingSkills: {
      type: "ARRAY",
      description: "Three to five broader skills the candidate appears to lack, distinct from exact keyword gaps.",
      items: {
        type: "OBJECT",
        properties: {
          skill: stringProperty("Skill name."),
          severity: { type: "STRING", enum: ["critical", "important", "optional"] },
          why: stringProperty("Why it matters for this role, and how to add it truthfully."),
        },
        required: ["skill", "severity", "why"],
      },
    },
    bulletRewrites: {
      type: "ARRAY",
      description: "Three or four of the weakest resume bullets, with a stronger rewrite that preserves the original facts.",
      items: {
        type: "OBJECT",
        properties: {
          original: stringProperty("The original bullet, quoted exactly and trimmed to at most 220 characters."),
          issue: stringProperty("A short label for the main weakness."),
          rewrite: stringProperty("A stronger bullet using a specific action verb and a measurable outcome. Use bracketed placeholders like [X%] when the resume has no metric."),
          why: stringProperty("One sentence explaining the improvement."),
        },
        required: ["original", "issue", "rewrite", "why"],
      },
    },
    strengths: {
      type: "ARRAY",
      description: "Three to five specific things the resume already does well, each grounded in evidence.",
      items: stringProperty(),
    },
    sectionFeedback: {
      type: "ARRAY",
      description: "Four to six sections: Summary, Experience, Skills, Education, Formatting, Projects.",
      items: {
        type: "OBJECT",
        properties: {
          section: stringProperty("Section name."),
          score: scoreProperty("Section score from 0 to 100."),
          feedback: stringProperty("One or two sentences of specific, actionable feedback."),
        },
        required: ["section", "score", "feedback"],
      },
    },
    atsChecks: {
      type: "ARRAY",
      description: "Six to eight ATS checks: contact details, standard headings, file readability, keyword coverage, dates and titles, links, length.",
      items: {
        type: "OBJECT",
        properties: {
          label: stringProperty("Check name."),
          status: { type: "STRING", enum: ["pass", "warn", "fail"] },
          detail: stringProperty("One sentence explaining the result."),
        },
        required: ["label", "status", "detail"],
      },
    },
    actionPlan: {
      type: "ARRAY",
      description: "Exactly five prioritised edits, ordered by impact.",
      items: {
        type: "OBJECT",
        properties: {
          title: stringProperty("Short imperative title."),
          detail: stringProperty("What to do, specifically."),
          effort: stringProperty("A realistic time estimate, e.g. '15 min'."),
        },
        required: ["title", "detail", "effort"],
      },
    },
  },
  required: [
    "candidateName",
    "targetRole",
    "company",
    "overallScore",
    "verdict",
    "scoreBreakdown",
    "keywords",
    "missingSkills",
    "bulletRewrites",
    "strengths",
    "sectionFeedback",
    "atsChecks",
    "actionPlan",
  ],
  propertyOrdering: [
    "candidateName",
    "targetRole",
    "company",
    "overallScore",
    "verdict",
    "scoreBreakdown",
    "keywords",
    "missingSkills",
    "bulletRewrites",
    "strengths",
    "sectionFeedback",
    "atsChecks",
    "actionPlan",
  ],
};

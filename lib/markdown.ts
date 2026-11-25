import { matchLabel, type ReviewRecord } from "@/lib/types";
import { formatDate } from "@/lib/format";

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function reviewToMarkdown(review: ReviewRecord): string {
  const { analysis } = review;
  const label = matchLabel(analysis.overallScore);
  const roleLine = [analysis.targetRole, analysis.company].filter(Boolean).join(" at ");
  const lines: string[] = [];

  lines.push(`# Resume review — ${analysis.candidateName}`);
  lines.push("");
  lines.push(`**Role:** ${roleLine || "Not specified"}  `);
  lines.push(`**Reviewed:** ${formatDate(review.createdAt)}  `);
  lines.push(`**Match:** ${analysis.overallScore}/100 — ${label.label}`);
  if (review.mode !== "gemini") {
    lines.push(`**Mode:** ${review.mode === "sample" ? "Sample report" : "Local analysis"}`);
  }
  lines.push("");
  lines.push("## Recruiter's read");
  lines.push("");
  lines.push(analysis.verdict);
  lines.push("");

  lines.push("## Score breakdown");
  lines.push("");
  lines.push("| Category | Score | Note |");
  lines.push("| --- | ---: | --- |");
  for (const item of analysis.scoreBreakdown) {
    lines.push(`| ${escapeCell(item.label)} | ${item.score}/100 | ${escapeCell(item.note)} |`);
  }
  lines.push("");

  lines.push("## Keywords");
  lines.push("");
  const matched = analysis.keywords.filter((keyword) => keyword.status === "matched");
  const partial = analysis.keywords.filter((keyword) => keyword.status === "partial");
  const missing = analysis.keywords.filter((keyword) => keyword.status === "missing");
  if (matched.length) {
    lines.push(`**Matched (${matched.length}):** ${matched.map((keyword) => keyword.keyword).join(", ")}`);
    lines.push("");
  }
  if (partial.length) {
    lines.push(`**Partial (${partial.length}):** ${partial.map((keyword) => keyword.keyword).join(", ")}`);
    lines.push("");
  }
  if (missing.length) {
    lines.push(`**Missing (${missing.length}):** ${missing.map((keyword) => keyword.keyword).join(", ")}`);
    lines.push("");
  }

  if (analysis.missingSkills.length) {
    lines.push("## Skills to add");
    lines.push("");
    for (const skill of analysis.missingSkills) {
      lines.push(`- **${skill.skill}** (${skill.severity}) — ${skill.why}`);
    }
    lines.push("");
  }

  if (analysis.bulletRewrites.length) {
    lines.push("## Bullet rewrites");
    lines.push("");
    lines.push("> Rewrites preserve your facts. Replace bracketed metrics with real numbers.");
    lines.push("");
    analysis.bulletRewrites.forEach((item, index) => {
      lines.push(`### ${index + 1}. ${item.issue}`);
      lines.push("");
      lines.push(`**Before:** ${item.original}`);
      lines.push("");
      lines.push(`**After:** ${item.rewrite}`);
      lines.push("");
      lines.push(`_Why it works:_ ${item.why}`);
      lines.push("");
    });
  }

  if (analysis.strengths.length) {
    lines.push("## What's working");
    lines.push("");
    for (const strength of analysis.strengths) {
      lines.push(`- ${strength}`);
    }
    lines.push("");
  }

  if (analysis.sectionFeedback.length) {
    lines.push("## Section feedback");
    lines.push("");
    for (const section of analysis.sectionFeedback) {
      lines.push(`### ${section.section} — ${section.score}/100`);
      lines.push("");
      lines.push(section.feedback);
      lines.push("");
    }
  }

  lines.push("## ATS checks");
  lines.push("");
  lines.push("| Check | Status | Detail |");
  lines.push("| --- | --- | --- |");
  for (const check of analysis.atsChecks) {
    lines.push(
      `| ${escapeCell(check.label)} | ${check.status.toUpperCase()} | ${escapeCell(check.detail)} |`,
    );
  }
  lines.push("");

  lines.push("## Action plan");
  lines.push("");
  analysis.actionPlan.forEach((step, index) => {
    lines.push(`${index + 1}. **${step.title}** (${step.effort}) — ${step.detail}`);
  });
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("Generated with Merit — a calmer way to review a resume before you apply.");

  return lines.join("\n");
}

export function reviewFileName(review: ReviewRecord): string {
  const name = slugify(review.analysis.candidateName || "resume");
  const role = slugify(review.analysis.targetRole || "review");
  return `merit-review-${name}-${role}.md`.replace(/-+/g, "-");
}

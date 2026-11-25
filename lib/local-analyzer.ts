import type {
  ActionStep,
  Analysis,
  AtsCheck,
  BulletRewrite,
  Importance,
  KeywordItem,
  MissingSkill,
  ScoreCategory,
  SectionFeedback,
  Severity,
} from "@/lib/types";
import { clampScore, sentenceCase, stripTrailingPeriod } from "@/lib/format";

interface SkillTerm {
  label: string;
  aliases: string[];
  related?: string[];
}

const SKILL_TERMS: SkillTerm[] = [
  // Design
  {
    label: "Design systems",
    aliases: ["design systems", "design system"],
    related: ["component library", "component libraries", "component system"],
  },
  { label: "Figma", aliases: ["figma"] },
  { label: "Sketch", aliases: ["sketch"] },
  {
    label: "Prototyping",
    aliases: ["prototyping", "prototype", "prototypes"],
  },
  {
    label: "User research",
    aliases: ["user research", "ux research", "design research", "user researcher", "research"],
    related: ["customer research", "discovery research"],
  },
  {
    label: "Usability testing",
    aliases: ["usability testing", "usability tests", "usability test", "usability sessions"],
    related: ["usability study", "usability studies"],
  },
  {
    label: "Customer interviews",
    aliases: ["customer interviews", "user interviews", "customer discovery interviews"],
    related: [
      "interviews",
      "discovery interviews",
      "usability sessions",
      "usability testing",
      "user research",
    ],
  },
  {
    label: "Information architecture",
    aliases: ["information architecture", "ia"],
  },
  {
    label: "Interaction design",
    aliases: ["interaction design", "interaction designer"],
  },
  {
    label: "Visual design",
    aliases: ["visual design", "visual designer"],
  },
  {
    label: "Design critique",
    aliases: ["design critique", "design critiques", "critique"],
  },
  {
    label: "Design ops",
    aliases: ["design ops", "design operations"],
    related: ["team rituals", "design rituals", "critique", "weekly critique", "design critique"],
  },
  {
    label: "Design tokens",
    aliases: ["design tokens", "design token"],
    related: ["token pipeline", "theme tokens", "design variables", "design system", "component library"],
  },
  {
    label: "Accessibility",
    aliases: ["accessibility", "accessible", "a11y"],
    related: ["inclusive design", "screen reader", "keyboard navigation"],
  },
  { label: "WCAG", aliases: ["wcag", "wcag 2.2", "wcag 2.1", "wcag aa"] },
  {
    label: "B2B SaaS",
    aliases: ["b2b saas", "b2b software", "enterprise saas"],
    related: ["b2b", "saas", "enterprise software"],
  },
  { label: "Storybook", aliases: ["storybook"] },
  {
    label: "Cross-functional collaboration",
    aliases: [
      "cross-functional collaboration",
      "cross functional collaboration",
      "cross-functional",
      "partnered with product and engineering",
      "partnered with product",
      "partnered with engineering",
    ],
    related: ["collaboration", "collaborated", "partnered", "partnering", "worked with"],
  },
  {
    label: "Stakeholder management",
    aliases: ["stakeholder management", "stakeholders", "stakeholder"],
  },
  {
    label: "Mentoring",
    aliases: ["mentoring", "mentored", "mentor", "mentorship"],
  },
  {
    label: "Design leadership",
    aliases: ["design leadership", "design lead", "lead designer", "led design", "lead design", "leading design"],
    related: ["leadership", "led a team", "mentored", "mentor", "design critique"],
  },
  {
    label: "Product strategy",
    aliases: ["product strategy"],
    related: ["strategy", "roadmap"],
  },
  {
    label: "Roadmap",
    aliases: ["roadmap", "roadmaps", "roadmapping"],
  },
  {
    label: "Agile",
    aliases: ["agile", "scrum", "kanban"],
  },
  { label: "Jira", aliases: ["jira"] },
  { label: "Notion", aliases: ["notion"] },
  { label: "Linear", aliases: ["linear"] },
  {
    label: "Design thinking",
    aliases: ["design thinking", "human-centered design", "human centered design"],
  },
  {
    label: "Journey mapping",
    aliases: ["journey mapping", "journey map", "customer journey"],
  },
  { label: "Personas", aliases: ["personas", "persona"] },
  { label: "A/B testing", aliases: ["a/b testing", "ab testing", "split testing"] },
  {
    label: "Product analytics",
    aliases: ["product analytics", "analytics", "amplitude", "mixpanel"],
    related: ["data-informed", "data informed", "metrics"],
  },
  {
    label: "Data-informed design",
    aliases: ["data-informed design", "data informed design", "data-driven design"],
  },
  { label: "Mobile design", aliases: ["mobile design", "mobile app design"] },
  { label: "Responsive design", aliases: ["responsive design"] },
  { label: "Wireframing", aliases: ["wireframing", "wireframes", "wireframe"] },

  // Engineering
  { label: "JavaScript", aliases: ["javascript", "js"] },
  { label: "TypeScript", aliases: ["typescript", "ts"] },
  { label: "React", aliases: ["react", "react.js", "reactjs"] },
  { label: "Next.js", aliases: ["next.js", "nextjs"] },
  { label: "Node.js", aliases: ["node.js", "nodejs", "node"] },
  { label: "Python", aliases: ["python"] },
  { label: "SQL", aliases: ["sql", "postgresql", "mysql"] },
  { label: "AWS", aliases: ["aws", "amazon web services"] },
  { label: "Docker", aliases: ["docker"] },
  { label: "Kubernetes", aliases: ["kubernetes", "k8s"] },
  { label: "GraphQL", aliases: ["graphql"] },
  { label: "REST API", aliases: ["rest api", "restful api", "rest apis"] },
  { label: "HTML", aliases: ["html", "html5"] },
  { label: "CSS", aliases: ["css", "css3"] },
  { label: "Tailwind CSS", aliases: ["tailwind", "tailwind css"] },
  { label: "Git", aliases: ["git", "github", "gitlab"] },
  { label: "CI/CD", aliases: ["ci/cd", "cicd", "continuous integration"] },
  { label: "Testing", aliases: ["unit testing", "integration testing", "test automation"] },
  { label: "Jest", aliases: ["jest"] },
  { label: "Playwright", aliases: ["playwright"] },
  { label: "Webflow", aliases: ["webflow"] },
  { label: "Framer", aliases: ["framer"] },
  { label: "API integration", aliases: ["api integration", "api integrations", "third-party api"] },
  { label: "Machine learning", aliases: ["machine learning", "ml"] },
  { label: "LLM", aliases: ["llm", "large language model", "large language models"] },
  { label: "Generative AI", aliases: ["generative ai", "genai"] },
  { label: "Prompt engineering", aliases: ["prompt engineering"] },

  // Product, marketing, operations
  { label: "Product management", aliases: ["product management", "product manager"] },
  { label: "Go-to-market", aliases: ["go-to-market", "go to market", "gtm"] },
  { label: "SEO", aliases: ["seo", "search engine optimization"] },
  { label: "Content strategy", aliases: ["content strategy", "content strategist"] },
  { label: "Copywriting", aliases: ["copywriting", "copywriter"] },
  { label: "Email marketing", aliases: ["email marketing"] },
  { label: "Salesforce", aliases: ["salesforce"] },
  { label: "HubSpot", aliases: ["hubspot"] },
  { label: "Google Analytics", aliases: ["google analytics", "ga4"] },
  { label: "Excel", aliases: ["excel", "spreadsheets"] },
  { label: "Tableau", aliases: ["tableau"] },
  { label: "Looker", aliases: ["looker"] },
  { label: "Power BI", aliases: ["power bi", "powerbi"] },
  { label: "Data analysis", aliases: ["data analysis", "data analyst"] },
  { label: "Financial modeling", aliases: ["financial modeling", "financial modelling"] },
  { label: "Project management", aliases: ["project management", "project manager"] },
  {
    label: "Communication",
    aliases: ["communication", "written communication"],
    related: ["stakeholder management", "documentation", "written"],
  },
  { label: "Leadership", aliases: ["leadership"] },
  { label: "Problem solving", aliases: ["problem solving", "problem-solving"] },
  {
    label: "Collaboration",
    aliases: ["collaboration", "collaborative"],
    related: ["partnered", "partnering", "worked with", "cross-functional", "collaborated"],
  },
  {
    label: "Finance or accounting",
    aliases: ["finance", "financial", "accounting", "accountant"],
    related: ["fintech", "billing", "payments"],
  },
];

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "could",
  "did", "do", "does", "for", "from", "had", "has", "have", "he", "her", "here",
  "him", "his", "how", "i", "if", "in", "into", "is", "it", "its", "just", "like",
  "may", "me", "more", "most", "my", "no", "not", "of", "on", "or", "our", "out",
  "over", "own", "she", "should", "so", "some", "such", "than", "that", "the",
  "their", "them", "then", "there", "these", "they", "this", "those", "through",
  "to", "too", "under", "up", "us", "very", "was", "we", "were", "what", "when",
  "where", "which", "while", "who", "why", "will", "with", "would", "you", "your",
  "about", "above", "after", "again", "all", "also", "am", "any", "because",
  "before", "being", "below", "between", "both", "during", "each", "few", "further",
  "get", "got", "make", "many", "much", "new", "now", "one", "only", "other",
  "per", "same", "see", "still", "take", "two", "use", "used", "using", "well",
  "work", "working", "role", "team", "teams", "company", "job", "description",
  "experience", "years", "year", "strong", "ability", "skills", "skill", "plus",
  "preferred", "required", "requirements", "responsibilities", "including", "etc",
  "looking", "looking for", "candidate", "ideal", "someone", "who", "help", "build",
  "building", "create", "creating", "develop", "developing", "lead", "leading",
  "partner", "partnering", "work with", "work closely", "closely", "across",
  "within", "including", "include", "includes", "ensure", "ensuring", "drive",
  "driving", "deliver", "delivering", "support", "supporting", "manage", "managing",
  "join", "joining", "opportunity", "benefits", "salary", "apply", "application",
  "location", "remote", "hybrid", "onsite", "full-time", "full time", "part-time",
  "contract", "equal", "employer", "diversity", "inclusive", "accommodation",
]);

const GENERIC_KEYWORDS = new Set([
  "product", "design", "team", "work", "experience", "years", "skills", "ability",
  "strong", "excellent", "great", "good", "new", "help", "build", "create", "lead",
  "partner", "customer", "customers", "business", "users", "user", "people",
  "company", "role", "job", "applications", "application", "candidate",
]);

const SENIORITY_PATTERN =
  /\b(senior|junior|staff|principal|lead|head|chief|vp|vice president|director|manager)\b/i;
const ROLE_END_PATTERN =
  /\b(designer|engineer|developer|manager|analyst|scientist|director|specialist|consultant|coordinator|architect|researcher|strategist|writer|producer|recruiter|administrator)\s*$/i;

const MUST_HAVE_PATTERN =
  /\b(required|requirement|requirements|must have|must-have|must|minimum|proficien|you have|you bring|what you.ll need|what we.re looking for|strong|experience with|fluency in|at least)\b/i;
const NICE_TO_HAVE_PATTERN =
  /\b(preferred|nice to have|nice-to-have|bonus|a plus|plus|familiarity|exposure to|desirable|ideally)\b/i;
const SECTION_MUST_PATTERN =
  /^(?:what we(?:'|’)re looking for|requirements?|qualifications?|must[- ]have|what you(?:'|’)ll need|you have|you bring)\b/i;
const SECTION_NICE_PATTERN =
  /^(?:nice to have|nice-to-have|preferred|bonus|a plus|plus|desirable)\b/i;

const WEAK_OPENERS: Array<{ pattern: RegExp; replacement: string; label: string }> = [
  { pattern: /^responsible for\s+/i, replacement: "", label: "“Responsible for” opener" },
  { pattern: /^worked on\s+/i, replacement: "Contributed to ", label: "“Worked on” opener" },
  { pattern: /^worked with\s+/i, replacement: "Partnered with ", label: "“Worked with” opener" },
  { pattern: /^helped (?:with|to)?\s*/i, replacement: "Supported ", label: "“Helped with” opener" },
  { pattern: /^assisted (?:with|in)?\s*/i, replacement: "Supported ", label: "“Assisted with” opener" },
  { pattern: /^participated in\s+/i, replacement: "Contributed to ", label: "“Participated in” opener" },
  { pattern: /^involved in\s+/i, replacement: "Contributed to ", label: "“Involved in” opener" },
  { pattern: /^tasked with\s+/i, replacement: "Owned ", label: "“Tasked with” opener" },
  { pattern: /^duties included\s+/i, replacement: "Delivered ", label: "Duty-list opener" },
];

const GERUNDS: Record<string, string> = {
  leading: "Led",
  managing: "Managed",
  building: "Built",
  creating: "Created",
  designing: "Designed",
  developing: "Developed",
  working: "Worked",
  running: "Ran",
  driving: "Drove",
  supporting: "Supported",
  coordinating: "Coordinated",
  launching: "Launched",
  delivering: "Delivered",
  improving: "Improved",
  maintaining: "Maintained",
  writing: "Wrote",
  testing: "Tested",
  analyzing: "Analyzed",
  collaborating: "Collaborated",
  partnering: "Partnered",
  optimizing: "Optimized",
  streamlining: "Streamlined",
  scaling: "Scaled",
  shipping: "Shipped",
  owning: "Owned",
  defining: "Defined",
  implementing: "Implemented",
  planning: "Planned",
  establishing: "Established",
  mentoring: "Mentored",
  hiring: "Hired",
  growing: "Grew",
  reducing: "Reduced",
  increasing: "Increased",
  automating: "Automated",
};

const METRIC_PATTERN = /(?<![A-Za-z])\d|%|\$/;
const STANDARD_SECTION_NAMES = ["Summary", "Experience", "Skills", "Education"];

const STRONG_VERB_PATTERN =
  /^(led|built|designed|launched|shipped|created|drove|owned|delivered|improved|increased|reduced|cut|scaled|streamlined|managed|mentored|partnered|ran|developed|implemented|established|grew|saved|generated|negotiated|coordinated|automated|transformed|accelerated|unblocked|introduced|redesigned|migrated|architected)\b/i;

const ACTION_VERB_LINE =
  /^(led|built|designed|launched|shipped|created|drove|owned|delivered|improved|increased|reduced|cut|scaled|streamlined|managed|mentored|partnered|ran|developed|implemented|established|grew|saved|generated|negotiated|coordinated|automated|transformed|accelerated|introduced|redesigned|migrated)\b/i;

const SECTION_PATTERNS: Array<{ key: string; pattern: RegExp }> = [
  { key: "Summary", pattern: /^(summary|profile|objective|about( me)?)\s*:?\s*$/i },
  {
    key: "Experience",
    pattern:
      /^(experience|work experience|professional experience|employment( history)?|relevant experience)\s*:?\s*$/i,
  },
  {
    key: "Skills",
    pattern: /^(skills|technical skills|core skills|core competencies|tools( &| and)? technologies)\s*:?\s*$/i,
  },
  { key: "Education", pattern: /^(education|academic background)\s*:?\s*$/i },
  { key: "Projects", pattern: /^(projects|selected projects|portfolio|side projects)\s*:?\s*$/i },
  {
    key: "Certifications",
    pattern: /^(certifications|certificates|licenses|licenses & certifications)\s*:?\s*$/i,
  },
];

const SKILL_GROUPS: Record<string, string> = {
  accessibility: "Accessibility auditing",
  wcag: "Accessibility auditing",
  "design tokens": "Design token workflow",
  "design systems": "Design system governance",
  "b2b saas": "B2B SaaS context",
  "finance or accounting": "Finance domain",
  "product analytics": "Product analytics",
  "data-informed design": "Data-informed design",
  "customer interviews": "Customer discovery",
  "design leadership": "People leadership",
  "stakeholder management": "Executive communication",
  "cross-functional collaboration": "Cross-functional leadership",
  "design ops": "Design operations",
  "measurable outcomes": "Outcome storytelling",
  storybook: "Storybook",
};

function normalizeText(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termRegex(term: string): RegExp {
  const escaped = escapeRegExp(term).replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu");
}

function containsTerm(text: string, term: string): boolean {
  if (!term.trim()) return false;
  return termRegex(term).test(text);
}

function countTerm(text: string, term: string): number {
  if (!term.trim()) return 0;
  const matches = text.match(new RegExp(termRegex(term).source, "giu"));
  return matches?.length ?? 0;
}

function findSnippet(text: string, terms: string[], maxLength = 120): string | null {
  const lines = text.split("\n");
  for (const line of lines) {
    for (const term of terms) {
      if (!containsTerm(line, term)) continue;
      const trimmed = line.replace(/^[\s•●▪◦‣·\-–—*]+/, "").trim();
      if (!trimmed) continue;
      if (trimmed.length <= maxLength) return trimmed;
      const index = trimmed.toLowerCase().indexOf(term.toLowerCase());
      const start = Math.max(0, index - 38);
      const end = Math.min(trimmed.length, index + 78);
      return `${start > 0 ? "…" : ""}${trimmed.slice(start, end).trim()}${end < trimmed.length ? "…" : ""}`;
    }
  }
  return null;
}

function sectionKindForLine(lines: string[], lineIndex: number): Importance | null {
  let current: Importance | null = null;
  for (let index = 0; index <= lineIndex; index += 1) {
    const trimmed = lines[index]?.trim() ?? "";
    if (!trimmed || trimmed.length > 72 || /[.!?]$/.test(trimmed)) continue;
    if (SECTION_NICE_PATTERN.test(trimmed)) current = "nice-to-have";
    else if (SECTION_MUST_PATTERN.test(trimmed)) current = "must-have";
  }
  return current;
}

function determineImportance(jd: string, terms: string[]): Importance {
  const lines = jd.split("\n");
  let hasMust = false;
  let hasNice = false;

  lines.forEach((line, index) => {
    if (!terms.some((term) => containsTerm(line, term))) return;
    const section = sectionKindForLine(lines, index);
    if (section === "must-have") {
      hasMust = true;
      return;
    }
    if (section === "nice-to-have") {
      hasNice = true;
      return;
    }
    if (MUST_HAVE_PATTERN.test(line)) {
      hasMust = true;
      return;
    }
    if (NICE_TO_HAVE_PATTERN.test(line)) {
      hasNice = true;
    }
  });

  if (hasMust) return "must-have";
  if (hasNice) return "nice-to-have";
  return "important";
}

function findFirstMatch(text: string, terms: string[]): string | null {
  for (const term of terms) {
    if (containsTerm(text, term)) return term;
  }
  return null;
}

function extractCandidateName(resume: string): string {
  const lines = resume
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);

  for (const line of lines) {
    if (/@|https?:\/\/|www\.|\d{3}/i.test(line)) continue;
    if (/\b(resume|curriculum vitae|cv|profile|summary|experience|education|skills)\b/i.test(line)) {
      continue;
    }
    const cleaned = line.replace(/[|,].*$/, "").trim();
    const words = cleaned.split(/\s+/);
    if (words.length < 2 || words.length > 4) continue;
    if (!words.every((word) => /^[A-Z][\p{L}'’.-]*$/u.test(word))) continue;
    if (cleaned.length > 48) continue;
    return cleaned;
  }

  return "Your resume";
}

function extractRoleAndCompany(jd: string): { targetRole: string; company: string } {
  const lines = jd
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const firstLines = lines.slice(0, 8);

  let targetRole = "";
  const roleLine = jd.match(/^(?:job title|role|position)\s*[:\-–]\s*(.+)$/im);
  if (roleLine?.[1]) {
    targetRole = roleLine[1].trim().slice(0, 90);
  }

  if (!targetRole) {
    const roleWords =
      /(designer|engineer|developer|manager|analyst|scientist|marketer|director|lead|specialist|consultant|coordinator|architect|accountant|nurse|teacher|writer|producer|researcher|strategist|recruiter|administrator)/i;
    targetRole =
      firstLines.find(
        (line) =>
          line.length >= 3 &&
          line.length <= 90 &&
          roleWords.test(line) &&
          !/@|https?:\/\//i.test(line),
      ) ?? "";
  }

  if (!targetRole) {
    const first = firstLines[0];
    if (first && first.length <= 90 && !/@|https?:\/\//i.test(first)) {
      targetRole = first;
    }
  }

  let company = "";
  const companyLine = jd.match(/^(?:company|organization|employer)\s*[:\-–]\s*(.+)$/im);
  if (companyLine?.[1]) {
    company = companyLine[1].trim().slice(0, 80);
  }

  if (!company) {
    const atMatch = jd
      .slice(0, 700)
      .match(/\bat\s+([A-Z][\p{L}\d&.'-]*(?:\s+[A-Z][\p{L}\d&.'-]*){0,3})/u);
    if (atMatch?.[1] && !/^(least|the|a|an)$/i.test(atMatch[1])) {
      company = atMatch[1].trim();
    }
  }

  if (!company) {
    for (const line of firstLines.slice(0, 4)) {
      const parts = line.split(/\s+[—–-]\s+/);
      if (parts.length >= 2) {
        const left = parts[0].trim();
        const right = parts.slice(1).join(" — ").trim();
        const looksLikeLocation =
          /\b(remote|hybrid|onsite|on-site|san francisco|new york|seattle|austin|london|berlin|paris|toronto|chicago|boston|los angeles|ca|ny|uk)\b/i.test(
            right,
          );
        if (looksLikeLocation && left.length >= 2 && left.length <= 60) {
          company = left;
          break;
        }
        if (left.length >= 2 && left.length <= 60 && !/\b(role|position|job)\b/i.test(left)) {
          company = left;
          break;
        }
      }
    }
  }

  return {
    targetRole: targetRole ? sentenceCase(targetRole.replace(/^job description\s*[:\-–]?\s*/i, "")) : "the role",
    company: company ? sentenceCase(company) : "",
  };
}

interface KeywordCandidate {
  label: string;
  aliases: string[];
  related: string[];
  occurrences: number;
  importance: Importance;
  rank: number;
}

function buildKeywordCandidates(jd: string): KeywordCandidate[] {
  const candidates: KeywordCandidate[] = [];
  const seen = new Set<string>();

  for (const term of SKILL_TERMS) {
    const allTerms = [...term.aliases, ...(term.related ?? [])];
    const occurrences = allTerms.reduce((sum, alias) => sum + countTerm(jd, alias), 0);
    if (occurrences === 0) continue;
    const key = term.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const importance = determineImportance(jd, allTerms);
    const rank =
      occurrences * 2 +
      (importance === "must-have" ? 6 : importance === "important" ? 3 : 1);
    candidates.push({
      label: term.label,
      aliases: term.aliases,
      related: term.related ?? [],
      occurrences,
      importance,
      rank,
    });
  }

  // Add domain phrases the dictionary does not know about.
  const phraseCounts = new Map<string, { display: string; count: number }>();
  const lines = jd
    .split("\n")
    .map((line) => line.replace(/^[\s•●▪◦‣·\-–—*]+/, "").trim())
    .filter((line) => line.length > 2);

  for (const line of lines) {
    const originalWords = line
      .replace(/[^A-Za-z0-9+#./' -]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const words = originalWords.map((word) => word.toLowerCase());
    for (let size = 2; size <= 3; size += 1) {
      for (let i = 0; i <= words.length - size; i += 1) {
        const parts = words.slice(i, i + size);
        if (parts.some((part) => part.length < 3 || STOPWORDS.has(part))) continue;
        if (parts.every((part) => GENERIC_KEYWORDS.has(part))) continue;
        const phrase = parts.join(" ");
        if (phrase.length < 8 || phrase.length > 46) continue;
        if (SENIORITY_PATTERN.test(phrase) || ROLE_END_PATTERN.test(phrase)) continue;
        const capitalizedWords = originalWords
          .slice(i, i + size)
          .filter((word) => /^[A-Z][a-z]/.test(word)).length;
        if (capitalizedWords >= 2) continue;
        if (candidates.some((candidate) => candidate.label.toLowerCase().includes(phrase))) {
          continue;
        }
        const existing = phraseCounts.get(phrase);
        if (existing) existing.count += 1;
        else phraseCounts.set(phrase, { display: sentenceCase(phrase), count: 1 });
      }
    }
  }

  const frequentPhrases = Array.from(phraseCounts.values())
    .filter((entry) => entry.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  for (const phrase of frequentPhrases) {
    const key = phrase.display.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    candidates.push({
      label: phrase.display,
      aliases: [phrase.display.toLowerCase()],
      related: [],
      occurrences: phrase.count,
      importance: determineImportance(jd, [phrase.display.toLowerCase()]),
      rank: phrase.count * 2 + 2,
    });
  }

  if (candidates.length < 10) {
    const wordCounts = new Map<string, number>();
    for (const line of lines) {
      for (const word of line
        .toLowerCase()
        .replace(/[^a-z0-9+#./' -]/g, " ")
        .split(/\s+/)) {
        if (word.length < 4 || STOPWORDS.has(word) || GENERIC_KEYWORDS.has(word)) continue;
        wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
      }
    }
    for (const [word, count] of Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)) {
      if (seen.has(word)) continue;
      seen.add(word);
      candidates.push({
        label: sentenceCase(word),
        aliases: [word],
        related: [],
        occurrences: count,
        importance: determineImportance(jd, [word]),
        rank: count,
      });
    }
  }

  candidates.sort((a, b) => b.rank - a.rank);
  const selected = candidates.slice(0, 24);

  if (!selected.some((candidate) => candidate.importance === "must-have")) {
    selected.slice(0, 3).forEach((candidate) => {
      candidate.importance = "must-have";
    });
  }

  return selected;
}

function buildKeywords(resume: string, jd: string): KeywordItem[] {
  const candidates = buildKeywordCandidates(jd);
  return candidates.map((candidate) => {
    const allTerms = [...candidate.aliases, ...candidate.related];
    const exact = findFirstMatch(resume, candidate.aliases);
    const related = findFirstMatch(resume, candidate.related);
    const status = exact ? "matched" : related ? "partial" : "missing";
    const snippet = exact
      ? findSnippet(resume, candidate.aliases)
      : related
        ? findSnippet(resume, candidate.related)
        : null;

    let note: string;
    if (status === "matched") {
      note = snippet
        ? `Found in your resume: “${snippet}”`
        : "Mentioned in your resume.";
    } else if (status === "partial") {
      note = snippet
        ? `Related experience found: “${snippet}” Mirror the posting's exact wording.`
        : "Related experience found. Mirror the posting's exact wording.";
    } else {
      note =
        candidate.importance === "must-have"
          ? "Not found. The posting lists this as a must-have; add it only if it is true."
          : candidate.importance === "nice-to-have"
            ? "Not found. A nice-to-have; add it only if you have real experience."
            : "Not found. Add it where you have real evidence.";
    }

    return {
      keyword: candidate.label,
      status,
      importance: candidate.importance,
      note: note.slice(0, 260),
    } satisfies KeywordItem;
  });
}

function detectSections(resume: string): Record<string, string[]> {
  const lines = resume.split("\n");
  const sections: Record<string, string[]> = {};
  let current: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const heading = SECTION_PATTERNS.find((entry) => entry.pattern.test(trimmed));
    if (heading) {
      current = heading.key;
      sections[current] = sections[current] ?? [];
      continue;
    }
    if (current) sections[current].push(trimmed);
  }

  return sections;
}

function extractBullets(resume: string): string[] {
  const bullets: string[] = [];
  const seen = new Set<string>();
  const lines = resume.split("\n");

  for (const line of lines) {
    const match = line.match(/^\s*[•●▪◦‣·]\s*(.+)$/) || line.match(/^\s*[-–—*]\s+(.+)$/);
    if (!match?.[1]) continue;
    const value = match[1].trim();
    if (value.length < 18) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    bullets.push(value.slice(0, 420));
  }

  if (bullets.length < 3) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length < 50 || trimmed.length > 260) continue;
      if (!ACTION_VERB_LINE.test(trimmed)) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      bullets.push(trimmed.slice(0, 420));
    }
  }

  return bullets;
}

function toPastTense(value: string): string {
  const [first, ...rest] = value.split(/\s+/);
  if (!first) return value;
  const lower = first.toLowerCase();
  if (GERUNDS[lower]) {
    return [GERUNDS[lower], ...rest].join(" ");
  }
  if (lower.endsWith("ing") && lower.length > 5) {
    const stem = lower.slice(0, -3);
    const past = stem.endsWith("e") ? `${stem}d` : `${stem}ed`;
    return [sentenceCase(past), ...rest].join(" ");
  }
  return value;
}

function outcomePrompt(verb: string): string {
  const normalized = verb.toLowerCase();
  if (/^(built|created|designed|launched|shipped|introduced|implemented|developed)/.test(normalized)) {
    return ", adopted by [X] users and improving [key metric] by [X%].";
  }
  if (/^(supported|contributed|partnered|collaborated|helped)/.test(normalized)) {
    return ", contributing to a [X%] improvement in [key metric].";
  }
  if (/^(reduced|improved|increased|cut|saved|accelerated|streamlined)/.test(normalized)) {
    return " by [X%].";
  }
  return ", resulting in a [X%] improvement in [key metric].";
}

function rewriteBullet(original: string): { rewrite: string; issue: string; why: string } {
  let value = original.trim().replace(/[.!?]+$/, "");
  let weakLabel: string | null = null;

  for (const opener of WEAK_OPENERS) {
    if (opener.pattern.test(value)) {
      value = value.replace(opener.pattern, "").trim();
      weakLabel = opener.label;
      value = toPastTense(value);
      break;
    }
  }

  value = value.charAt(0).toUpperCase() + value.slice(1);
  const hasMetric = METRIC_PATTERN.test(value);
  const firstVerb = value.split(/\s+/)[0] ?? "";
  let rewrite = value;

  if (!hasMetric) {
    rewrite = `${stripTrailingPeriod(value)}${outcomePrompt(firstVerb)}`;
  }

  if (rewrite.length > 300) {
    rewrite = `${rewrite.slice(0, 297).trim()}…`;
  }

  const issue = weakLabel
    ? weakLabel
    : !hasMetric
      ? "No measurable outcome"
      : original.length > 220
        ? "Hard to scan"
        : "Buries the impact";

  const why = hasMetric
    ? "Keeps your number and makes the ownership explicit."
    : "Leads with ownership and ends with an outcome. Replace the bracketed metric with your real number.";

  return { rewrite, issue, why };
}

function buildRewrites(bullets: string[]): BulletRewrite[] {
  if (bullets.length === 0) return [];

  const scored = bullets.map((bullet) => {
    let weakness = 0;
    if (WEAK_OPENERS.some((opener) => opener.pattern.test(bullet))) weakness += 3;
    if (!METRIC_PATTERN.test(bullet)) weakness += 2;
    if (!STRONG_VERB_PATTERN.test(bullet)) weakness += 1;
    if (bullet.length > 220) weakness += 1;
    if (bullet.length < 45) weakness += 1;
    if (STRONG_VERB_PATTERN.test(bullet)) weakness -= 1;
    if (METRIC_PATTERN.test(bullet)) weakness -= 1;
    return { bullet, weakness };
  });

  return scored
    .sort((a, b) => b.weakness - a.weakness)
    .slice(0, 3)
    .map(({ bullet }) => {
      const rewritten = rewriteBullet(bullet);
      return {
        original: bullet,
        issue: rewritten.issue,
        rewrite: rewritten.rewrite,
        why: rewritten.why,
      } satisfies BulletRewrite;
    });
}

function buildAtsChecks(
  resume: string,
  keywords: KeywordItem[],
  sections: Record<string, string[]>,
  bullets: string[],
): AtsCheck[] {
  const email = /[\w.+-]+@[\w-]+\.[\w.-]+/i.test(resume);
  const phone = /(\+?\d[\d\s().-]{7,}\d)/.test(resume);
  const resumeWithoutEmails = resume.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, " ");
  const links =
    /(https?:\/\/|www\.|linkedin\.com|github\.com|behance\.net|dribbble\.com|\b[a-z0-9][a-z0-9-]*\.(?:design|com|io|me|dev|net|org|co|xyz|so|portfolio)\b)/i.test(
      resumeWithoutEmails,
    );
  const years = resume.match(/\b(?:19|20)\d{2}\b/g) ?? [];
  const words = resume.split(/\s+/).filter(Boolean).length;
  const sectionCount = Object.keys(sections).filter((key) =>
    STANDARD_SECTION_NAMES.includes(key),
  ).length;
  const counts = {
    matched: keywords.filter((keyword) => keyword.status === "matched").length,
    total: keywords.length,
  };
  const coverage = counts.total ? counts.matched / counts.total : 0;
  const weirdCharacters = (resume.match(/\uFFFD/g) ?? []).length;

  const checks: AtsCheck[] = [
    {
      label: "Contact details",
      status: email && phone ? "pass" : email || phone ? "warn" : "fail",
      detail:
        email && phone
          ? "Email and phone are easy to find."
          : email || phone
            ? "One contact method is missing; add both email and phone."
            : "No email or phone found in the resume text.",
    },
    {
      label: "Standard headings",
      status: sectionCount >= 3 ? "pass" : sectionCount >= 1 ? "warn" : "fail",
      detail:
        sectionCount >= 3
          ? `${sectionCount} standard sections detected.`
          : "Use standard headings such as Experience, Skills, and Education.",
    },
    {
      label: "File readability",
      status: weirdCharacters === 0 && resume.length > 200 ? "pass" : "warn",
      detail:
        weirdCharacters === 0
          ? "The resume text extracted cleanly."
          : "Some characters did not extract cleanly; check the original file.",
    },
    {
      label: "Keyword coverage",
      status: coverage >= 0.65 ? "pass" : coverage >= 0.45 ? "warn" : "fail",
      detail: `${counts.matched} of ${counts.total} key terms matched.`,
    },
    {
      label: "Dates and titles",
      status: years.length >= 2 ? "pass" : "warn",
      detail:
        years.length >= 2
          ? "Multiple dated roles detected."
          : "Add clear dates to each role so the parser can build a timeline.",
    },
    {
      label: "Links",
      status: links ? "pass" : "warn",
      detail: links
        ? "A portfolio or profile link was detected."
        : "No portfolio or LinkedIn URL found. Add one near your contact details.",
    },
    {
      label: "Length",
      status: words >= 300 && words <= 900 ? "pass" : words >= 200 && words <= 1100 ? "warn" : "fail",
      detail: `Roughly ${words} words and ${bullets.length} bullets.`,
    },
  ];

  return checks;
}

function buildSectionFeedback(
  sections: Record<string, string[]>,
  keywords: KeywordItem[],
  bullets: string[],
  atsChecks: AtsCheck[],
  wordCount: number,
): SectionFeedback[] {
  const feedback: SectionFeedback[] = [];
  const matched = keywords.filter((keyword) => keyword.status === "matched");
  const missing = keywords.filter((keyword) => keyword.status === "missing");
  const metrics = bullets.filter((bullet) => METRIC_PATTERN.test(bullet)).length;

  const summary = sections.Summary?.join(" ") ?? "";
  if (summary) {
    const summaryScore = clampScore(
      55 +
        (summary.length >= 80 && summary.length <= 420 ? 15 : 0) +
        (matched.some((keyword) => containsTerm(summary, keyword.keyword)) ? 10 : 0) +
        (summary.length <= 260 ? 5 : 0),
    );
    feedback.push({
      section: "Summary",
      score: summaryScore,
      feedback:
        summaryScore >= 75
          ? "Clear and relevant. Keep it to two lines and mirror the role's language."
          : `Your summary describes what you do, not the role you want. Rewrite it around ${matched
              .slice(0, 2)
              .map((keyword) => keyword.keyword)
              .join(" and ") || "the role's core skills"} in two lines.`,
    });
  } else {
    feedback.push({
      section: "Summary",
      score: 40,
      feedback:
        "No summary found. Add two lines that name the role, your domain, and the outcome you drive.",
    });
  }

  const experience = sections.Experience ?? [];
  if (experience.length) {
    const experienceScore = clampScore(
      58 +
        (bullets.length >= 4 ? 10 : 0) +
        (metrics >= 2 ? 10 : 0) +
        (STRONG_VERB_PATTERN.test(experience.join(" ")) ? 4 : 0) -
        (bullets.length > 10 ? 5 : 0),
    );
    feedback.push({
      section: "Experience",
      score: experienceScore,
      feedback:
        metrics < 2
          ? `${bullets.length} bullets found, but only ${metrics} include a number. Add outcomes to the top two.`
          : `Strong scope and ownership. ${metrics} of ${bullets.length} bullets include a number; keep each bullet focused on one result.`,
    });
  } else {
    feedback.push({
      section: "Experience",
      score: 42,
      feedback:
        "No experience section detected. Use a standard “Experience” heading so ATS and recruiters can parse it.",
    });
  }

  const skills = sections.Skills?.join(" ") ?? "";
  if (skills) {
    feedback.push({
      section: "Skills",
      score: clampScore(58 + (skills.length >= 40 ? 10 : 0) + (matched.length >= 5 ? 10 : 0)),
      feedback: `${matched.length} of ${keywords.length} key terms appear in your resume. Add ${
        missing.slice(0, 2).map((keyword) => keyword.keyword).join(" and ") || "role-specific tools"
      } only if you can discuss them.`,
    });
  } else {
    feedback.push({
      section: "Skills",
      score: 45,
      feedback:
        "No skills section detected. A short, specific list helps ATS match exact terms.",
    });
  }

  const education = sections.Education ?? [];
  feedback.push({
    section: "Education",
    score: education.length ? 84 : 45,
    feedback: education.length
      ? "Clear and appropriately brief. No changes needed unless the role asks for a specific credential."
      : "No education section found. Add it if the role requires a degree or certification.",
  });

  const passCount = atsChecks.filter((check) => check.status === "pass").length;
  const firstWarning = atsChecks.find((check) => check.status !== "pass");
  feedback.push({
    section: "Formatting",
    score: clampScore(45 + (passCount / Math.max(1, atsChecks.length)) * 50),
    feedback: `${passCount} of ${atsChecks.length} ATS checks passed.${
      firstWarning ? ` ${firstWarning.label}: ${firstWarning.detail}` : ""
    }`,
  });

  if (sections.Projects?.length) {
    feedback.push({
      section: "Projects",
      score: 72,
      feedback: "Keep projects only if they add evidence the experience section cannot.",
    });
  }

  return feedback.slice(0, 6);
}

function buildMissingSkills(keywords: KeywordItem[]): MissingSkill[] {
  const gaps = keywords
    .filter((keyword) => keyword.status !== "matched" && keyword.importance !== "nice-to-have")
    .slice(0, 5);

  const seen = new Set<string>();

  return gaps.flatMap((keyword) => {
    const key = keyword.keyword.toLowerCase();
    const skill = SKILL_GROUPS[key] ?? keyword.keyword;
    if (seen.has(skill)) return [];
    seen.add(skill);
    const severity: Severity =
      keyword.importance === "must-have" && keyword.status === "missing"
        ? "critical"
        : keyword.importance === "must-have"
          ? "important"
          : "optional";
    return [
      {
        skill,
        severity,
        why:
          keyword.status === "missing"
            ? `The posting lists this as a ${keyword.importance}. Add it where you have real evidence; never claim it without proof.`
            : "You have adjacent experience. Mirror the posting's exact language so the match is obvious.",
      } satisfies MissingSkill,
    ];
  });
}

function buildActionPlan(
  keywords: KeywordItem[],
  rewrites: BulletRewrite[],
  atsChecks: AtsCheck[],
): ActionStep[] {
  const gaps = keywords.filter(
    (keyword) => keyword.status !== "matched" && keyword.importance !== "nice-to-have",
  );
  const mustHaves = gaps.filter((keyword) => keyword.importance === "must-have");
  const firstWarning = atsChecks.find((check) => check.status !== "pass");
  const steps: ActionStep[] = [];

  if (mustHaves.length) {
    steps.push({
      title: "Add the must-have language you can back up",
      detail: `${mustHaves
        .slice(0, 3)
        .map((keyword) => keyword.keyword)
        .join(", ")} appear in the posting. Mirror the exact wording where it is true.`,
      effort: "20 min",
    });
  } else {
    steps.push({
      title: "Mirror the posting's exact language",
      detail:
        "Use the job description's terms in your summary and skills section so the match is obvious to a reader and an ATS.",
      effort: "15 min",
    });
  }

  steps.push({
    title: "Rewrite your weakest bullets with outcomes",
    detail: rewrites[0]
      ? `Start with “${rewrites[0].original.slice(0, 90)}${rewrites[0].original.length > 90 ? "…" : ""}” and add the real result.`
      : "Choose your two most important bullets and add a measurable result to each.",
    effort: "30 min",
  });

  steps.push({
    title: "Write a two-line summary for this role",
    detail:
      "Name the role, your domain, and the outcome you drive. Skip objective language and adjectives.",
    effort: "15 min",
  });

  if (firstWarning) {
    steps.push({
      title: `Fix the ${firstWarning.label.toLowerCase()} warning`,
      detail: firstWarning.detail,
      effort: "10 min",
    });
  } else {
    steps.push({
      title: "Move your strongest proof above the fold",
      detail:
        "Put your portfolio link, most relevant role, or best metric in the top third of the page.",
      effort: "10 min",
    });
  }

  steps.push({
    title: "Run a final ATS and truth pass",
    detail:
      "Save as a text-based PDF, keep standard headings, and remove anything you cannot defend in an interview.",
    effort: "10 min",
  });

  return steps.slice(0, 5);
}

function buildScoreBreakdown(
  keywords: KeywordItem[],
  bullets: string[],
  sections: Record<string, string[]>,
  atsChecks: AtsCheck[],
  wordCount: number,
): { scores: ScoreCategory[]; overall: number } {
  const matched = keywords.filter((keyword) => keyword.status === "matched").length;
  const partial = keywords.filter((keyword) => keyword.status === "partial").length;
  const total = keywords.length;
  const mustHaves = keywords.filter((keyword) => keyword.importance === "must-have");
  const mustHaveCovered = mustHaves.filter((keyword) => keyword.status !== "missing").length;
  const metrics = bullets.filter((bullet) => METRIC_PATTERN.test(bullet)).length;
  const strongVerbs = bullets.filter((bullet) => STRONG_VERB_PATTERN.test(bullet)).length;
  const weakOpeners = bullets.filter((bullet) => WEAK_OPENERS.some((opener) => opener.pattern.test(bullet))).length;
  const passCount = atsChecks.filter((check) => check.status === "pass").length;
  const sectionCount = Object.keys(sections).filter((key) =>
    STANDARD_SECTION_NAMES.includes(key),
  ).length;

  const keywordScore = clampScore(total ? ((matched + partial * 0.5) / total) * 100 : 50);
  const mustHaveScore = clampScore(
    mustHaves.length ? ((mustHaveCovered + partial * 0.25) / mustHaves.length) * 100 : keywordScore,
  );
  const impactScore = clampScore(
    36 + metrics * 9 + strongVerbs * 3 - weakOpeners * 2,
  );
  const clarityScore = clampScore(
    68 +
      (sectionCount >= 3 ? 12 : 0) +
      (wordCount >= 300 && wordCount <= 900 ? 8 : -10) +
      (bullets.length >= 4 ? 4 : 0),
  );
  const atsScore = clampScore((passCount / Math.max(1, atsChecks.length)) * 100);
  const relevanceScore = clampScore(keywordScore * 0.6 + mustHaveScore * 0.4);

  const overall = clampScore(
    keywordScore * 0.28 +
      mustHaveScore * 0.2 +
      impactScore * 0.18 +
      atsScore * 0.14 +
      clarityScore * 0.1 +
      relevanceScore * 0.1,
  );

  const scores: ScoreCategory[] = [
    {
      label: "Keyword alignment",
      score: keywordScore,
      note: `${matched} of ${total} key terms matched${partial ? `; ${partial} are partial` : ""}.`,
    },
    {
      label: "Impact & metrics",
      score: impactScore,
      note: `${metrics} of ${bullets.length || 0} bullets include a measurable outcome.`,
    },
    {
      label: "Clarity & structure",
      score: clarityScore,
      note: `${sectionCount} standard sections detected in roughly ${wordCount} words.`,
    },
    {
      label: "ATS readiness",
      score: atsScore,
      note: `${passCount} of ${atsChecks.length} checks passed.`,
    },
    {
      label: "Role relevance",
      score: relevanceScore,
      note: `${mustHaveCovered} of ${mustHaves.length} must-have requirements covered.`,
    },
  ];

  return { scores, overall };
}

function buildVerdict(
  overall: number,
  keywords: KeywordItem[],
  metrics: number,
  bullets: number,
): string {
  const matched = keywords.filter((keyword) => keyword.status === "matched");
  const missingMustHaves = keywords.filter(
    (keyword) => keyword.status === "missing" && keyword.importance === "must-have",
  );
  const partialMustHaves = keywords.filter(
    (keyword) => keyword.status === "partial" && keyword.importance === "must-have",
  );
  const topMatched = matched
    .slice(0, 2)
    .map((keyword) => keyword.keyword)
    .join(" and ");

  const opening =
    overall >= 80
      ? "You're a credible fit for this role."
      : overall >= 65
        ? "There's a real fit here, but the resume makes the reader work for it."
        : overall >= 50
          ? "The foundation is there, but this version isn't yet making the case for the role."
          : "This version needs a focused pass before you send it.";

  const coverage = `You cover ${matched.length} of ${keywords.length} key terms${
    topMatched ? `, including ${topMatched}` : ""
  }.`;

  const gap =
    missingMustHaves.length > 0
      ? `${missingMustHaves.length} must-have term${missingMustHaves.length === 1 ? " is" : "s are"} missing, starting with ${missingMustHaves[0].keyword}.`
      : partialMustHaves.length > 0
        ? `${partialMustHaves[0].keyword} is only partially covered.`
        : metrics < 2
          ? "Your bullets rarely show a measurable outcome."
          : "The summary could connect your experience to this role more directly.";

  return `${opening} ${coverage} The fastest lift: ${gap}`;
}

function buildStrengths(
  keywords: KeywordItem[],
  bullets: string[],
  sections: Record<string, string[]>,
  resume: string,
): string[] {
  const strengths: string[] = [];
  const matchedMustHaves = keywords.filter(
    (keyword) => keyword.status === "matched" && keyword.importance === "must-have",
  );
  const metrics = bullets.filter((bullet) => METRIC_PATTERN.test(bullet)).length;
  const sectionCount = Object.keys(sections).filter((key) =>
    STANDARD_SECTION_NAMES.includes(key),
  ).length;
  const hasContact = /[\w.+-]+@[\w-]+\.[\w.-]+/i.test(resume);

  if (matchedMustHaves.length >= 2) {
    strengths.push(
      `Covers ${matchedMustHaves
        .slice(0, 3)
        .map((keyword) => keyword.keyword)
        .join(", ")}, which the posting treats as core requirements.`,
    );
  }
  if (metrics >= 2) {
    strengths.push(`${metrics} bullets already include a measurable outcome.`);
  }
  if (sectionCount >= 3) {
    strengths.push("Standard section headings make the resume easy to scan and parse.");
  }
  if (hasContact) {
    strengths.push("Contact details are easy to find in the header.");
  }
  if (bullets.length >= 4) {
    strengths.push("There is enough bullet-level detail to start a conversation.");
  }
  if (strengths.length < 3) {
    strengths.push("The resume is concise enough to scan in under a minute.");
  }
  if (strengths.length < 3) {
    strengths.push("There is relevant experience to build on; the next step is sharper evidence.");
  }

  return strengths.slice(0, 5);
}

export interface LocalAnalysisInput {
  resumeText: string;
  jobDescription: string;
}

export function analyzeLocally({ resumeText, jobDescription }: LocalAnalysisInput): Analysis {
  const resume = normalizeText(resumeText);
  const jd = normalizeText(jobDescription);
  const candidateName = extractCandidateName(resume);
  const { targetRole, company } = extractRoleAndCompany(jd);
  const keywords = buildKeywords(resume, jd);
  const sections = detectSections(resume);
  const bullets = extractBullets(resume);
  const rewrites = buildRewrites(bullets);
  const atsChecks = buildAtsChecks(resume, keywords, sections, bullets);
  const wordCount = resume.split(/\s+/).filter(Boolean).length;
  const { scores, overall } = buildScoreBreakdown(keywords, bullets, sections, atsChecks, wordCount);
  const metrics = bullets.filter((bullet) => METRIC_PATTERN.test(bullet)).length;

  return {
    candidateName,
    targetRole,
    company,
    overallScore: overall,
    verdict: buildVerdict(overall, keywords, metrics, bullets.length),
    scoreBreakdown: scores,
    keywords,
    missingSkills: buildMissingSkills(keywords),
    bulletRewrites: rewrites,
    strengths: buildStrengths(keywords, bullets, sections, resume),
    sectionFeedback: buildSectionFeedback(sections, keywords, bullets, atsChecks, wordCount),
    atsChecks,
    actionPlan: buildActionPlan(keywords, rewrites, atsChecks),
  };
}

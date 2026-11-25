import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = "C:\\Users\\MYPC\\AppData\\Local\\Temp\\opencode\\merit-qa";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--font-render-hinting=none"],
});

async function clickText(page, text) {
  const buttons = await page.$$("button");
  for (const button of buttons) {
    const label = await button.evaluate((el) => el.textContent ?? "");
    if (label.includes(text)) {
      await button.click();
      return true;
    }
  }
  return false;
}

const page = await browser.newPage();
const logs = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    logs.push(`CONSOLE ${msg.type()}: ${msg.text()}`);
  }
});
page.on("pageerror", (err) => logs.push(`PAGEERROR: ${err.message}`));
await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);

await clickText(page, "Try sample inputs");
await new Promise((r) => setTimeout(r, 400));

const api = await page.evaluate(async () => {
  const resumeText = document.querySelector("#resume-text").value;
  const jobDescription = document.querySelector("#job-description-input").value;
  const post = async (fd) => {
    const res = await fetch("/api/analyze", { method: "POST", body: fd });
    return { status: res.status, body: await res.json() };
  };

  const textForm = new FormData();
  textForm.set("resumeText", resumeText);
  textForm.set("jobDescription", jobDescription);
  const textReview = await post(textForm);

  const fileForm = new FormData();
  fileForm.set("resume", new File([resumeText], "maya-chen.txt", { type: "text/plain" }));
  fileForm.set("jobDescription", jobDescription);
  const fileReview = await post(fileForm);

  const shortForm = new FormData();
  shortForm.set("resumeText", "too short");
  shortForm.set("jobDescription", "too short");
  const shortReview = await post(shortForm);

  const missingJdForm = new FormData();
  missingJdForm.set("resumeText", resumeText);
  const missingJd = await post(missingJdForm);

  const wrongType = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  }).then(async (res) => ({ status: res.status, body: await res.json() }));

  const summarize = (result) => {
    const analysis = result.body?.review?.analysis;
    return {
      status: result.status,
      mode: result.body?.review?.mode,
      fileName: result.body?.review?.fileName,
      score: analysis?.overallScore,
      keywords: analysis?.keywords?.map((keyword) => ({
        keyword: keyword.keyword,
        status: keyword.status,
        importance: keyword.importance,
        note: keyword.note,
      })),
      breakdown: analysis?.scoreBreakdown?.map((item) => item.note),
      ats: analysis?.atsChecks?.map((check) => `${check.label}:${check.status}`),
      error: result.body?.error,
      code: result.body?.code,
    };
  };

  return {
    text: summarize(textReview),
    file: summarize(fileReview),
    short: summarize(shortReview),
    missingJd: summarize(missingJd),
    wrongType: summarize(wrongType),
  };
});

console.log("API_TEXT", JSON.stringify(api.text, null, 2));
console.log("API_FILE", JSON.stringify(api.file, null, 2));
console.log("API_SHORT", JSON.stringify(api.short));
console.log("API_MISSING_JD", JSON.stringify(api.missingJd));
console.log("API_WRONG_TYPE", JSON.stringify(api.wrongType));

// Run the same inputs through the UI.
await clickText(page, "Review my resume");
await page
  .waitForFunction(() => document.body.innerText.includes("Your review is ready."), {
    timeout: 30000,
  })
  .catch(() => {});
await new Promise((r) => setTimeout(r, 900));
const ui = await page.evaluate(() => ({
  heading: document.querySelector("h1")?.textContent?.trim(),
  score: document.querySelector('[role="img"]')?.getAttribute("aria-label"),
  keywordChips: Array.from(document.querySelectorAll(".chip-brand-soft"))
    .map((el) => el.textContent?.trim())
    .filter(Boolean)
    .slice(0, 40),
  notice: document.querySelector(".notice-warm")?.textContent?.trim(),
}));
console.log("UI", ui);
await page.screenshot({ path: `${OUT}/local-report-top.png`, fullPage: false });
await page.screenshot({ path: `${OUT}/local-report-full.png`, fullPage: true });

// Scrollspy check.
await page.evaluate(() => {
  document.getElementById("keywords")?.scrollIntoView();
  window.scrollBy(0, -120);
});
await new Promise((r) => setTimeout(r, 600));
const spy = await page.evaluate(() =>
  Array.from(document.querySelectorAll("nav button")).map((el) => ({
    text: el.textContent?.trim(),
    current: el.getAttribute("aria-current"),
  })),
);
console.log("SCROLLSPY", spy);

// Mobile sample report notice.
const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mobile.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await mobile.evaluate(() => document.fonts.ready);
await clickText(mobile, "Open sample report");
await new Promise((r) => setTimeout(r, 1000));
const mobileMetrics = await mobile.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  bodyHeight: document.body.scrollHeight,
}));
console.log("MOBILE_METRICS", mobileMetrics);
await mobile.screenshot({ path: `${OUT}/mobile-report-top-2.png`, fullPage: false });
await mobile.screenshot({ path: `${OUT}/mobile-report-full-2.png`, fullPage: true });

console.log("LOGS", logs);
await browser.close();

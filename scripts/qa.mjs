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

const page = await browser.newPage();
const logs = [];
page.on("console", (msg) => logs.push(`CONSOLE ${msg.type()}: ${msg.text()}`));
page.on("pageerror", (err) => logs.push(`PAGEERROR: ${err.message}`));
await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 400));

const metrics = await page.evaluate(() => ({
  title: document.title,
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  bodyHeight: document.body.scrollHeight,
}));
console.log("METRICS", metrics);
await page.screenshot({ path: `${OUT}/form-desktop.png`, fullPage: true });

// Empty submit validation
const submit = await page.$$("button");
for (const button of submit) {
  const text = await button.evaluate((el) => el.textContent ?? "");
  if (text.includes("Review my resume")) {
    await button.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 700));
const validation = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[role="alert"]')).map((el) => el.textContent?.trim()),
);
console.log("VALIDATION", validation);
await page.screenshot({ path: `${OUT}/form-validation.png`, fullPage: false });

// Load sample inputs
const sampleButtons = await page.$$("button");
for (const button of sampleButtons) {
  const text = await button.evaluate((el) => el.textContent ?? "");
  if (text.includes("Try sample inputs")) {
    await button.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 300));
const charCounts = await page.evaluate(() => ({
  resume: document.querySelector("#resume-text")?.value?.length,
  jd: document.querySelector("#job-description-input")?.value?.length,
}));
console.log("SAMPLE_COUNTS", charCounts);
await page.screenshot({ path: `${OUT}/form-sample-filled.png`, fullPage: true });

// Submit sample inputs and wait for report
const submit2 = await page.$$("button");
for (const button of submit2) {
  const text = await button.evaluate((el) => el.textContent ?? "");
  if (text.includes("Review my resume")) {
    await button.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${OUT}/analyzing.png`, fullPage: false });
await page
  .waitForFunction(
    () =>
      document.body.innerText.includes("Your review is ready.") ||
      document.body.innerText.includes("Review report"),
    { timeout: 30000 },
  )
  .catch(() => {});
await new Promise((r) => setTimeout(r, 900));
const report = await page.evaluate(() => ({
  heading: document.querySelector("h1")?.textContent?.trim(),
  modeChip: Array.from(document.querySelectorAll("span")).find((el) =>
    ["Local analysis", "AI review", "Sample report"].includes(el.textContent?.trim() ?? ""),
  )?.textContent,
  notice: document.querySelector(".notice-warm, .notice-brand")?.textContent?.trim().slice(0, 180),
  score: document.querySelector('[role="img"]')?.getAttribute("aria-label"),
  sections: Array.from(document.querySelectorAll("section[id]")).map((el) => el.id),
}));
console.log("REPORT", report);
await page.screenshot({ path: `${OUT}/report-desktop.png`, fullPage: true });

// Plan interaction
const checkbox = await page.$('[role="checkbox"]');
if (checkbox) {
  await checkbox.click();
  await new Promise((r) => setTimeout(r, 300));
  console.log("PLAN_CHECKED", await checkbox.evaluate((el) => el.getAttribute("aria-checked")));
}

// History dialog
const historyButtons = await page.$$("button");
for (const button of historyButtons) {
  const text = await button.evaluate((el) => el.textContent ?? "");
  if (text.includes("Review history")) {
    await button.click();
    break;
  }
}
await new Promise((r) => setTimeout(r, 400));
const dialogOpen = await page.evaluate(() => {
  const dialog = document.querySelector("dialog");
  return { open: dialog?.open ?? false, text: dialog?.innerText.slice(0, 220) };
});
console.log("HISTORY_DIALOG", dialogOpen);
await page.screenshot({ path: `${OUT}/history-desktop.png`, fullPage: false });

console.log("LOGS", logs);
await browser.close();

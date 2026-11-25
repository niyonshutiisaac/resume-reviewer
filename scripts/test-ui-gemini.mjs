import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = "C:\\Users\\MYPC\\AppData\\Local\\Temp\\opencode\\merit-qa";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
const logs = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    logs.push(`${msg.type()}: ${msg.text()}`);
  }
});
page.on("pageerror", (error) => logs.push(`pageerror: ${error.message}`));

await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);

for (const button of await page.$$("button")) {
  if ((await button.evaluate((el) => el.textContent ?? "")).includes("Try sample inputs")) {
    await button.click();
    break;
  }
}
await new Promise((resolve) => setTimeout(resolve, 400));

for (const button of await page.$$("button")) {
  if ((await button.evaluate((el) => el.textContent ?? "")).includes("Review my resume")) {
    await button.click();
    break;
  }
}

await page.waitForFunction(
  () => document.body.innerText.includes("Your review is ready."),
  { timeout: 90_000 },
);
await page.evaluate(() => document.fonts.ready);

const result = await page.evaluate(() => {
  const text = document.querySelector("main")?.innerText ?? document.body.innerText;
  const notice = text.match(/This review used local heuristics[^\n]*/)?.[0] ?? null;
  return {
    hasAiReview: text.includes("AI review"),
    hasLocalAnalysis: text.includes("Local analysis"),
    hasReviewReady: text.includes("Your review is ready."),
    notice,
  };
});
await page.screenshot({
  path: `${OUT}\\gemini-ui-report-top.png`,
  clip: { x: 0, y: 0, width: 1440, height: 1200 },
});
console.log(result);
console.log("logs", logs);
await browser.close();

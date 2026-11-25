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

const opened = await clickText(page, "Open sample report");
console.log("OPENED_SAMPLE", opened);
await new Promise((r) => setTimeout(r, 1200));
const sampleInfo = await page.evaluate(() => {
  const bodyText = document.body.innerText;
  return {
    heading: document.querySelector("h1")?.textContent?.trim(),
    heroScore: document.querySelector('[role="img"]')?.getAttribute("aria-label"),
    hasSampleNotice: bodyText.includes("This is a sample report for a fictional candidate"),
    hasFooterCta: bodyText.includes("Want this for your resume?"),
    mode: Array.from(document.querySelectorAll("span"))
      .map((el) => el.textContent?.trim())
      .find((text) => text === "Sample report"),
    keywordHeader: bodyText.includes("17/24 matched"),
    atsHeader: bodyText.includes("6 of 7 checks passed"),
    sections: Array.from(document.querySelectorAll("section[id]")).map((el) => el.id),
  };
});
console.log("SAMPLE_INFO", sampleInfo);
await page.screenshot({ path: `${OUT}/sample-report-top.png`, fullPage: false });
await page.screenshot({ path: `${OUT}/sample-report-full.png`, fullPage: true });

// History while viewing sample
await clickText(page, "Review history");
await new Promise((r) => setTimeout(r, 400));
const history = await page.evaluate(() => {
  const dialog = document.querySelector("dialog");
  return { open: dialog?.open, text: dialog?.innerText.slice(0, 400) };
});
console.log("HISTORY_SAMPLE", history);
await page.screenshot({ path: `${OUT}/history-sample.png`, fullPage: false });
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 300));

// How it works
await clickText(page, "How it works");
await new Promise((r) => setTimeout(r, 400));
const how = await page.evaluate(() => {
  const dialog = document.querySelector("dialog");
  return { open: dialog?.open, text: dialog?.innerText.slice(0, 500) };
});
console.log("HOW", how);
await page.screenshot({ path: `${OUT}/how-it-works.png`, fullPage: false });
await page.keyboard.press("Escape");

// Mobile form
const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mobile.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await mobile.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 300));
const mobileMetrics = await mobile.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  bodyHeight: document.body.scrollHeight,
}));
console.log("MOBILE_METRICS", mobileMetrics);
await mobile.screenshot({ path: `${OUT}/mobile-form.png`, fullPage: true });

// Mobile menu
const menuButton = await mobile.$('button[aria-label="Open workspace menu"]');
if (menuButton) {
  await menuButton.click();
  await new Promise((r) => setTimeout(r, 400));
  await mobile.screenshot({ path: `${OUT}/mobile-menu.png`, fullPage: false });
  const close = await mobile.$('button[aria-label="Close workspace menu"]');
  if (close) await close.click();
  await new Promise((r) => setTimeout(r, 300));
}

// Mobile sample report
await clickText(mobile, "Open sample report");
await new Promise((r) => setTimeout(r, 1200));
const mobileReport = await mobile.evaluate(() => ({
  heading: document.querySelector("h1")?.textContent?.trim(),
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  bodyHeight: document.body.scrollHeight,
}));
console.log("MOBILE_REPORT", mobileReport);
await mobile.screenshot({ path: `${OUT}/mobile-sample-report.png`, fullPage: true });

console.log("LOGS", logs);
await browser.close();

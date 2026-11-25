import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

const buttons = await page.$$("button");
for (const button of buttons) {
  const label = await button.evaluate((el) => el.textContent ?? "");
  if (label.includes("Try sample inputs")) {
    await button.click();
    break;
  }
}

await new Promise((resolve) => setTimeout(resolve, 500));
const { resumeText, jobDescription } = await page.evaluate(() => ({
  resumeText: document.querySelector("#resume-text")?.value ?? "",
  jobDescription: document.querySelector("#job-description-input")?.value ?? "",
}));
await browser.close();

console.log("inputs", { resumeChars: resumeText.length, jdChars: jobDescription.length });

const form = new FormData();
form.set("resumeText", resumeText);
form.set("jobDescription", jobDescription);

const started = Date.now();
const response = await fetch("http://localhost:3000/api/analyze", {
  method: "POST",
  body: form,
});
const body = await response.json();
const review = body.review;
console.log({
  status: response.status,
  elapsedMs: Date.now() - started,
  mode: review?.mode,
  notice: review?.notice,
  score: review?.analysis?.overallScore,
  keywords: review?.analysis?.keywords?.length,
  rewrites: review?.analysis?.rewrites?.length,
  error: body.error,
});

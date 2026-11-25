import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const key = env.GEMINI_API_KEY?.trim();
const model = env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
console.log({ model, keyLength: key?.length ?? 0, hasKey: Boolean(key) });
if (!key) process.exit(1);

const listResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
);
console.log("list_status", listResponse.status);
if (listResponse.ok) {
  const body = await listResponse.json();
  const names = (body.models ?? [])
    .map((item) => item.name)
    .filter((name) => /flash|pro/i.test(name))
    .slice(0, 40);
  console.log("models", names);
} else {
  console.log("list_error", (await listResponse.text()).slice(0, 500));
}

for (const candidate of ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.6-flash"]) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      candidate,
    )}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Reply with the single word OK." }] }],
      }),
      signal: AbortSignal.timeout(30000),
    },
  ).catch((error) => ({ ok: false, status: 0, text: async () => error.message }));

  console.log("generate", candidate, "status", response.status);
  const text = await response.text();
  console.log("generate_body", text.slice(0, 700));
  if (response.ok) break;
}

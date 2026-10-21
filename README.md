# AI Revenue Integrity Platform

**An AI-assisted dashboard for spotting revenue leakage and understanding financial outlook.**

Businesses lose money quietly — under-billing, missed charges, inconsistent pricing, and transactions nobody reviews. This platform surfaces those problems in one place and adds an AI-generated financial outlook section so the numbers come with an explanation, not just a chart.

[SCREENSHOT: add a screenshot of the dashboard / financial outlook section]

### What it does
- Dashboard view of revenue-integrity signals [LIST THE 3–4 SIGNALS YOUR APP ACTUALLY SHOWS]
- AI financial outlook section: a generated summary of where revenue is heading and why
- Built as a TypeScript app (Bun + Vite) with a server component, using Google Gemini

### Tech stack
TypeScript · Bun · Vite · Google Gemini

### Run it locally
```bash
bun install
# set GEMINI_API_KEY in your environment
bun run dev
```
[VERIFY: adjust the commands above to match package.json scripts before publishing]

### Why I built this / decisions I made
[IN YOUR WORDS — 4–6 sentences: what "revenue integrity" problem you wanted to explore, why a dashboard plus a written AI outlook beats a chart alone, and the limits of the prototype (sample data? which data sources would a real client version connect to?).]

### Status
Working prototype, actively developed. Started from Google AI Studio tooling, then extended with the AI financial outlook dashboard.

---

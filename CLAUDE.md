# CLAUDE.md — AI Revenue Integrity Platform

## Stack
- TypeScript, React 19 + Vite, Tailwind, Recharts; Express API in `server.ts`
- AI: `executeAIWithFallback` in `server.ts` — Gemini primary → Gemini secondary → Groq (`groqClient.ts`) → deterministic payload
- Mock data only: `src/data/mockData.ts` (fictional orgs/patients)

## Commands
```
npm install
npm run dev              # tsx server.ts → http://localhost:3000
npm run lint             # tsc --noEmit
npm run build && npm start
```

## Conventions
- Every AI endpoint returns `source` (model id, `groq:<model>`, or rules-engine fallback).
- Keep all example data fictional; never use real hospital, payer or patient names.
- Env: GEMINI_API_KEY, GROQ_API_KEY, GROQ_MODEL (all optional).

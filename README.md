# Byline

A journalist research tool for PR teams. Drop in a journalist's name, outlet, and your pitch — Byline searches their recent coverage, scores how well the pitch fits their beat, rewrites it to match their tone, and generates a personalised opening line, all in a few seconds.

Full product vision, architecture, and API surface live in [`docs/`](docs/) — this file is just enough to understand the shape of the project and get it running locally. `docs/PRD.md` is the canonical description of what this is and where it's going.

## What it does

Byline runs a short pipeline per request:

1. **Article discovery** — Serper searches Google for the journalist's recent bylines (up to the configured article limit).
2. **Coverage profile** — an LLM reads those articles and writes a short summary of what the journalist actually covers and cares about.
3. **Fit score** — the LLM scores the pitch against that profile (0–100) and explains the gap.
4. **Pitch rewrite** — the LLM rewrites the pitch to better match the journalist's demonstrated interests and tone.
5. **Opening line** — if articles were found, the LLM suggests a personalised first line referencing a specific piece.

Steps 1–2 and 3–4 run in parallel. End-to-end latency is typically 4–6 seconds with Gemini 2.5 Flash Lite.

A low-confidence warning fires when fewer than 10 articles are found (configurable via `LOW_CONFIDENCE_THRESHOLD`). The opening line is suppressed entirely when no articles are found — the model never free-recalls.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript strict mode, `bun` for packages
- **LLM:** OpenRouter (default model: `google/gemini-2.5-flash-lite` — swap via `OPENROUTER_MODEL`)
- **Search:** Serper API (Google Search)
- **UI:** Tailwind CSS, shadcn/ui

No separate backend — everything runs as Next.js API routes.

## Repo layout

```
byline/
├── frontend/          # Next.js 14 app (bun)
│   └── src/
│       ├── app/       # App Router — page.tsx + api/analyze/route.ts
│       ├── features/  # analysis components and schema
│       └── lib/       # config, llm, search utilities
└── docs/              # PRD, architecture, UI spec, API contracts, external services
```

## Quick start

```bash
cd frontend
bun install
```

Copy `.env.example` to `.env.local` and fill in your keys:

```
OPENROUTER_API_KEY=<your key>
SERPER_API_KEY=<your key>
OPENROUTER_MODEL=google/gemini-2.5-flash-lite   # optional
LOW_CONFIDENCE_THRESHOLD=10                      # optional
```

Then:

```bash
bun run dev   # http://localhost:3000
```

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENROUTER_API_KEY` | Yes | — | OpenRouter API key |
| `SERPER_API_KEY` | Yes | — | Serper API key for Google Search |
| `OPENROUTER_MODEL` | No | `google/gemini-2.5-flash-lite` | Any OpenRouter model string |
| `LOW_CONFIDENCE_THRESHOLD` | No | `10` | Article count below which the low-confidence warning fires |

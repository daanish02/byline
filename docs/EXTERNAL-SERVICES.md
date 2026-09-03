# External Services

> **Project:** Byline

## Status

Canon — update when integrations are added, replaced, or their usage changes.

## Services

### OpenRouter API

- **Purpose:** LLM completions for all four analysis outputs: coverage profile, fit score + reasoning, pitch rewrite, opening line.
- **Integration point:** `frontend/src/lib/llm.ts`
- **Protocol:** OpenAI-compatible REST (`POST /api/v1/chat/completions`).
- **Authentication:** Bearer token via `OPENROUTER_API_KEY` env var. Never exposed to the browser.
- **Model:** Configured via `OPENROUTER_MODEL` env var (default: `deepseek/deepseek-v4-flash-0731`). Swappable at runtime — no code change required.
- **Required headers:** `HTTP-Referer` (set to app URL per OpenRouter requirements), `X-Title` (set to `"Byline"`).
- **Failure behavior:** HTTP errors or timeouts propagate as a 500 from `/api/analyze`. The UI displays a generic error banner. No retry logic in v1.
- **Credentials:** `OPENROUTER_API_KEY={{OPENROUTER_API_KEY}}` — store in `.env.local` locally; in a secrets manager or platform env config in any deployed environment.

### Serper API

- **Purpose:** Article discovery — given a journalist name + outlet, returns recent articles with title, URL, date, and snippet.
- **Integration point:** `frontend/src/lib/search.ts`
- **Protocol:** REST (`POST https://google.serper.dev/search`), JSON body.
- **Authentication:** `X-API-KEY` header via `SERPER_API_KEY` env var. Never exposed to the browser.
- **Query strategy:** `"{journalist name}" site:{outlet domain} OR "{journalist name}" {outlet}` — returns top N organic results. Result count checked against `LOW_CONFIDENCE_THRESHOLD` (default: 5, env-configurable).
- **Failure behavior:** HTTP errors propagate as a 500 from `/api/analyze`. Zero results trigger the low-confidence path, not an error.
- **Credentials:** `SERPER_API_KEY={{SERPER_API_KEY}}` — store in `.env.local` locally; secrets manager or platform env config in deployment.

## Environment Variable Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENROUTER_API_KEY` | Yes | — | OpenRouter bearer token |
| `OPENROUTER_MODEL` | No | `deepseek/deepseek-v4-flash-0731` | Model slug passed to OpenRouter |
| `SERPER_API_KEY` | Yes | — | Serper API key |
| `LOW_CONFIDENCE_THRESHOLD` | No | `5` | Minimum article count for full-confidence output |

All values belong in `.env.local` (local dev) or an equivalent secrets store in deployment. Never commit real values — `.env.local` is gitignored.

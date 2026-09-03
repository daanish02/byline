# Contract Specification: API Contracts

> **Governing Architecture:** `docs/ARCHITECTURE.md`

---

## 1. Interface Specifications

### `POST /api/analyze`

- **Purpose:** Accepts journalist info + pitch, runs article discovery and LLM analysis pipeline, returns all four outputs.
- **Auth Required:** No (v1 demo — public endpoint)

#### Request Payload

```json
{
  "type": "object",
  "required": ["journalist", "outlet", "pitch"],
  "properties": {
    "journalist": {
      "type": "string",
      "description": "Full name of the journalist.",
      "minLength": 1,
      "maxLength": 200
    },
    "outlet": {
      "type": "string",
      "description": "Publication or outlet the journalist works for.",
      "minLength": 1,
      "maxLength": 200
    },
    "pitch": {
      "type": "string",
      "description": "The user's original pitch text.",
      "minLength": 1,
      "maxLength": 10000
    }
  }
}
```

#### Response Payload (`200 OK`)

```json
{
  "profile": "string — journalist coverage profile: beat, obsessions, recurring angles",
  "score": 38,
  "scoreReasoning": "string — plain-English explanation of why the pitch scored this value",
  "rewrite": "string — the pitch rewritten to match the journalist's angle",
  "openingLine": "string | null — one sentence citing a real recent article; null when no articles found",
  "lowConfidence": false,
  "articleCount": 7
}
```

Field rules:
- `score`: integer 0–100 inclusive.
- `openingLine`: `null` when `articleCount === 0`. Never a fabricated citation — only cites articles actually returned by discovery.
- `lowConfidence`: `true` when `articleCount < LOW_CONFIDENCE_THRESHOLD` (default 5, env-configurable). `false` otherwise.
- `articleCount`: count of articles found by discovery, regardless of confidence level.

#### Error Payloads

**`400 Bad Request`** — missing or invalid input fields:

```json
{
  "error": "journalist, outlet, and pitch are required"
}
```

**`500 Internal Server Error`** — search API failure, LLM failure, or unhandled exception:

```json
{
  "error": "string — human-readable description; never exposes stack trace or internal keys"
}
```

---

## 2. Database Schema / Type Model Definition

N/A — Byline v1 is fully stateless. No database, no persistent store.

---

## 3. Invariants & Failure Modes

- **Invariant — no hallucinated citations:** `openingLine` MUST only reference an article present in the discovery result set. If `articleCount === 0`, `openingLine` MUST be `null`. The LLM prompt for opening line generation receives only discovered article titles/URLs — never free recall.
- **Invariant — score range:** `score` MUST be an integer in [0, 100]. Values outside this range are a bug.
- **Failure Mode — Serper API error:** If Serper returns a non-2xx response, the route returns `500` with `{ "error": "Article search failed" }`. Zero results is not an error — it sets `articleCount: 0` and `lowConfidence: true` and continues.
- **Failure Mode — OpenRouter API error:** If any LLM call returns a non-2xx response or times out, the route returns `500` with `{ "error": "Analysis failed" }`.
- **Failure Mode — total latency > 30s:** No hard server timeout enforced in v1. The ≤30s target is a design constraint on prompt sizing and model selection, not a server-enforced abort.

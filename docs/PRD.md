# Product Requirements Document

> **Project Name:** Byline
> **Version:** 1.0.0
> **Status:** Draft
> **Author:** Danish Ahmed

---

## 1. Executive Summary

- **Core Problem:** PR professionals send generic pitches that get ignored. The pitches that land feel like the sender actually read the journalist's work — but doing that research manually takes time most people skip.
- **Proposed Solution:** Byline is a single-purpose web tool. Input: journalist name + outlet + pitch. Output in ≤30 seconds: journalist coverage profile, fit score with plain-English reasoning, rewritten pitch, and one opening line citing a real recent article.
- **Target Value:** A demo viewer immediately thinks "I could use this right now" — evidenced by an output that changes the pitch angle AND cites a verifiable real article.

---

## 2. Personas & Core Workflows

### 2.1 User Personas

- **Agency Account Manager** — manages pitches for multiple clients across multiple journalists simultaneously. Job/Problem: needs to personalize outreach at volume without spending 20+ minutes per journalist on manual research.

### 2.2 Critical Workflows

**Standard path:**

```text
[User enters journalist name + outlet]
       ──> [Byline searches web for journalist's recent articles]
       ──> [LLM builds coverage profile: beat, obsessions, recurring angles]
       ──> [User pastes pitch]
       ──> [LLM scores fit 0–100 with plain-English reasoning]
       ──> [LLM rewrites pitch to match journalist's angle]
       ──> [LLM generates opening line citing a real recent article]
       ──> [All four outputs displayed, ≤30s total]
```

**Low-data path (fewer than 5 articles found):**

```text
[Web search returns <5 articles]
       ──> [Low-confidence warning shown]
       ──> [Best-effort output generated, clearly flagged]
```

---

## 3. Functional Requirements

All requirements use strict RFC 2119 priority keywords (**MUST**, **SHOULD**, **MAY**).

| Requirement ID | Module | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| `REQ-FUNC-001` | Journalist Lookup | **MUST** | Accept journalist name + outlet as input | Form accepts both fields; neither optional |
| `REQ-FUNC-002` | Article Discovery | **MUST** | Search web for journalist's recent articles | Returns ≥5 article URLs with title and date, or triggers low-confidence path; threshold configurable via env/config |
| `REQ-FUNC-003` | Coverage Profile | **MUST** | Generate journalist coverage profile: beat, obsessions, recurring angles | Profile derived from actual found articles, not generic bio |
| `REQ-FUNC-004` | Pitch Input | **MUST** | Accept user's pitch as freeform text input | No length restriction; paste-friendly |
| `REQ-FUNC-005` | Fit Score | **MUST** | Score pitch–journalist fit 0–100 with plain-English explanation | Score and explanation both present; explanation references specific angle mismatch or match |
| `REQ-FUNC-006` | Pitch Rewrite | **MUST** | Rewrite pitch to match journalist's beat and angle | Rewrite demonstrably shifts angle — not a light rephrasing |
| `REQ-FUNC-007` | Opening Line | **MUST** | Generate one opening email line citing a verifiable real recent article | Cites article by title/topic; article must exist in discovery results |
| `REQ-FUNC-008` | Low-Confidence Warning | **MUST** | Flag output when fewer than 5 articles found | Warning visible before output; output still shown; threshold reads from config |
| `REQ-FUNC-009` | Latency | **MUST** | Full pipeline completes in ≤30 seconds | Measured end-to-end from submit to all four outputs rendered |
| `REQ-FUNC-010` | Hallucination Guard | **MUST** | Opening line MUST NOT cite an article not in discovery results | If no verifiable article found, opening line omitted or explicitly flagged as unverified |

---

## 4. Non-Functional Requirements

| Category | Priority | Requirement |
|---|---|---|
| **Performance** | **MUST** | End-to-end pipeline ≤30s from submit to all outputs rendered |
| **Device** | **MUST** | Desktop-first UI; no mobile layout requirement for v1 |
| **Hallucination Safety** | **MUST** | Opening line only cites articles present in discovery results; no LLM-fabricated citations |
| **Configurability** | **SHOULD** | Low-confidence article threshold (default: 5) readable from config/env; no redeploy needed to change |
| **Security** | **SHOULD** | No user data persisted between sessions for v1 (demo context — no auth needed) |
| **Scalability** | **MAY** | Stateless request handling; no session state stored server-side |

---

## 5. Success Metrics

| Type | Metric | Target |
|---|---|---|
| **Primary** | Demo output shifts pitch angle AND cites a verifiable real article | Both conditions hold on a live demo run with a real journalist + real pitch |
| **Secondary** | End-to-end latency | ≤30 seconds measured from submit to all four outputs rendered |
| **Guardrail** | Hallucinated citations | Zero — opening line must never cite an article not in discovery results |

---

## 6. Explicit Out of Scope

- Mass email / bulk outreach tooling
- CRM or contact management
- Pitch send / outbox functionality
- Campaign tracking or analytics
- Mobile layout (v1)
- User accounts / authentication (v1 demo)
- Paid journalist database integration (Muck Rack, Cision)

---

## 7. Competitive / Market Context

- **Muck Rack / Cision** — paid enterprise media databases; expensive, not instant, not pitch-aware. Byline is cheaper, faster, and personalizes to the specific pitch being sent.
- **Manual Google search** — real status quo for most users. Byline replaces 20+ minutes of manual research with a 30-second automated output.
- **Differentiation:** Only tool that combines journalist research + pitch-specific fit scoring + rewrite in a single flow, instantly, without a database subscription.

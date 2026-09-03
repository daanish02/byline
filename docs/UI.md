# UI

> **Project:** Byline

## Status

Canon — update when screens, flows, or states change.

## Design Constraints

- Desktop-first. Minimum supported viewport: 1024px wide. No mobile layout in v1.
- Single page. No routing. No login screen.
- Results appear in the same view as the form — no navigation required.

## Screens & States

### State 1: Empty Form

The default state on load. A single column centered on the page.

```
┌─────────────────────────────────────────┐
│  Byline                                 │
│  Know your journalist before you pitch  │
│                                         │
│  Journalist name  [________________]    │
│  Outlet           [________________]    │
│                                         │
│  Your pitch       [                ]    │
│                   [                ]    │
│                   [                ]    │
│                                         │
│                   [    Analyze →   ]    │
└─────────────────────────────────────────┘
```

### State 2: Loading

Submit button replaced with a spinner. Form fields remain visible and disabled. No skeleton cards — the 30-second constraint means a simple loading indicator is preferable to a fake progress illusion.

### State 3: Results (standard confidence)

Results appear below the form in four cards. The form stays visible so the user can run another analysis without scrolling up.

```
┌───────────────────────────────────────────────────────────┐
│  [form — stays visible, re-enabled]                       │
├───────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Coverage Profile │  │ Fit Score        │               │
│  │                  │  │  38/100          │               │
│  │ Beat, obsessions,│  │  [plain-English  │               │
│  │ recurring angles │  │   explanation]   │               │
│  └──────────────────┘  └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Rewritten Pitch  │  │ Opening Line     │               │
│  │                  │  │                  │               │
│  │ [rewritten text] │  │ [one sentence,   │               │
│  │                  │  │  citing article] │               │
│  └──────────────────┘  └──────────────────┘               │
└───────────────────────────────────────────────────────────┘
```

### State 4: Results (low confidence)

Same as State 3, but a warning banner appears above the four cards. The four cards are still shown — output is not suppressed.

```
┌──────────────────────────────────────────────────────────────┐
│  ⚠ Low confidence — only N articles found for this          │
│    journalist. Results may be less accurate.                 │
├──────────────────────────────────────────────────────────────┤
│  [four cards as in State 3]                                  │
└──────────────────────────────────────────────────────────────┘
```

### State 5: Opening Line Unavailable

If article discovery returns zero results, the Opening Line card shows a placeholder instead of suppressing the card entirely.

```
┌──────────────────┐
│ Opening Line     │
│                  │
│ No articles      │
│ found — opening  │
│ line unavailable │
└──────────────────┘
```

### State 6: Error

If the API route returns an error, a full-width error banner replaces the result area. The form re-enables so the user can retry.

```
┌──────────────────────────────────────────────────────────────┐
│  ✕  Something went wrong. Please try again.                 │
└──────────────────────────────────────────────────────────────┘
```

## Component Map

| Component              | File                                  | Responsibility                                        |
| ---------------------- | ------------------------------------- | ----------------------------------------------------- |
| `HomePage`             | `app/page.tsx`                        | Root layout, state machine, form submit handler       |
| `AnalysisForm`         | `components/AnalysisForm.tsx`         | Journalist name, outlet, pitch inputs + submit button |
| `LowConfidenceWarning` | `components/LowConfidenceWarning.tsx` | Warning banner shown when article count < threshold   |
| `ResultsGrid`          | `components/ResultsGrid.tsx`          | 2×2 grid wrapper for the four output cards            |
| `CoverageCard`         | `components/CoverageCard.tsx`         | Journalist coverage profile text                      |
| `ScoreCard`            | `components/ScoreCard.tsx`            | Numeric score + plain-English reasoning               |
| `RewriteCard`          | `components/RewriteCard.tsx`          | Rewritten pitch text                                  |
| `OpeningLineCard`      | `components/OpeningLineCard.tsx`      | Opening line, or unavailable state                    |
| `ErrorBanner`          | `components/ErrorBanner.tsx`          | Full-width error display                              |

## UI State Machine

```
idle
 └─[submit]──> loading
                └─[success]──> results
                │               (lowConfidence flag drives warning banner)
                │               (openingLine null drives OpeningLineCard placeholder)
                └─[error]────> error
                                └─[retry / new input]──> idle
```

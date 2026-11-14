# Fresh-Agent Knowledgebase Acceptance Evaluation

Status: evaluation suite drafted; not yet executed by an independent/fresh agent.

Purpose: prove that an AI agent can implement and reason about ActiveQuery using the knowledgebase without repeatedly reopening upstream source.

## Instructions to the evaluated agent

- Use only the ActiveQuery Labs knowledgebase for the initial answer.
- Do not inspect upstream source unless the knowledgebase explicitly marks the requested fact as missing, ambiguous or unverified.
- Cite the exact knowledgebase page and source anchor when available.
- Separate source-confirmed, runtime-verified, derived and unverified claims.
- Do not invent APIs or normalize suspicious spellings.

## Questions and expected answer criteria

### AQCSS

1. **What are the AQCSS responsive prefixes and activation widths?**
   - Expected: base/mobile companion `aq-`/`aq-m-`; `aq-t-` at min-width 600px; `aq-d-` at 993px; `aq-s-` at 1440px. Explain cumulative min-width behavior and 600px overlap with mobile-hide helper.
   - Reference: `aqcss/tokens-and-responsive.md`, `aqcss/selector-families.md`.

2. **What is wrong with `.aq-facet--third`?**
   - Expected: source declaration is 3.33333% width; do not silently reinterpret as 33.33333%; runtime confirmation remains pending.
   - Reference: `testing/source-findings.md`, `aqcss/layout-utilities.md`.

3. **Can `.aq-flexon--row-gap-xlarge` be relied on?**
   - Expected: source uses unitless `row-gap:2`; invalid CSS length; browser verification pending. Also mention base selector list missing commas and responsive spelling mismatches.
   - Reference: `testing/source-findings.md`, `aqcss/layout-utilities.md`.

4. **Does AQCSS provide a built-in dark-mode toggle?**
   - Expected: no built-in `prefers-color-scheme` behavior was found in the inspected stylesheet; theme tokens exist but a complete dark mode is not established.
   - Reference: `aqcss/tokens-and-responsive.md`, `aqcss/theme-effects.md`.

5. **What accessibility risks must be addressed when using AQCSS controls?**
   - Expected: global outline resets, hover-only tooltip/dropdown, disabled descendant selectors, contrast testing and keyboard/touch alternatives.
   - Reference: `aqcss/base-controls.md`, `testing/source-findings.md`.

### AQJS

6. **What does `ActiveQuery.DOM(selector)` return for zero, one and multiple matches?**
   - Expected: null, Element, NodeList respectively; caller must handle polymorphic return type.
   - Reference: `architecture/aqjs-runtime-model.md`, `aqjs/api-inventory.md`.

7. **Why is `new ActiveQuery()` unsafe in the inspected source?**
   - Expected: default null is coerced to "null" by regex test; alias branch runs; `window.null` and property `"0"` are assigned to Element, NodeList and Object prototypes. Explicit empty string avoids this specific branch, but is a workaround, not an upstream fix.
   - Reference: `architecture/aqjs-runtime-model.md`, `testing/source-findings.md`.

8. **Are Element and NodeList methods interchangeable?**
   - Expected: no. Identify no-op/stub methods and examples such as getStyles/getClasses/setHtml/setText on NodeList.
   - Reference: `aqjs/behavior-matrix.md`.

9. **Is `sift(selector)` a working filter helper?**
   - Expected: source guard returns early for truthy selectors, so normal valid selector path does not install handler; treat as suspect/broken pending runtime tests.
   - Reference: `aqjs/templating-and-observation.md`, `testing/source-findings.md`.

10. **Does the inspected AQJS source prove AQI event batching and delegated events?**
    - Expected: no. It contains direct addEventListener registrations and MutationObserver, but no scheduler/queue/batch/delegation implementation was found. Treat AQI claims as requiring separate implementation/specification.
    - Reference: `architecture/principle-implementation-review.md`.

### Framework and governance

11. **What is the distinction between TEA, AQI and AQS in current evidence?**
    - Expected: TEA is an author-published conceptual Transaction→Event→Agent model; AQI is described as behavioral layer mirroring TEA; AQS is described as execution continuity/current. No complete AQI/AQS protocol or executable source was located.
    - Reference: `architecture/tea-istm-concepts.md`, `architecture/framework-overview.md`.

12. **What are the main licensing and contribution constraints?**
    - Expected: AQCSS/AQJS OSL-3.0; preserve notices; external deployment provision; no trademark grant; DCO Signed-off-by on each upstream commit; dependency compatibility review.
    - Reference: `architecture/governance-and-licensing.md`, `architecture/conventions.md`.

## Scoring rubric

Each answer receives:
- 2 points: correct, complete, cited, evidence status distinguished;
- 1 point: mostly correct but incomplete or weakly sourced;
- 0 points: incorrect, invented or unsupported.

Maximum: 24 points.

Pass threshold: 22/24, with **zero critical errors** on questions 2, 3, 7, 10, 11 and 12.

## Implementation exercise

After the knowledge questions, ask the agent to build a responsive profile card and interactive tabs component using AQCSS/AQJS:
- use only documented selectors/APIs;
- provide semantic HTML;
- state every custom CSS rule;
- state any native browser API used;
- include keyboard operation and responsive tests;
- do not use suspect methods or the default AQJS constructor.

Score against the source and browser test evidence. A good explanation alone is not proof that the implementation works.

## Completion record

| Run | Agent/model | Score | Critical errors | Implementation result | Status |
|---|---|---:|---:|---|---|
| Not yet run | — | — | — | — | Pending |

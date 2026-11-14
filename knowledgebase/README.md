# ActiveQuery AI Knowledgebase

This directory is the canonical, agent-oriented technical reference for ActiveQuery CSS (AQCSS) and ActiveQuery JS (AQJS).

Its purpose is to let a new AI agent answer implementation questions by consulting this knowledgebase rather than repeatedly rereading the upstream source files. It must be sufficiently precise, navigable, source-traceable, and validated to function as a durable engineering reference.

## Core operating rule

**Lookup the knowledgebase first.** Read the smallest relevant reference page and follow its source anchors when necessary. Do not reread entire upstream files for routine tasks.

Reopen upstream source only when:
- the recorded source version or SHA differs from the version being used;
- the knowledgebase marks the requested behavior as unresolved or unverified;
- a specific discrepancy is found;
- a new upstream release may have changed the relevant behavior.

When source reinspection is necessary, update the knowledgebase so future agents benefit from the finding.

## Evidence levels

Every meaningful technical claim must be labelled as one of:

- **Source-confirmed** — directly traced to the upstream implementation, with a file and line/range or symbol anchor.
- **Runtime-verified** — reproduced in a browser or supported runtime, with test conditions and expected/actual result.
- **Derived** — a reasoned conclusion from source-confirmed facts; explain the reasoning.
- **Unverified** — documentation or inference not yet validated. Do not use as an implementation guarantee.

Do not conflate upstream framework capabilities with browser-native APIs, third-party bundled code, or ActiveQuery Labs additions.

## Knowledgebase map

- `source-baseline.md` — pinned source identity, versions, hashes, licenses and research status.
- `source-freshness.md` — last observed upstream source commits and maintenance recency.
- `architecture/` — framework philosophy, conceptual ecosystem map, governance, licensing, initialization and execution model.
- `aqcss/` — complete selector catalogue, tokens, layout, typography, responsive rules, states and interaction behavior.
- `aqjs/` — exports, constructor, static and instance APIs, prototype extensions, lifecycle, DOM operations, templating, observation and edge cases.
- `integration/` — AQCSS/AQJS interaction, browser-native integration and usage patterns.
- `cookbook/` — tested recipes and implementation patterns.
- `testing/` — reproducible test cases, compatibility, edge cases and known limitations.
- `agent-reference/` — fast capability index, task-to-reference routing and concise agent instructions.
- `source-traceability/` — symbol/selector-to-source map and verification records.
- `mastery-gate.md` — explicit acceptance criteria; status remains NOT PASSED until evidence exists.

## Current high-value references

- [Framework conceptual architecture map](architecture/framework-overview.md)
- [Principle vs implementation review](architecture/principle-implementation-review.md)
- [TEA and ISTM conceptual notes](architecture/tea-istm-concepts.md)
- [Governance and licensing notes](architecture/governance-and-licensing.md)
- [Naming, versioning and repository conventions](architecture/conventions.md)
- [AQJS runtime model](architecture/aqjs-runtime-model.md)
- [AQJS API inventory](aqjs/api-inventory.md)
- [AQJS prototype behavior matrix](aqjs/behavior-matrix.md)
- [AQJS type predicates and guards](aqjs/type-predicates-and-guards.md)
- [AQJS templating and observation](aqjs/templating-and-observation.md)
- [AQCSS selector families](aqcss/selector-families.md)
- [AQCSS class token index](aqcss/class-token-index.json) — 1,813 unique class tokens with source line/selector references.
- [AQCSS rule selector index](aqcss/rule-selector-index.json) — 1,417 rule selector entries.
- [AQCSS custom property index](aqcss/custom-property-index.json) — declaration occurrences for 46 declared custom-property names and 91 names across declarations/references.
- [AQCSS tokens and responsive semantics](aqcss/tokens-and-responsive.md)
- [AQCSS base styles and controls](aqcss/base-controls.md)
- [AQCSS layout utilities](aqcss/layout-utilities.md)
- [AQCSS theme and effects](aqcss/theme-effects.md)
- [Source findings and verification queue](testing/source-findings.md)
- [Browser validation plan and coverage](testing/browser-test-plan.md)
- [Integration guidance](integration/README.md)
- [Source traceability index](source-traceability/index.md)
- [Mastery gate](mastery-gate.md)

## Authoring requirements

1. Preserve exact selector/API spelling and case.
2. Record complete signatures, accepted inputs, return values, side effects, prerequisites and failure behavior.
3. Document single-element and collection behavior separately where they differ.
4. Capture CSS cascade, specificity, media-query overrides and interaction states, not merely selector names.
5. Include minimal runnable examples and counterexamples.
6. Link every claim to the exact upstream file and line range or uniquely named implementation block.
7. Record test setup, browser/version, viewport, steps and observed result for runtime claims.
8. Record known bugs and surprising behavior honestly; do not silently "correct" upstream behavior in the documentation.
9. Keep the reference versioned. A release update triggers a targeted diff and revalidation process.
10. Never claim mastery or completeness while material APIs, selectors, execution paths or tests remain unexamined.

## Research sequence

1. Pin and inspect upstream sources, license files, governance and third-party notices.
2. Map the full AQCSS stylesheet and AQJS implementation.
3. Trace every public selector family and API to its implementation.
4. Test important behavior and edge cases in a real browser.
5. Write the detailed reference pages and machine-readable indexes.
6. Validate the knowledgebase against practical implementation tasks performed without reopening source.
7. Only after that gate passes, declare source-level mastery and begin rebuilding the Labs portal from a clean purpose-driven design.

This knowledgebase is intended to reduce repeated source reading, not to hide uncertainty. Where it does not yet contain a reliable answer, it must say so explicitly.

---
name: activequery-foundation
description: Use when researching, documenting, integrating or building with the ActiveQuery ecosystem. Enforces knowledgebase-first retrieval, source traceability, upstream attribution and separation between upstream capabilities and community additions.
---

# ActiveQuery Foundation Skill

## Required workflow

1. Read `knowledgebase/README.md` and the relevant reference page before searching source.
2. Check `knowledgebase/source-baseline.md` to confirm that the reference matches the version in use.
3. Treat the knowledgebase as the primary engineering reference. Do not reread entire upstream source files for routine questions already answered there.
4. Reopen upstream source only for documented gaps, version drift, discrepancies or new research.
5. When new source facts are discovered, add them to the knowledgebase with exact source anchors and evidence status.
6. Distinguish source-confirmed facts, runtime-verified behavior, derived conclusions and unverified assumptions.
7. Never invent selectors, APIs, signatures, options or behavior.
8. Build the smallest reproducible example and test it in a browser when behavior matters.
9. Document known limitations and unverified behavior explicitly.
10. Do not declare mastery until every item in `knowledgebase/mastery-gate.md` is evidenced.

## Source repositories

- AQCSS: https://github.com/ActiveQuery/CSS
- AQJS: https://github.com/ActiveQuery/JS
- Governance: https://github.com/ActiveQuery/Governance

## Licensing guardrails

AQCSS and AQJS source headers identify OSL-3.0 and contain copyright/third-party notices. Do not relicense, remove, or modify those notices. Verify the current upstream license file before copying or redistributing any upstream source. Third-party notices remain applicable.

## Deliverables

For each new capability, produce:
- source-backed reference notes;
- runnable example;
- human-readable usage documentation;
- agent-readable implementation recipe where reusable;
- validation notes and known limitations.

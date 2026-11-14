---
name: activequery-foundation
description: Use when researching, documenting, integrating or building with the ActiveQuery ecosystem. Enforces knowledgebase-first retrieval, source traceability, upstream attribution and separation between upstream capabilities and community additions.
---

# ActiveQuery Foundation Skill

## Required workflow

1. Read `knowledgebase/README.md` and the relevant reference page before searching source.
2. Check `knowledgebase/source-baseline.md` and `knowledgebase/source-freshness.md` to confirm the pinned source hashes and latest upstream `main` refs.
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

AQCSS and AQJS source headers identify OSL-3.0 and contain copyright/third-party notices. Do not relicense, remove, or modify those notices. OSL-3.0 has a broad External Deployment provision that treats network availability to others as distribution under section 1(c); do not assume a public portal that bundles these assets is outside the license. Section 3 specifically places the machine-readable Original Work source-availability duty on the Licensor; do not overstate it as an explicit downstream source-delivery clause for every derivative copy. Sections 1(c), 5, 6 and 9 impose the distribution/deployment, notice and reasonable-effort-to-obtain-recipient-assent conditions. Preserve copyright/license/attribution notices and prominent modification notices in derivative source where required. No trademark license is granted. Obtain legal review before deciding how the portal itself must be licensed or distributed. Upstream contributions also require DCO `Signed-off-by` on each commit; the sign-off record is public and retained indefinitely. Third-party notices remain applicable.

## Deliverables

For each new capability, produce:
- source-backed reference notes;
- runnable example;
- human-readable usage documentation;
- agent-readable implementation recipe where reusable;
- validation notes and known limitations.

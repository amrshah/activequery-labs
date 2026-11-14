---
name: aqjs-engineering
description: Use when integrating, implementing, testing or documenting ActiveQuery JavaScript (AQJS).
---

# AQJS Engineering Skill

## Knowledgebase-first process

- Start with `knowledgebase/aqjs/` and `knowledgebase/architecture/aqjs-runtime-model.md`.
- Check the pinned AQJS SHA in `knowledgebase/source-baseline.md`.
- Use the API inventory for known signatures and behavior; do not reread the entire implementation for routine questions.
- If a method is missing, ambiguous or marked suspicious, inspect its exact implementation and update the knowledgebase with source anchors.
- Distinguish Element, NodeList and other prototype APIs. Do not assume parity.
- Avoid optional global/prototype extensions unless the use case requires them and their side effects are documented.

## Safe examples

- Keep examples isolated and small.
- Use native browser APIs where AQJS does not provide a verified relevant feature.
- Do not label native JavaScript as an AQJS API.
- Record console errors, initialization timing and browser compatibility.
- Update the source inventory whenever upstream changes.

See `knowledgebase/testing/source-findings.md` for current suspected issues and `knowledgebase/mastery-gate.md` for the mastery criteria.

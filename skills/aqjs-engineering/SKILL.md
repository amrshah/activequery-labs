---
name: aqjs-engineering
description: Use when integrating, implementing, testing or documenting ActiveQuery JavaScript (AQJS).
---

# AQJS Engineering Skill

## Source-first process

- Inspect the current `ActiveQuery/JS` source and README before implementation.
- Verify exported names, constructor behavior, method signatures, return values, side effects and timing from source.
- AQJS v25.6.0 source inspected for the portal exports a named `ActiveQuery` class. Do not assume a default export.
- Test module loading in the target browser. Do not assume a raw GitHub URL is a valid ES module CDN endpoint.
- Avoid optional prototype/global extensions unless the use case requires them and their side effects are documented.

## Safe examples

- Keep examples isolated and small.
- Use native browser APIs where AQJS does not provide a verified relevant feature.
- Do not label native JavaScript as an AQJS API.
- Record console errors, initialization timing and browser compatibility.
- Update the source inventory whenever upstream changes.

See `docs/RESEARCH-BASELINE.md` for the current inspected source baseline; re-verify before use.

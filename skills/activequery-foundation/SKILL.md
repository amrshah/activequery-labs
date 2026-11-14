---
name: activequery-foundation
description: Use when researching, documenting, integrating or building with the ActiveQuery ecosystem. Enforces source-first verification, upstream attribution, licensing care and separation between upstream capabilities and community additions.
---

# ActiveQuery Foundation Skill

## Required workflow

1. Identify the exact upstream repository and branch/version before implementation.
2. Read the upstream README, full source file(s), license and third-party notices. Do not rely on summaries or memory.
3. Record verified facts with source path, version/commit and confidence.
4. Distinguish upstream functionality, browser-native functionality and custom ActiveQuery Labs code.
5. Never invent selectors, APIs, signatures, options or behavior.
6. Build the smallest reproducible example and test it in a browser.
7. Document known limitations and unverified behavior explicitly.

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

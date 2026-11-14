---
name: aqcss-engineering
description: Use when building layouts, styling components, responsive interfaces or documenting ActiveQuery CSS (AQCSS).
---

# AQCSS Engineering Skill

## Knowledgebase-first process

- Start with `knowledgebase/aqcss/` and `knowledgebase/source-traceability/index.md`.
- Check the pinned AQCSS SHA in `knowledgebase/source-baseline.md`.
- Do not scan the entire stylesheet for selectors already catalogued.
- If a selector is absent or marked unverified, inspect its complete rule block and all responsive overrides, then update the knowledgebase.
- Record exact selector spelling. Do not normalize unusual names.
- Separate AQCSS selectors from bundled W3CSS/Normalize.css selectors and custom component CSS.
- Prefer existing AQCSS primitives only when their behavior is source-confirmed and appropriate.

## Responsive verification

Use the actual breakpoint mapping in the knowledgebase. Test 320, 360, 390, 599, 600, 768, 992, 993, 1024, 1280, 1439, 1440 and 1920 CSS pixels when relevant. Check horizontal overflow, clipping, focus visibility, touch targets, wrapping, long content and zoom. Record actual browser/version and results.

## Evidence

Source notes are not browser proof. See `knowledgebase/testing/source-findings.md` for anomalies that need runtime verification and `knowledgebase/mastery-gate.md` for the completion criteria.

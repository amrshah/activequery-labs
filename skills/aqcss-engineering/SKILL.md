---
name: aqcss-engineering
description: Use when building layouts, styling components, responsive interfaces or documenting ActiveQuery CSS (AQCSS).
---

# AQCSS Engineering Skill

## Source-first process

- Inspect the current `ActiveQuery/CSS` source and version before choosing classes.
- Search the actual stylesheet for each selector and read its complete rule block, including responsive overrides.
- Record selector spelling exactly. Do not normalize unusual names.
- Separate AQCSS selectors from bundled W3CSS/Normalize.css selectors and from custom component CSS.
- Prefer existing AQCSS primitives over new custom declarations when the source proves they fit.
- Add component-specific CSS only for genuine gaps; namespace it to avoid collisions.

## Responsive verification

Test at 320, 360, 390, 600, 768, 992, 1024, 1280, 1440 and 1920 CSS pixels when relevant. Check horizontal overflow, clipping, focus visibility, touch targets, wrapping, long content and zoom. Record actual browser/version and results.

## Evidence

The current portal research baseline records selector examples and breakpoints inspected on 2026-11-14. It is an orientation aid, not a substitute for inspecting the current upstream source. See `docs/RESEARCH-BASELINE.md`.

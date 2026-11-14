---
name: activequery-component-engineering
description: Use when creating reusable UI components and patterns on top of ActiveQuery CSS and JS.
---

# ActiveQuery Component Engineering Skill

## Component contract

Every component must state:
- purpose and variants;
- semantic HTML structure;
- AQCSS selectors actually used;
- custom CSS added and why;
- AQJS APIs used, if any, with verified signatures;
- keyboard, focus and accessibility behavior;
- responsive behavior and tested viewport sizes;
- dependency and browser requirements;
- complete copyable source.

## Implementation rules

1. Inspect AQCSS first; reuse verified primitives.
2. Use native HTML elements and browser capabilities when appropriate.
3. Use AQJS only when a verified AQJS capability materially improves the component.
4. Keep custom styles scoped and avoid generic global selectors.
5. Prefer progressive enhancement and ensure essential content works without JavaScript.
6. Add a playground example with editable HTML/CSS/JS and a live isolated preview.
7. Never claim a component is shipped by upstream AQCSS/AQJS unless upstream source proves it.

## Quality gates

- Keyboard-only operation.
- Visible focus and appropriate ARIA semantics.
- Responsive checks including narrow screens and long content.
- No console errors.
- Reset and copy behavior in the playground.
- Source code matches the displayed working example.

# Source Findings and Verification Queue

Snapshot: 2026-11-14. All entries below are source-observed anomalies or questions, not confirmed runtime defects unless explicitly marked.

## AQCSS findings

| ID | Source location | Observation | Risk / question | Required validation |
|---|---|---|---|---|
| CSS-001 | `ActiveQuery.css:64-76` | The same `--aq-swatch-*` custom properties are declared first as RGB channel triplets and then again as hex colors within the same root declaration block. The later declarations win in the cascade. | Rules that consume tokens through legacy `rgb(var(--aq-swatch-secondary))` syntax may behave differently from rules using modern relative-color syntax `rgb(from var(...) r g b / ...)`. | Browser computed-style tests for borders and all swatch variants. |
| CSS-002 | `ActiveQuery.css:586`, repeated in responsive families around 926, 1250 and 1574 | `.aq-facet--third` is assigned `width: 3.33333%`, while the corresponding height variant and 12-column fractions use approximately 33.33333% for one third. | Likely decimal-place typo. Do not silently document as 33.33333%. | Compare actual computed width and intended naming across all responsive variants. |
| CSS-003 | `ActiveQuery.css:809-810`, repeated at 1132-1133, 1456-1457 and 1779-1781 | `*-flexon--row-gap-xlarge` assigns `row-gap: 2!important` without a CSS length unit. | The declaration is invalid for row-gap and will be discarded by conforming browsers. | Browser computed style should show no valid 2-unit gap from this declaration. |
| CSS-004 | `ActiveQuery.css:1465-1468`, `1477-1479` | Large-screen typography selectors include `.aq-S-text--...` with uppercase S while adjacent family uses lowercase `.aq-s-text--...`. | Case-sensitive class token mismatch likely makes these selectors inconsistent with naming convention. | Verify which spelling is actually intended and whether both forms are supported. |
| CSS-005 | `ActiveQuery.css:813`, `1137`, `1461` | Responsive families activate at min-width 600px, 993px and 1440px. The corresponding class prefixes are `aq-t-`, `aq-d-` and `aq-s-`. Many `aq-m-` rules are paired with base rules outside media queries. | Do not infer `m` means medium breakpoint. It appears to be the baseline/mobile companion family; actual semantics are determined by rule placement. | Create viewport tests at 320, 599, 600, 992, 993, 1439 and 1440 CSS px. |
| CSS-006 | `ActiveQuery.css:1788-1804` | For short landscape viewports (max-height 550px), body overflow is hidden and a fixed pseudo-element displays a rotate-device message. | This is intrusive for small-height desktop windows and landscape tablets; determine whether it is intentionally broad. | Browser tests across mobile landscape and desktop short-height windows. |
| CSS-007 | `ActiveQuery.css:1785-1807` | Touch/hover/viewport visibility helpers use pointer capability and width queries independently. | A device category cannot be inferred from viewport width alone; hybrid touch laptops may match capability rules. | Test touch laptops, tablets with mouse, and desktop emulation. |

## AQJS findings

| ID | Source location | Observation | Risk / question | Required validation |
|---|---|---|---|---|
| JS-001 | `ActiveQuery.js:246,249` | `isNodeList(a)` and `isNaNL(a)` use `x.toString()` rather than the parameter `a`. | Likely ReferenceError or accidental dependence on a global `x`. | Test with and without a global x binding. |
| JS-002 | `ActiveQuery.js:393-394` | Array `setSort` comparator assigns `aVal` and `bVal` without declarations. | Potential global leakage or strict/module ReferenceError. | Execute under ES module strict semantics and test sort correctness. |
| JS-003 | `ActiveQuery.js:410` | Array `setItem(a,b)` returns early when either argument is truthy, only reaching splice when both are falsy. | Likely reversed guard or unintended contract. | Test index/value combinations, including zero, empty string, null and ordinary values. |
| JS-004 | `ActiveQuery.js:567` | Element `siblings()` default branch references `target.parentNode`, but local variable is named `t`. | Likely ReferenceError unless a global target exists. | Test default sibling path in isolated page. |
| JS-005 | `ActiveQuery.js:785` | NodeList `siblings()` default branch also references `target.parentNode`. | Same likely undeclared identifier issue; collection logic also requires inspection. | Test empty, one-element and multi-element NodeLists. |
| JS-006 | `ActiveQuery.js:962` | `sancha` references `variables[...] ` in placeholder processing. | Requires a global `variables` binding not established in the inspected source. | Test with and without that binding and assess template injection risks. |
| JS-007 | `ActiveQuery.js:991` | `sancha` calls `args.then()` without checking it is a function in the shown path. | Optional callback may throw when omitted or invalid. | Test missing, null and non-function callback values. |
| JS-008 | `ActiveQuery.js:1133` | `watch` observer callback calls `args.then()` without visible validation. | Observer callback may throw; lifecycle/disconnect handling also needs examination. | Test missing callback and mutation behavior; inspect fallback observer separately. |
| JS-009 | `ActiveQuery.js:37-55` | Constructor optional alias mutates `window`, Element, NodeList and Object prototypes. | Collision and global side effects. | Test collision behavior and cross-library interactions; document safe usage constraints. |
| JS-010 | `ActiveQuery.js:319-425` | Array and Element methods contain unusual guards, mixed return types and assignment-in-predicate behavior. | API users may assume conventional semantics incorrectly. | Build per-method behavior tests before recommending methods. |

## Corrective policy

This repository documents upstream behavior; it does not patch upstream source. A suspected defect should be recorded, reproduced, and reported upstream when appropriate. The Labs portal may demonstrate a safe workaround, but must label it as a workaround rather than claiming it is native framework behavior.

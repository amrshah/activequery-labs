# AQCSS Media-Query and Responsive Selector Map

Source: ActiveQuery CSS v25.6.0, pinned Git blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-16.

Status: **source-mapping pass complete for the pinned AQCSS stylesheet.** The complete media-query inventory, responsive token-prefix comparison, family-level declaration/cascade maps and cross-family conflict audit are linked below. This is not a claim that every possible class combination has been browser-tested; runtime coverage remains a separate Gate C activity.

## Method and counting rules

- Media blocks and source line ranges were read from the pinned `ActiveQuery.css`.
- Rule-block counts and exact enclosing media contexts were checked against `knowledgebase/aqcss/rule-catalog.json` (PostCSS AST catalogue).
- Responsive token comparisons use the catalogue's class tokens. For each breakpoint family, the `aq-t-`, `aq-d-` or lowercase `aq-s-` prefix was normalized to `aq-m-` and checked for an existing base-context token.
- A token match proves only that a corresponding token spelling exists in the base context. It does not prove identical declarations, computed behavior, or semantic equivalence.
- Exact selector duplication was checked by comparing full selector strings across all catalogue rule blocks and their enclosing media contexts.
- Declaration behavior, importance, specificity and source-order interactions are documented in the family maps and cross-family audit. The maps identify concrete observed interactions; they are not an exhaustive combinatorial enumeration of every possible class list.

## Complete media-query inventory

There are **10 media-query occurrences and 9 unique conditions**. The `min-width:1440px` condition occurs twice: once for the large-screen utility block and once for the screen-hide helper.

| Source line(s) | Exact media prelude | Rule blocks | Selector scope / observed role |
|---|---|---:|---|
| 813–1135 | `@media(min-width:600px)` | 303 | `aq-t-` tablet-prefixed utility family |
| 1137–1459 | `@media(min-width:993px)` | 303 | `aq-d-` desktop-prefixed utility family |
| 1461–1783 | `@media(min-width:1440px)` | 303 | `aq-s-` large-screen utility family |
| 1785 | `@media(pointer: coarse)  and (hover: none)` | 1 | `.aq-facet-hide-on-touch` |
| 1786 | `@media (min-width:1px)and(max-width:600px)` | 1 | `.aq-facet-hide-on-mobile`; malformed range |
| 1787 | `@media(min-width:601px)and(max-width:992px)` | 1 | `.aq-facet-hide-on-tablet`; malformed range |
| 1788–1803 | `@media(max-height:550px) and (orientation: landscape)` | 2 | `body` overflow and `body::after` orientation overlay |
| 1805 | `@media(pointer: fine) and (hover: hover)` | 1 | `.aq-facet-hide-on-no-touch` |
| 1806 | `@media(min-width:993px)and(max-width:1439px)` | 1 | `.aq-facet-hide-on-desktop`; malformed range |
| 1807 | `@media(min-width:1440px)` | 1 | `.aq-facet-hide-on-screen` |

The AST catalogue's aggregated rule counts by unique condition are:

| Enclosing context | Rule blocks |
|---|---:|
| Base, no media query | 500 |
| `min-width:600px` | 303 |
| `min-width:993px` | 303 |
| `min-width:1440px` (both occurrences combined) | 304 |
| Coarse pointer / no hover | 1 |
| Malformed mobile range | 1 |
| Malformed tablet range | 1 |
| Short landscape | 2 |
| Fine pointer / hover | 1 |
| Malformed desktop range | 1 |
| **Total** | **1,417** |

The three min-width utility blocks are cumulative, not mutually exclusive ranges. At 1440px and wider, the 600px, 993px and 1440px min-width conditions can all match. Prefix names describe the framework's naming convention; they do not detect physical device types.

## Runtime interpretation of the media conditions

### Width breakpoints

- The `aq-t-` family becomes eligible at 600 CSS px.
- The `aq-d-` family becomes eligible at 993 CSS px.
- The `aq-s-` family becomes eligible at 1440 CSS px.
- These are min-width conditions. Earlier families remain eligible at wider widths unless selector matching, specificity, importance or later declarations change the winning result.

### Malformed hide ranges

The source contains these exact preludes:

- Line 1786: `@media (min-width:1px)and(max-width:600px)`
- Line 1787: `@media(min-width:601px)and(max-width:992px)`
- Line 1806: `@media(min-width:993px)and(max-width:1439px)`

The missing whitespace around the `and` operator makes these malformed media-query expressions. Chromium and Firefox ignore them. Consequently, the mobile, tablet and desktop hide helpers do not hide their target elements under the tested widths. Do not describe these as functioning device or viewport visibility helpers.

The separate line-1807 `min-width:1440px` screen-hide query is syntactically valid and was runtime-verified in the existing browser suite.

### Pointer and hover conditions

- Line 1785 targets `pointer: coarse` with `hover: none`.
- Line 1805 targets `pointer: fine` with `hover: hover`.

These are input-capability conditions, not viewport breakpoints or device-brand detection. Hybrid devices can expose different pointer/hover combinations; comprehensive touch and hybrid-device behavior remains unverified.

### Short landscape condition

Lines 1788–1803 target a viewport with `max-height:550px` in landscape orientation. The block changes body overflow and defines a fixed `body::after` overlay.

The existing runtime record reports that at 800×550 Firefox renders the overlay, while Chromium drops the `body::after` rule after the stray semicolon in the source block. At 800×551 neither renders it. Treat this as browser-specific observed behavior, not a reliable cross-browser orientation lock.

## Responsive selector-prefix correspondence

The comparison below asks whether a responsive class token has a same-suffix `aq-m-` token in the base (no-media) rules. It does not infer that the two declarations are equivalent.

| Responsive family | Unique lowercase family tokens | Same-suffix base `aq-m-` token found | Not found |
|---|---:|---:|---|
| `aq-t-` | 317 | 316 | `aq-t--no-margin` |
| `aq-d-` | 317 | 316 | `aq-d--no-margin` |
| `aq-s-` | 312 | 311 | `aq-s--no-margin` |

Additional large-screen observations:

- The 1440px block contains five uppercase-`S` tokens rather than the expected lowercase-`s` prefix: `aq-S-text--h4`, `aq-S-text--h5`, `aq-S-text--h6`, `aq-S-text--fs-2` and `aq-S-text--fs-3` (lines 1465–1467 and 1477–1478).
- These uppercase tokens are not members of the lowercase `aq-s-` family. The heading 4/5/6 and font-size 2/3 variants share this case anomaly.
- `.aq-facet-hide-on-screen` at line 1807 is an additional non-prefixed selector in the 1440px media condition; it is not included in the 312-token lowercase family count.
- The three unmatched lowercase `no-margin` spellings are not found as same-suffix `aq-m-` base tokens. Do not silently substitute the separate `margin-no` spelling.

## Exact selector duplication and cross-context overrides

The catalogue contains 1,417 rule blocks and 1,409 unique selector strings. Eight selector strings occur more than once. **None of these exact selector duplicates occurs across different media contexts.** The repeated selectors are:

| Selector | Source lines | Context | Observation |
|---|---:|---|---|
| `hr` | 148, 249 | Base | Separate reset and visual-rule blocks |
| `blockquote:is(.aq-fleek--blockquote,[aq-fleek],[AQ-FLEEK])` | 454, 461 | Base | Separate typography/layout and display declarations |
| `.aq-t--margin-right` | 859, 860 | 600px+ | Same selector split into left-margin and right-margin declarations |
| `.aq-t--padding-right` | 895, 896 | 600px+ | Same selector split into left-padding and right-padding declarations |
| `.aq-d--margin-right` | 1183, 1184 | 993px+ | Same selector split into left-margin and right-margin declarations |
| `.aq-d--padding-right` | 1219, 1220 | 993px+ | Same selector split into left-padding and right-padding declarations |
| `.aq-s--margin-right` | 1507, 1508 | 1440px+ | Same selector split into left-margin and right-margin declarations |
| `.aq-s--padding-right` | 1543, 1544 | 1440px+ | Same selector split into left-padding and right-padding declarations |

For the six responsive right-side utility duplicates, the declarations combine through the normal cascade: despite the `--right` name, the resulting rule applies both left and right spacing. Preserve the source's exact behavior in documentation and tests; do not rename or repair upstream selectors here.

This exact-string comparison does **not** mean there are no cascade interactions. Different selectors can target the same element and property, including responsive utility classes, base styles, pseudo-classes and global selectors. The concrete, source-traced interactions are documented in the family and cross-family references below.

## Declaration and cascade coverage index

The following references collectively close the source-mapping pass for the pinned stylesheet. Use the family page for the exact selector/declaration behavior; use the cross-family audit for interactions between families.

| Coverage area | Canonical reference | Scope captured |
|---|---|---|
| Overall cascade, specificity and importance | [cascade-and-specificity.md](cascade-and-specificity.md) | Rule counts, importance, responsive contexts, custom-property hazards and cascade policy |
| Margin and padding | [spacing-cascade-map.md](spacing-cascade-map.md) | Scale, aliases, responsive source order, shorthand/longhand behavior and known left/right selector defect |
| Width, height and viewport sizing | [sizing-cascade-map.md](sizing-cascade-map.md) | Fractions, constraints, responsive precedence and third-width defect |
| Flex display, flow, alignment and gaps | [flex-cascade-map.md](flex-cascade-map.md) | Base/responsive selector defects, important declarations, alignment and gap behavior |
| Positioning and affix | [positioning-cascade-map.md](positioning-cascade-map.md) | Position modes, edge/corner helpers, importance, transforms and responsive copies |
| Typography | [typography-cascade-map.md](typography-cascade-map.md) | Root tokens, headings, text helpers, responsive overrides and known defects |
| Visibility and interaction states | [visibility-interaction-cascade-map.md](visibility-interaction-cascade-map.md) | Display/visibility, malformed hide ranges, pointer rules, hover/focus/disabled states |
| Borders, swatches and effects | [theme-effects.md](theme-effects.md) | Border/radius, swatch, background image, filter, opacity and overlay rules |
| Base styles and controls | [base-controls.md](base-controls.md) | Global resets, form controls, native elements, helper selectors and clearfix boundaries |
| Cross-family conflicts | [cross-family-cascade-audit.md](cross-family-cascade-audit.md) | Property overlap, specificity/importance, responsive overlap, selector-match failures and authoring strategy |

The machine-readable [rule catalog](rule-catalog.json), [selector index](rule-selector-index.json) and [class-token index](class-token-index.json) retain the full structural inventory and source anchors. The maps above interpret the important declaration families; the indexes remain the fallback for an individual selector not discussed in prose.

## Remaining work — runtime validation, not source mapping

The source-mapping pass is complete against the pinned AQCSS v25.6.0 source. The following items belong to Gate C and must not be confused with missing source documentation:

1. Add focused computed-style tests for the documented responsive token-prefix anomalies and cumulative cross-breakpoint combinations.
2. Expand viewport boundary tests around 992/993 and 1439/1440px for representative selector families.
3. Exercise coarse/fine pointer and hybrid-input contexts in browser/device emulation where supported.
4. Keep the short-landscape Chromium/Firefox divergence explicit and test it if the portal relies on that behavior.
5. Do not treat the source map as proof that every possible class combination is runtime-verified.

## Source anchors

- [Pinned upstream stylesheet](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L813-L1807)
- [Generated AQCSS rule catalogue](rule-catalog.json)
- [Responsive semantics](tokens-and-responsive.md)
- [Cascade and specificity model](cascade-and-specificity.md)
- [Runtime validation matrix](../testing/runtime-validation-matrix.md)

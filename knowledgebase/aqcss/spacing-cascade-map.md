# AQCSS Spacing Utility Cascade Map

Source: AQCSS v25.6.0, pinned upstream `ActiveQuery.css` blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-15.
Scope: margin and padding utility declarations only. This is a source-level cascade analysis; no upstream stylesheet or runtime test was changed or added.

## Breakpoint and source-order model

| Family | Source context | Eligible viewport |
|---|---|---|
| Base / `aq-m-` | Outside media query; base utilities generally pair unprefixed `aq--*` selectors with `aq-m--*` selectors | All widths |
| `aq-t-` | `@media(min-width:600px)` | 600 CSS px and wider |
| `aq-d-` | `@media(min-width:993px)` | 993 CSS px and wider |
| `aq-s-` | `@media(min-width:1440px)` | 1440 CSS px and wider |

These are cumulative min-width contexts, not exclusive device ranges. The responsive blocks occur in ascending source order (base, tablet, desktop, large screen).

## Shared spacing scale

| Suffix | Value |
|---|---:|
| `*-small` | 0.5rem |
| no size suffix | 1rem |
| `*-large` | 2rem |
| `*-xlarge` | 3rem |
| `*-xxlarge` | 5rem |

The all-side utilities use `margin` or `padding` shorthand. Directional utilities use the corresponding longhand properties. The declarations in this family are marked `!important`.

## Selector-to-property map

| Utility shape | Properties set | Value |
|---|---|---|
| `--margin-no` / `--no-margin` | `margin` | 0 |
| `--margin-all[-size]` | `margin` | 0.5 / 1 / 2 / 3 / 5rem |
| `--margin-left-right[-size]` | `margin-left`, `margin-right` | scale value |
| `--margin-top-bottom[-size]` | `margin-top`, `margin-bottom` | scale value |
| `--margin-top[-size]`, `--margin-bottom[-size]` | respective side | scale value |
| `--margin-left[-size]`, `--margin-right[-size]` | respective side, with the 1rem left alias caveat below | scale value |
| `--padding-no` / `--no-padding` | `padding` | 0 |
| `--padding-all[-size]` | `padding` | 0.5 / 1 / 2 / 3 / 5rem |
| `--padding-left-right[-size]` | `padding-left`, `padding-right` | scale value |
| `--padding-top-bottom[-size]` | `padding-top`, `padding-bottom` | scale value |
| `--padding-top[-size]`, `--padding-bottom[-size]` | respective side | scale value |
| `--padding-left[-size]`, `--padding-right[-size]` | respective side, with the 1rem left alias caveat below | scale value |

The responsive prefixes are inserted before the double-hyphen utility segment: `aq-t--margin-all`, `aq-d--padding-top`, `aq-s--margin-right-large`, etc. Base rules pair many unprefixed selectors (`aq--*`) with `aq-m--*` selectors in the same rule. The reset aliases are not perfectly uniform; use the source spellings rather than generating aliases by pattern.

## Confirmed 1rem left/right selector defect

At the 1rem (unsuffixed) size, the left-side selectors are incorrectly paired with the right-side responsive/base selector name:

- Base: `.aq--margin-left,.aq-m--margin-right` sets `margin-left:1rem!important`.
- Base: `.aq--margin-right,.aq-m--margin-right` sets `margin-right:1rem!important`.
- The same pattern is repeated in tablet, desktop and screen contexts: `.aq-t--margin-right`, `.aq-d--margin-right`, `.aq-s--margin-right` each appear twice, once for left and once for right.
- Padding repeats the defect: base `.aq--padding-left,.aq-m--padding-right` sets left padding, and `.aq--padding-right,.aq-m--padding-right` sets right padding; responsive `--padding-right` selectors are each repeated for left and right.

Consequences:
1. The responsive/base `aq-*-*-margin-right` selector (for the applicable prefix) sets both left and right 1rem margins.
2. The responsive/base `aq-*-*-padding-right` selector sets both left and right 1rem padding.
3. There is no corresponding responsive/base 1rem `aq-*-*-margin-left` or `aq-*-*-padding-left` selector in these rules.
4. The unprefixed `.aq--margin-left` and `.aq--padding-left` selectors do set the respective left side.
5. Small, large, xlarge and xxlarge left/right utilities use distinct, correctly named selectors. Do not generalize the 1rem defect to every size.

This is a source defect, not an intended alias convention. Do not repair upstream source as part of knowledgebase work.

## Cascade outcomes for combinations

All these spacing utility selectors are single-class selectors (specificity `0-1-0`) and their declarations use `!important`. For declarations that target the same property, importance and specificity tie; source order then decides the winner. Media-query eligibility determines which declarations participate.

| Combination on one element | Expected winning behavior |
|---|---|
| Base `aq-m--margin-all` + `aq-t--margin-all` at 600px+ | Tablet 1rem shorthand wins; same value, so no visible difference |
| `aq-t--margin-all` + `aq-d--margin-all` at 993px+ | Desktop shorthand wins by later source order |
| `aq-d--margin-all` + `aq-s--margin-all` at 1440px+ | Screen shorthand wins by later source order |
| Base all-side margin + responsive top margin | Responsive top longhand overrides only the top side; base shorthand continues to supply the other sides |
| Base top margin + responsive all-side margin | Responsive shorthand wins for all four sides |
| Same responsive prefix: `--margin-all` + `--margin-top` | The top longhand appears later in that family and wins top; shorthand still supplies the other sides |
| `aq-t--margin-all` + `aq-d--margin-top` at 993px+ | Desktop top longhand wins top; tablet shorthand remains effective on the other sides |
| `aq-s--margin-right` at 1440px+ | Both left and right become 1rem because the selector is duplicated with two longhand declarations |

The same shorthand/longhand and source-order reasoning applies to padding. Different properties do not compete: for example, a margin utility and a padding utility both remain effective.

Important distinction: adding several responsive classes does not make them mutually exclusive. At 1440px, tablet, desktop and screen classes can all match. When they set the same property with equal importance and specificity, later source order normally gives the higher-prefix rule precedence.

## Alias and token spelling cautions

- Base reset: `.aq-no-margin,.aq-m--margin-no` sets zero margin. The base no-margin spelling is not a fully symmetric `aq--margin-no` alias.
- Responsive reset rules use paired `aq-t--margin-no,.aq-t--no-margin`, and analogous desktop/screen spellings.
- Base padding reset includes `aq--padding-no`, `aq--no-padding`, `aq-m--padding-no` and `aq-m--no-padding`; responsive reset rules also include both spellings.
- The responsive family token inventory found `aq-t--no-margin`, `aq-d--no-margin`, and `aq-s--no-margin` without a same-suffix base `aq-m--no-margin` token. Do not assume a generated `aq-m--no-margin` alias exists.
- `aq-m--margin-right` and `aq-m--padding-right` are the 1rem left+right defect selectors described above; do not infer they mean right only.

## Source anchors

- Base spacing utilities: [ActiveQuery.css lines 503–575](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L503-L575)
- Tablet spacing utilities: [lines 830–895](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L830-L895)
- Desktop spacing utilities: [lines 1162–1227](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1162-L1227)
- Screen spacing utilities: [lines 1484–1549](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1484-L1549)
- Media context inventory: [media-query-and-selector-map.md](media-query-and-selector-map.md)
- General cascade model: [cascade-and-specificity.md](cascade-and-specificity.md)
- Layout utility overview: [layout-utilities.md](layout-utilities.md)

## Validation status and remaining scope

- The declarations and source order above are source-confirmed against the pinned stylesheet.
- The shorthand/longhand winner examples are derived from standard CSS cascade rules; they have not yet been added as dedicated browser assertions in the Labs test suite.
- No runtime claim is made here about every class combination or viewport. Add a small set of computed-style tests before treating this map as runtime-verified.
- This document maps spacing utilities only. The full Gate A criterion remains open: sizing, flex, positioning, typography, visibility, theme/global rules, selector overlaps and pseudo-class interactions still need equivalent declaration-level treatment.

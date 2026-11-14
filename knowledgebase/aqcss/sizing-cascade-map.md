# AQCSS Facet Sizing Cascade Map

Source: AQCSS v25.6.0, pinned upstream `ActiveQuery.css` blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-15.
Scope: the `aq-facet` sizing/viewport utility family only. This is a source-level cascade analysis; no upstream stylesheet, application code or runtime tests were changed.

## Source coverage and responsive families

The pinned stylesheet contains 536 facet sizing rule blocks: 134 in each of four contexts.

| Family | Source lines | Activation | Selector forms |
|---|---:|---|---|
| Base | 575–708 | All widths | `aq-facet--*` and paired `aq-m-facet--*` selectors |
| Tablet | 915–1048 | `min-width:600px` | `aq-t-facet--*` |
| Desktop | 1239–1372 | `min-width:993px` | `aq-d-facet--*` |
| Screen | 1563–1696 | `min-width:1440px` | `aq-s-facet--*` |

The min-width contexts are cumulative. At 1440 CSS px and above, the tablet, desktop and screen-prefixed classes can all participate alongside base classes. They are not mutually exclusive device modes.

The base family pairs the unprefixed `aq-facet--*` spelling with `aq-m-facet--*` in the same selector rule. The responsive families use their own prefix before `facet`; do not invent `aq-m-` spellings for responsive tokens.

## Utility families and properties

| Utility shape | Property | Meaning / value |
|---|---|---|
| `--full` | `width:100%; height:100%` | Fills the containing block in both axes |
| `--full-screen` | `width:100vw; height:100vh` | Viewport width and height |
| `--wide-auto`, `--w-auto` | `width:auto` | Automatic width; two spellings |
| `--tall-auto`, `--h-auto` | `height:auto` | Automatic height; two spellings |
| `--rest` | `overflow:hidden` | Hides overflow; does not calculate or occupy remaining space |
| `--wide-screen` | `width:100vw` | Viewport width |
| `--tall` | `height:100%` | Full containing-block height |
| `--tall-screen` | `height:100vh` | Viewport height |
| `--quarter`, `--half`, `--two-third`, `--three-quarter` | `width` | 24.99999%, 49.99999%, 66.66666%, 74.99999% |
| `--quarter-tall`, `--third-tall`, `--half-tall`, `--two-third-tall`, `--three-quarter-tall` | `height` | Corresponding percentage of containing-block height |
| `--quarter-tall-screen`, `--third-tall-screen`, `--half-tall-screen`, `--two-third-tall-screen`, `--three-quarter-tall-screen` | `height` | Corresponding percentage of viewport height |
| `--w-1` through `--w-12` | `width` | 1/12 through 12/12 (8.33333% increments) |
| `--w-min-1` through `--w-min-12` | `min-width` | 1/12 through 12/12 |
| `--w-max-1` through `--w-max-12` | `max-width` | 1/12 through 12/12 |
| `--h-1` through `--h-12` | `height` | 1/12 through 12/12 |
| `--h-min-1` through `--h-min-12` | `min-height` | 1/12 through 12/12 |
| `--h-max-1` through `--h-max-12` | `max-height` | 1/12 through 12/12 |
| `--vh-1` through `--vh-12` | `height` | 1/12 through 12/12 of viewport height |
| `--vh-min-1` through `--vh-min-12` | `min-height` | 1/12 through 12/12 of viewport height |
| `--vh-max-1` through `--vh-max-12` | `max-height` | 1/12 through 12/12 of viewport height |

The percentage-based `w`, `w-min`, `w-max`, `h`, `h-min` and `h-max` utilities are relative to the relevant containing block, not the viewport. The `vh` family explicitly uses viewport-height units.

## Confirmed width-shortcut defect: `third`

The width shortcut is authored as `3.33333%`, not the expected one-third value `33.33333%`. This is repeated in all four contexts:

| Class | Source line | Authored width |
|---|---:|---:|
| `.aq-facet--third` / `.aq-m-facet--third` | 586 | 3.33333% |
| `.aq-t-facet--third` | 926 | 3.33333% |
| `.aq-d-facet--third` | 1250 | 3.33333% |
| `.aq-s-facet--third` | 1574 | 3.33333% |

The related height shortcuts `--third-tall` use `33.33333%`, and `--third-tall-screen` use `33.33333vh`. The independent `--w-4` utility also uses `33.33333%`. These comparisons establish an internal inconsistency, but do not authorize an assumption that the width shortcut behaves as one-third.

Treat this as a source-confirmed defect. Do not correct the source or document the intended value as actual behavior without an upstream change.

## Importance and specificity

In each of the four facet blocks, `--full` is the only rule whose declarations are not marked `!important`:

- Base `.aq-facet--full,.aq-m-facet--full`: line 575.
- Tablet `.aq-t-facet--full`: line 915.
- Desktop `.aq-d-facet--full`: line 1239.
- Screen `.aq-s-facet--full`: line 1563.

The other 133 rules in each context use `!important`, including `full-screen`, auto sizing, `rest`, fixed fractions, width/height fractions, min/max constraints and viewport-height utilities.

Each facet selector is a single class selector (specificity `0-1-0`). For declarations targeting the same property:

1. An `!important` facet utility beats the non-important `--full` declaration, even if the non-important rule is in a later responsive block.
2. When both declarations are `!important` and have equal specificity, later source order wins among the declarations whose media queries match.
3. Media eligibility is still required; a tablet/desktop/screen-prefixed class has no effect below its min-width threshold.

Practical consequence: putting `aq-t-facet--full` on an element does not guarantee 100% width and height if an applicable base or responsive important sizing utility is also present. The important declaration wins for the property it sets.

## Same-property and cross-property combinations

The order inside each family is consistent: the basic `full` / viewport helpers and named shortcuts appear first, followed by auto-width/height helpers, then width fractions and constraints, height fractions and constraints, and finally viewport-height fractions and constraints.

Derived outcomes when classes are combined on one element:

| Combination | Cascade result |
|---|---|
| `--full` + an applicable important `--w-6` | `width:49.99999%` wins; `--full` still supplies `height:100%` unless another height rule overrides it |
| `--full-screen` + same-family `--w-6` | `--w-6` wins width by later source order; full-screen still supplies `height:100vh` |
| `--wide-screen` + `--w-6` in the same family | `--w-6` wins width by later source order |
| `--tall-screen` + same-family `--h-6` | `--h-6` wins height by later source order |
| `--h-6` + same-family `--vh-8` | `--vh-8` wins height by later source order; both declarations are important |
| `--w-6` + `--w-min-8` | Both remain active: width is set while min-width constrains it; these are different properties |
| `--h-6` + `--h-max-8` | Both remain active: height is set while max-height constrains it |
| `--vh-8` + `--vh-max-6` | Both remain active: viewport-relative height is set while max-height caps it |
| Base `--w-6` + `aq-d-facet--w-8` at 993px+ | Desktop important width wins by later source order |
| `aq-t-facet--w-6` + `aq-s-facet--w-8` at 1440px+ | Screen important width wins by later source order |

The same family ordering applies to the corresponding responsive copies. Width, min-width and max-width are separate constraints; likewise height, min-height and max-height. Do not describe them as competing declarations in a single-property cascade.

## Source consistency and anomalies

After normalizing the responsive prefixes, the 134 facet rule declarations in each context have the same structure and values, apart from inconsequential whitespace differences. The `--third` width defect is repeated consistently in all four contexts rather than being a one-breakpoint anomaly.

Two pairs of names set the same property/value in each family:
- `--wide-auto` and `--w-auto` both set `width:auto!important`.
- `--tall-auto` and `--h-auto` both set `height:auto!important`.

These are duplicate spellings in the stylesheet, not separate sizing behaviors. Preserve both exact spellings when documenting or searching the selector inventory.

## Source anchors

- [Base facet sizing, lines 575–708](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L575-L708)
- [Tablet facet sizing, lines 915–1048](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L915-L1048)
- [Desktop facet sizing, lines 1239–1372](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1239-L1372)
- [Screen facet sizing, lines 1563–1696](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1563-L1696)
- [Responsive media-query map](media-query-and-selector-map.md)
- [General cascade model](cascade-and-specificity.md)
- [Layout utility overview](layout-utilities.md)

## Validation status and remaining work

- The selector counts, declarations, source locations, `!important` distribution and repeated `--third` value are source-confirmed against the pinned stylesheet.
- The combination outcomes are derived from selector specificity, importance, source order and standard CSS sizing constraints. They have not yet been added as dedicated computed-style assertions in the Labs browser suite.
- No runtime claim is made here about every class combination or viewport. Targeted computed-style tests should cover the `--third` defect, `--full` versus important sizing, same-property responsive overrides, and simultaneous width/height constraints before treating this map as runtime-verified.
- This document maps facet sizing only. The broader Gate A criterion remains open: flex, positioning, typography, visibility, theme/global rules, selector overlaps and pseudo-class interactions still require declaration-level treatment.

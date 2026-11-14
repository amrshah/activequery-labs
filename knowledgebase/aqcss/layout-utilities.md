# AQCSS Layout, Spacing, Sizing and Flex Utilities

Source: `ActiveQuery.css` SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Evidence: declarations are source-confirmed; facet sizing, row-gap, flex base/modifiers, spacing aliases and alignment behavior have targeted Chromium/Firefox tests; broader layout composition remains pending.

## Spacing scale

The baseline margin and padding families use these values:

| Token | Value |
|---|---:|
| small | 0.5rem |
| default | 1rem |
| large | 2rem |
| xlarge | 3rem |
| xxlarge | 5rem |

The baseline family uses `aq--margin-*` and `aq--padding-*` selectors, often paired with `aq-m--*` companions. The responsive families use `aq-t--*`, `aq-d--*` and `aq-s--*` inside their respective media queries.

Spacing names include all, top/bottom, left/right and individual side variants. Exact aliases matter: in the 1rem rules for all four prefixes (`aq-m`, `aq-t`, `aq-d`, `aq-s`), the left-side declarations mistakenly reuse the matching `*-right` selector. Each right-side class therefore applies both left and right spacing, while the matching left-side class has no default 1rem rule. Small, large and xlarge variants use distinct selectors and must not be inferred from this defect.

## Facet sizing

The `aq-facet` family controls width, height, min/max width, min/max height and viewport-height sizing.

Examples:
- `.aq-facet--full`: width and height 100%.
- `.aq-facet--full-screen`: 100vw by 100vh.
- `.aq-facet--wide-screen`: 100vw.
- `.aq-facet--tall-screen`: 100vh.
- `.aq-facet--w-1` through `.aq-facet--w-12`: 12-column width fractions.
- `.aq-facet--h-1` through `.aq-facet--h-12`: 12-part height fractions.
- `.aq-facet--vh-1` through `.aq-facet--vh-12`: viewport-height fractions.
- `--w-min-*`, `--w-max-*`, `--h-min-*`, `--h-max-*`, `--vh-min-*` and `--vh-max-*`: min/max constraints.

The quarter/third/half/two-third/three-quarter shortcuts exist for width and height. The width shortcut defect is source-confirmed: `.aq-facet--third` and its base/responsive copies are declared as 3.33333% width, while the related height and viewport-height third shortcuts use 33.33333. Do not assume the width shortcut means 33.33333%. See [the facet sizing cascade map](sizing-cascade-map.md) for the complete source trace, `!important` behavior and responsive combinations.

## Positioning / affix

The `aq-affix` family uses absolute, relative, fixed and sticky positioning, with top/bottom/left/right edge variants and corner/center placement helpers. Center helpers use 50% positioning with translate transforms.

The responsive copies are `aq-t-affix`, `aq-d-affix` and `aq-s-affix`.

## Flexon

The `aq-flexon` family covers display, flow/wrapping, alignment, stretch/shrink, distribution and row/column gaps. Its actual selector behavior is uneven: the base display list and several base aliases are malformed, and responsive display lists contain spelling mismatches.

Important operational facts:
- Base `.aq-flexon` / `.aq-m-flexon` reliably establish flex display. Most base modifier-only classes do not, because the display selector list has missing commas. Add the base container class when using base flow modifiers.
- Responsive display lists are comma-separated, but include `--nowrap`, `--column-warp-reverse` and `--row-warp-reverse`; the corresponding flow declarations use `--no-wrap`, `--column-wrap-reverse` and `--row-wrap-reverse`.
- Base `aq-m-` alignment aliases and the `shrink-no` alias have compound-selector defects; responsive aliases are comma-separated.
- The `--stretch`, `--stretch-no` and `--no-stretch` selectors intended to set `flex-grow` use `:not([class*=flexon])`, which cannot match an element carrying the flexon utility class itself. Their companion rules set `align-items`, not flex-grow.
- `--gap` sets row-gap only. Use `--row-gap` or `--column-gap` to state the axis explicitly.
- `--row-gap-xlarge` has unitless `2` and is invalid; `--gap-xlarge` and `--column-gap-xlarge` use valid `2rem`.
- The `right-bottom` / `bottom-right` alignment declaration omits `!important`, unlike the other alignment helpers.
- Small gap helpers exist in the base family only; responsive families start at the default 1rem gap.

See [the flex utility cascade map](flex-cascade-map.md) for exact source lines, selector parsing, responsive cascade and all known caveats. See CSS-003, CSS-008, CSS-009 and CSS-027–CSS-031 in `testing/source-findings.md`. Do not assume a flexon token works as a standalone display trigger without checking its exact selector.

## Responsive prefix semantics

| Family | Activation | Notes |
|---|---|---|
| `aq-` / `aq-m-` | Baseline rules | Mobile/base companion |
| `aq-t-` | min-width 600px | Tablet-named |
| `aq-d-` | min-width 993px | Desktop-named |
| `aq-s-` | min-width 1440px | Large-screen |

The min-width blocks are cumulative: at 1440px, the 600px, 993px and 1440px rules all match. A later selector can override an earlier one based on selector specificity and source order.

## Source map

- Baseline spacing: lines 504–579.
- Facet sizing: base lines 575–708; detailed cascade map in `sizing-cascade-map.md`.
- Baseline affix: lines 710–727.
- Baseline flexon: lines 728–812.
- Tablet family: lines 813–1136.
- Desktop family: lines 1137–1460.
- Large-screen family: lines 1461–1784.
- Input modality and viewport helpers: lines 1785–1808.

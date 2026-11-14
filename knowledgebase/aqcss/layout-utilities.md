# AQCSS Layout, Spacing, Sizing and Flex Utilities

Source: `ActiveQuery.css` SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Evidence: declarations are source-confirmed; class behavior and layout composition need runtime verification.

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

Spacing names include all, top/bottom, left/right and individual side variants. Exact aliases matter: source findings identify left-side alias errors where the mobile/right class is used in a left declaration, and duplicated right-side selectors in responsive blocks.

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

The quarter/third/half/two-third/three-quarter shortcuts exist for width and height. The source has a likely width typo: `.aq-facet--third` is declared as 3.33333% width. See CSS-002. Never silently assume it means 33.33333%.

## Positioning / affix

The `aq-affix` family uses absolute, relative, fixed and sticky positioning, with top/bottom/left/right edge variants and corner/center placement helpers. Center helpers use 50% positioning with translate transforms.

The responsive copies are `aq-t-affix`, `aq-d-affix` and `aq-s-affix`.

## Flexon

The `aq-flexon` family provides:
- flex display;
- initial, row, row-reverse, column and column-reverse flow;
- wrap and nowrap behavior;
- row/column combinations with reverse wrapping;
- center/edge alignment and aliases;
- stretch/grow/shrink controls;
- space-around, space-evenly and space-between distribution;
- small/default/large/xlarge row and column gap helpers.

Important distinctions:
- `aq-flexon--gap` sets row-gap, not both row and column gap.
- Use `aq-flexon--row-gap` and `aq-flexon--column-gap` for explicit axes.
- The `row-gap-xlarge` declaration has unitless `2` and is invalid as a CSS length.
- Display selectors in the base family contain missing commas; several intended classes become descendant selector chains.
- `nowrap` vs `no-wrap` and `warp-reverse` vs `wrap-reverse` mismatches occur in display selector lists.

See CSS-003, CSS-008 and CSS-009 in `testing/source-findings.md`. Do not treat the family as a reliable grid/flex abstraction until the individual selectors are browser-tested.

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
- Facet sizing: lines 580–709.
- Baseline affix: lines 710–727.
- Baseline flexon: lines 728–812.
- Tablet family: lines 813–1136.
- Desktop family: lines 1137–1460.
- Large-screen family: lines 1461–1784.
- Input modality and viewport helpers: lines 1785–1808.

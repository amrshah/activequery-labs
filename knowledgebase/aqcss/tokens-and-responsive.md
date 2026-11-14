# AQCSS Tokens, Typography and Responsive Semantics

Source: `ActiveQuery.css`, pinned SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Status: source-confirmed declarations; selected computed-style behavior is runtime-verified in Chromium and Firefox; broad rendering and compatibility coverage remains incomplete.

## Root setup

At lines 37–80, `:root` sets a fluid root font size:

```css
font-size: clamp(16px, calc(12px + (0.006 * 100vmax)), 50px);
```

It also declares body dimensions, viewport dimensions, font settings, line/paragraph sizing, heading increment and swatch/opacity tokens. The document base rule sets box-sizing, margin, padding, width/height, font family, line height, text color and canvas background. It also applies `overflow-x: hidden!important` to `html, body`.

## Theme token behavior

The theme system includes:
- `--aq-swatch-canvas`
- `--aq-swatch-primary`
- `--aq-swatch-secondary`
- `--aq-swatch-accent`
- `--aq-swatch-info`
- `--aq-swatch-success`
- `--aq-swatch-warning`
- `--aq-swatch-alert`
- `--aq-swatch-mute`
- `--aq-swatch-white`
- `--aq-swatch-black`
- text/canvas/border/mark opacity tokens.

The source declares the swatch variables twice in the root block: first as comma-separated RGB channels and then as hex colors. CSS cascade means the later declarations are the effective computed values. Several utility rules use modern relative-color syntax such as `rgb(from var(--aq-swatch-primary) r g b / ...)`; other rules use legacy `rgb(var(--aq-swatch-secondary))`. This mixed consumption pattern is a high-priority computed-style test, not something to assume works consistently.

No `prefers-color-scheme` query was found in the inspected source. Token presence alone is not evidence of a complete built-in light/dark mode. A theme switch can likely be authored by overriding custom properties, but that is a custom integration and must be tested for all dependent selectors.

## Typography

The source styles paragraph text and headings globally and provides AQ utility aliases. Confirmed examples at lines 280–353:
- `.aq-text--serif`
- `.aq-text--san-serif` (exact spelling in source)
- `.aq-text--condensed`
- `.aq-text--spread`
- `.aq-text--case-upper`, `.aq-text--case-lower`, `.aq-text--case-normal`
- `.aq-text--underline`
- `.aq-text--left`, `.aq-text--center`, `.aq-text--full`, `.aq-text--justify`, `.aq-text--right`
- `.aq-text--fw-100` through `.aq-text--fw-900` with alias names
- `.aq-text--fs-1` through `.aq-text--fs-5`.

The exact spelling and selector combinations matter. For example, the `san-serif` token is not the conventional CSS generic-family spelling `sans-serif`. Also inspect the weight-900 selector grouping around line 342: the source has a compound selector for `.aq-text--jumbo-bold.aq-text--xxxbold`, which is not equivalent to two independent aliases.

## Responsive prefix map

The source places responsive families in these media blocks:

| Prefix | Activation in source | Interpretation |
|---|---|---|
| `aq-` | Base rules outside the responsive media blocks | Baseline |
| `aq-m-` | Frequently paired with base `aq-` rules outside the media blocks | Baseline/mobile companion, not the medium breakpoint |
| `aq-t-` | `@media (min-width:600px)` | Tablet-named family |
| `aq-d-` | `@media (min-width:993px)` | Desktop-named family |
| `aq-s-` | `@media (min-width:1440px)` | Large-screen family |

This mapping is source placement, not a claim about physical device categories. A 600px or 993px threshold is a viewport-width condition. The prefixes can overlap because the media blocks are min-width based; later blocks may apply on wider screens too.

## Facet sizing

The `aq-facet` family provides full-size, viewport-size, auto, fraction and 12-column sizing rules. For example, `aq-facet--w-1` through `aq-facet--w-12` correspond to approximately 1/12 through 12/12 width. Similar families exist for min/max width and height.

Source inspection found that the class `.aq-facet--third` declares `width: 3.33333%` rather than the expected one-third value. Do not use it as a one-third width primitive until browser behavior and intended semantics are confirmed.

## Flex utilities

The `aq-flexon` family sets flex display and provides flow direction, wrapping, alignment, stretch/shrink, distribution and gap utilities. Responsive copies exist under `aq-t-flexon`, `aq-d-flexon` and `aq-s-flexon`.

The `*-flexon--row-gap-xlarge` rules use `row-gap: 2!important` without a unit. This is invalid as a CSS length and should be treated as a source anomaly until tested. The `*-flexon--gap-xlarge` and column-gap variants have separate declarations; do not assume the three utilities are aliases.

## Input modality and viewport behavior

At the end of the stylesheet:
- `(pointer: coarse) and (hover: none)` hides touch-specific content;
- a malformed width 1–600px media prelude attempts to hide mobile-specific content but is ignored by Chromium/Firefox;
- width 601–992px hides tablet-specific content;
- fine pointer plus hover hides no-touch-specific content;
- width 993–1439px hides desktop-specific content;
- width 1440px and above hides screen-specific content;
- max-height 550px in landscape applies a full-screen orientation overlay and hides body overflow.

These are independent CSS conditions. Hybrid devices and desktop windows with low height need explicit testing.

## Browser compatibility questions

The stylesheet uses modern CSS features including `:is()`, `:not()`, `:where()`/selector functions where present, `clamp()`, `max()`, custom properties, and relative color syntax `rgb(from ...)`. The exact feature set and fallbacks must be assessed in supported browser engines. Do not claim universal cross-browser compatibility from the README alone.

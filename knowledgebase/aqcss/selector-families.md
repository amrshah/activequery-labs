# AQCSS Selector Families — Initial Source Map

Source: [ActiveQuery.css](https://github.com/ActiveQuery/CSS/blob/main/ActiveQuery.css), pinned SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
The source is 1,808 lines. This page is an initial taxonomy, not a final semantic catalogue.

## How to read the naming system

AQCSS contains legacy/base selectors, AQ-prefixed utility families, and responsive variants. A class name's prefix is a clue, not proof of behavior. Always consult its complete rule and all later overrides.

### Observed families

| Family | Representative source selectors | Initial interpretation to validate |
|---|---|---|
| Base/layout | `.container`, `.panel`, `.row`, `.row-padding`, `.cell-row`, `.bar`, `.bar-item` | Layout and navigation primitives; some are W3CSS-derived |
| Visibility/display | `.hide`, `.show`, `.show-block`, `.show-inline`, `.show-inline-block`, `.show-table`, `.as-block`, `.as-inline` | Visibility and display helpers |
| Typography | `.aq-text--*`, `.aq-m-text--*`, `.aq-t-text--*`, `.aq-s-text--*`, `.aq-d-text--*` | Text alignment, size, weight, case, decoration and responsive text variants |
| Spacing | `.aq--margin-*`, `.aq-m--margin-*`, `.aq-t--margin-*`, `.aq-s--margin-*`, `.aq-d--margin-*` | Margin utilities with responsive naming variants |
| Padding | `.aq-padding--*`, `.aq-m-padding--*`, `.aq-t--padding-*`, etc. | Padding utilities; inspect exact naming and breakpoint mapping |
| Facets/sizing | `.aq-facet--*`, `.aq-m-facet--*`, `.aq-t-facet--*`, `.aq-s-facet--*`, `.aq-d-facet--*` | Width/height/fraction/screen sizing families |
| Flex layout | `.aq-flexon--*`, `.aq-m-flexon--*`, `.aq-t-flexon--*`, `.aq-s-flexon--*`, `.aq-d-flexon--*` | Flex container direction, alignment, wrapping and gaps |
| Positioning | `.aq-affix--*`, `.aq-m-affix--*`, `.aq-t-affix--*`, `.aq-s-affix--*`, `.aq-d-affix--*` | Position and placement utilities |
| Theme swatches | `.aq-swatch--*`, `.aq-swatch-text--*`, `.aq-swatch-border--*` | Background, text and border color families |
| Borders | `.aq-border`, `.aq-border--*`, `.aq-no-border` | Border edges, radius and variants |
| Visual effects | `.aq-fleek--*` | Filter, opacity, overlay, dropdown and quote effects |
| Background images | `.aq-swatch-bg-img--*` | Background image sizing, positioning and repeat helpers |
| Touch/device visibility | `.aq-facet-hide-on-touch`, `.aq-facet-hide-on-mobile`, `.aq-facet-hide-on-tablet`, `.aq-facet-hide-on-desktop`, `.aq-facet-hide-on-screen` | Device/input-context visibility; note the mobile helper's malformed media query is ignored by Chromium/Firefox, so do not rely on it |

## Responsive prefix interpretation

The source places `aq-t-` rules inside the min-width 600px media block, `aq-d-` inside min-width 993px, and `aq-s-` inside min-width 1440px. `aq-m-` rules are commonly paired with base `aq-` selectors outside these media blocks; it is therefore the baseline/mobile companion family, not a medium breakpoint. These are viewport rules, not device detection.

## Responsive media rules observed

The stylesheet contains these media query expressions:

- `(min-width:600px)`
- `(min-width:993px)`
- `(min-width:1440px)`
- `(min-width:1px)and(max-width:600px)`
- `(min-width:601px)and(max-width:992px)`
- `(min-width:993px)and(max-width:1439px)`
- `(max-height:550px) and (orientation: landscape)`
- `(pointer: coarse) and (hover: none)`
- `(pointer: fine) and (hover: hover)`

Do not simplify these to a generic mobile/tablet/desktop model without inspecting the actual selectors inside each query. In particular, pointer/hover queries describe input capabilities, not device brand or viewport size.

## Theme custom properties observed

The stylesheet declares custom properties including:
- typography/body: `--aq-font-color`, `--aq-font-family`, `--aq-font-size`, `--aq-font-size-increment`, `--aq-h-size-increment`, `--aq-line-height`, `--aq-paragraph-size`;
- dimensions: `--aq-body-height`, `--aq-body-width`, `--aq-vh`, `--aq-vw`;
- swatch values: `--aq-swatch-primary`, `--aq-swatch-secondary`, `--aq-swatch-accent`, `--aq-swatch-info`, `--aq-swatch-success`, `--aq-swatch-warning`, `--aq-swatch-alert`, `--aq-swatch-mute`, `--aq-swatch-canvas`, `--aq-swatch-black`, `--aq-swatch-white`;
- opacity values and hover variants.

This confirms a token layer exists; it does **not** prove a built-in dark-mode implementation. Dark-mode support must be specifically investigated and runtime-tested later.

## Machine-readable navigation indexes

The knowledgebase now includes a brace-aware lexical scan of 1,417 rule selector blocks and 1,813 unique class tokens. Use `class-token-index.json` to locate a class and `rule-selector-index.json` to inspect selector groups/line references. The PostCSS-validated custom property index records 26 declared names, 71 names across declarations/references (45 reference-only), 37 true declaration occurrences and 239 var() references. The earlier lexical pass incorrectly treated 20 BEM `--modifier` selector suffixes as custom-property declarations; those false positives have been removed. These are navigation aids, not a substitute for cascade analysis, complete declarations or browser verification.

## Catalogue completion requirements

For each selector, the final reference must record:
- exact selector spelling and selector group;
- source line(s) and full declaration block;
- declarations and values;
- specificity and interactions with other selectors;
- media query and responsive overrides;
- pseudo-class/pseudo-element and attribute conditions;
- required HTML structure, if any;
- runtime example with viewport and browser;
- whether the selector is AQ-authored, W3CSS-derived, Normalize-derived or unclear.

A raw scan of `.` tokens is not a reliable count of CSS class selectors. The current navigation indexes use brace-aware rule-prelude extraction and separate selector occurrences from unique class tokens. A PostCSS AST generator is also committed for CI; its output is not yet available because no workflow run result has been retrieved. These inventories still do not resolve cascade, browser-computed styles or third-party provenance.

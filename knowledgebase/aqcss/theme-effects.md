# AQCSS Borders, Swatches, Background Images and Fleek Effects — Cascade Map

Source: `ActiveQuery.css` v25.6.0, pinned Git blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-15.

Status: selector and declaration behavior below is source-confirmed. Existing Chromium/Firefox observations are explicitly identified. Theme combinations, contrast and full browser support are not exhaustively validated.

## 1. Border utilities

Source: lines 338–352.

### Border edges and bars

| Selector | Declaration | Result |
|---|---|---|
| `.aq-border` | `border:0.0625rem solid rgb(var(--aq-swatch-secondary))` | All four borders |
| `.aq-border--top`, `--bottom`, `--left`, `--right` | Corresponding side border, same width/style/color | One edge |
| `.aq-border--top-bar`, `--bottom-bar`, `--left-bar`, `--right-bar` | Corresponding side, `6px solid` | Thick edge/bar |

These rules do not use `!important`. The shorthand `.aq-border` can set all four edges, while a side-specific utility can subsequently override one edge when specificity and source order permit. Do not assume a border utility wins against a component's important border declaration.

**Important token incompatibility (CSS-001):** the root defines swatch variables first as comma-separated RGB channel values and later redefines them as hex colors (lines 64–85). The later hex values win. The border utilities still use legacy `rgb(var(--aq-swatch-secondary))` syntax, which expects channel values rather than a hex color. Existing Chromium/Firefox tests have covered the base border-token case; do not assume the default border color expression is valid merely because the custom property exists. A theme override using RGB channels may behave differently from a hex override.

### Radius utilities

| Selector | Radius |
|---|---:|
| `.aq-border--circle` | 50% |
| `.aq-border--round-small` | 2px |
| `.aq-border--round`, `--round-medium` | 4px |
| `.aq-border--round-large` | 8px |
| `.aq-border--round-extra-large`, `--round-xlarge` | 16px |
| `.aq-border--round-jumbo`, `--round-xxlarge` | 32px |

Radius utilities set only `border-radius`; they do not create a border. The circle helper does not guarantee a circle unless the element's dimensions and clipping/content make that result appropriate. None of these declarations is important.

## 2. Swatch model and token resolution

Source: root lines 58–85; swatch rules lines 354–388.

The source separates:
- background plus foreground: `.aq-swatch--*`;
- text only: `.aq-swatch-text--*`;
- border color only: `.aq-swatch-border--*`.

The named palette is canvas, primary, secondary, accent, info, success, warning, alert, mute, white and black.

### Root token defaults

Opacity defaults are:
- `--aq-swatch-text-opacity:100%`
- `--aq-swatch-canvas-opacity:100%`
- `--aq-swatch-border-opacity:100%`
- `--aq-swatch-mark-opacity:100%`

Swatch values are initially declared as RGB triplets and then re-declared as hex in the same `:root` block. Because both declarations have the same origin, importance, selector and declaration context, the later hex values win. The effective root values are therefore the later hex values, not the earlier comma-separated channels.

### Background/foreground swatches

Each `.aq-swatch--{name}` selector is paired with `.aq-swatch--{name}-hover:hover` in the same rule. The background uses `--aq-swatch-canvas-opacity`; text foreground uses `--aq-swatch-text-opacity`.

- Canvas: canvas background with black text.
- Primary, accent, info, success, warning, alert and mute: named background with white text.
- White: white background with black text.
- Black: black background with white text.
- Secondary: sets the secondary background but does **not** set a foreground color in this rule.

That last distinction is source behavior, not a claim that the selected foreground is necessarily inaccessible. Secondary inherits/retains the element's existing color unless another rule changes it. Check contrast for actual token values and surrounding styles.

### Text and border swatches

Text swatches set only `color` and use `--aq-swatch-text-opacity`. Border swatches set only `border-color` and use `--aq-swatch-border-opacity`.

A border-color swatch does not create a border: the element still needs a non-none border style/width from a base rule or another utility. The swatch families have hover variants for each of the 11 palette names. Hover variants are selector pairs in the same rule, not JavaScript state.

### Cascade combinations

- Different background swatch classes set the same `background` and `color` properties. When multiple class selectors match with equal specificity, later source order determines the winner for each overlapping property.
- A matching `*-hover:hover` selector includes a pseudo-class and has greater specificity than a single class selector. It can override the base swatch's corresponding property while hovered.
- Background, text and border swatch families target different properties and can be combined, but other component/global rules may also participate.
- None of these swatch declarations uses `!important`; important declarations elsewhere can defeat them.
- The opacity tokens are separate by role. Changing canvas opacity does not change text or border opacity.

Do not treat the default palette as a complete theme system. The stylesheet has no built-in light/dark mode switch or automatic system color-scheme selection.

## 3. Background-image positioning and repeat helpers

Source: lines 391–411.

The `.aq-swatch-bg-img--*` family modifies background presentation only. It does not set `background-image`, fetch an asset, or choose a URL.

| Concern | Tokens | CSS behavior |
|---|---|---|
| Attachment | `--fixed`, `--scroll`, `--local` | `background-attachment` |
| Sizing | `--full`, `--cover`, `--contain` | `background-repeat:no-repeat` plus `background-size` |
| Center | `--center`, `--middle` | centered |
| Center/top/bottom | `--center-top`, `--top-center`, `--center-bottom`, `--bottom-center` | corresponding two-axis position |
| Left/right and corners | `--left`, `--right`, `--left-top`, `--top-left`, `--left-bottom`, `--bottom-left`, `--left-center`, `--center-left`, and right-side counterparts | corresponding position |
| Repeat | `--repeat-no`, `--no-repeat`, `--repeat`, `--repeat-horizontal`, `--repeat-vertical` | no-repeat, repeat, repeat-x, repeat-y |

The `--full`, `--cover` and `--contain` helpers each set `background-repeat:no-repeat`, so they can override a separate repeat helper depending on specificity and source order. The position aliases are grouped as alternatives in their selectors.

These helpers are not important. If multiple sizing, attachment, position or repeat classes are applied, they compete only on the properties they share; for the same property and equal specificity, later source order wins.

## 4. Fleek filters and opacity

Source: lines 414–425.

| Effect | Selector(s) | Declaration |
|---|---|---|
| Grayscale max | `--grayscale-max`, `--grayscale-hover:hover` | `filter:grayscale(100%)` |
| Grayscale | `--grayscale` | `filter:grayscale(75%)` |
| Grayscale min | `--grayscale-min` | `filter:grayscale(50%)` |
| Invert | `--invert`, `--invert-hover:hover` | `filter:invert(75%)` |
| Invert max | `--invert-max`, `--invert-max-hover:hover` | `filter:invert(100%)` |
| Sepia | `--sepia` | `filter:sepia(75%)` |
| Sepia max | `--sepia-max`, `--sepia-hover:hover` | `filter:sepia(100%)` |
| Sepia min | `--sepia-min` | `filter:sepia(50%)` |
| Opacity | `--opacity`, `--opacity-hover:hover` | `opacity:0.50` |
| Opacity off | `--opacity-off`, `--opacity-off-hover:hover` | `opacity:1` |
| Opacity max | `--opacity-max` | `opacity:0` |
| Opacity min | `--opacity-min` | `opacity:0.75` |

### Filter declarations do not compose across classes

Each filter helper writes the complete `filter` property. Applying grayscale and invert classes to the same element does not automatically combine both functions; the matching declaration that wins the cascade supplies the whole filter value. Compose filter functions explicitly in a custom rule if a combined effect is required.

The same applies to opacity helpers: each writes the complete `opacity` property. The `--opacity-max` token means fully transparent (`opacity:0`), not maximum visibility. Opacity does not remove layout space and does not by itself disable pointer interaction or keyboard focus.

The hover variants are CSS pseudo-class rules. They do not provide keyboard/touch activation alternatives and do not change the DOM state.

## 5. Screen overlay

Source: lines 426–438.

`.aq-fleek--screen-overlay` sets:
- `position:fixed`;
- `display:none`;
- width/height 100%;
- all four offsets to zero;
- configurable background and text colors;
- `z-index:+5000`.

It is a hidden overlay style, not a complete modal/dialog implementation. The CSS does not provide an activation mechanism, focus trap, focus restoration, Escape handling, accessible dialog semantics, or scroll-lock policy. The ordinary `display:none` declaration can be overridden by a matching important display utility such as `.show`, subject to the cascade. The overlay's z-index is high but cannot be assumed to outrank every application stacking context; stacking contexts and top-layer elements still matter.

## 6. Dropdown styles

Source: lines 439–453.

- `.aq-fleek--dropdown-click` and `.aq-fleek--dropdown-hover` set a relative, inline-block wrapper and pointer cursor.
- The content rule defaults to `display:none`, absolute positioning, `min-width:160px`, zero margin/padding, dropdown text/background tokens and `z-index:1`.
- Only `.aq-fleek--dropdown-hover:hover .aq-fleek--dropdown-content` changes content to `display:block`.
- The selector named `.aq-fleek--dropdown-click` has hover decoration rules but no click-to-open state logic in CSS.

Existing Chromium/Firefox tests report that hover opens the hover variant, keyboard focus alone does not, and the click-named variant does not open on click. A real interactive dropdown requires application behavior and keyboard/accessibility treatment.

## 7. Blockquote markers

Source: lines 454–470.

The blockquote styling requires a `blockquote` element matching `:is(.aq-fleek--blockquote,[aq-fleek],[AQ-FLEEK])`. It sets paragraph-size and line-height tokens, relative positioning, margins and left padding. A separate rule sets `display:inline`.

Pseudo-elements render `open-quote` and `close-quote` attribute values when the corresponding attributes are non-empty. Marker styling uses configurable size, color and font tokens. The CSS does not synthesize actual quotation text when those attributes are absent. The source uses `--aq-paragraph-size`, whose root default is unitless `1.2`; see CSS-032 and the [typography cascade map](typography-cascade-map.md).

## 8. Practical implementation rules

1. Do not assume the default `.aq-border` color works with the effective hex swatch token; CSS-001 remains a compatibility hazard.
2. A border-color swatch requires an actual border style and width.
3. Check the secondary swatch foreground explicitly; its background rule does not set text color.
4. Do not infer accessible contrast from palette names such as success, warning or alert. Test the resolved colors and opacity combinations.
5. Do not apply multiple filter utilities expecting them to compose; they replace the `filter` property.
6. Treat opacity zero as transparent, not hidden or disabled.
7. Background-image helpers only configure an image already supplied by the application.
8. The overlay and dropdown styles are visual primitives, not accessible interaction components.
9. Provide keyboard/focus and touch alternatives for hover effects.
10. Add application-owned theme switching and reduced-motion behavior where required; the pinned stylesheet does not supply a complete theme/accessibility policy.

## 9. Runtime evidence and remaining gaps

Existing Chromium/Firefox coverage includes base border-token behavior, relative-color alpha behavior, dropdown hover/focus behavior and the existing hover/focus tests. The source/minified parity suite checks structural declarations, not visual equivalence across every swatch combination.

Remaining validation:
- all 11 swatch families with root defaults and application overrides;
- hex versus RGB-channel custom-property overrides for legacy border declarations;
- foreground/background contrast, including opacity and hover combinations;
- multiple simultaneous swatch classes and responsive/global cascade interactions;
- filter class combinations and hover state;
- stacking behavior of the overlay within nested stacking contexts and against top-layer UI;
- background image rendering with real assets, scroll containers and mobile browsers;
- forced-colors/high-contrast and reduced-motion behavior.

No new browser run is claimed by this documentation update.

## Source anchors

- Root palette and opacity tokens: `ActiveQuery.css:58–85`.
- Border and radius utilities: `ActiveQuery.css:338–352`.
- Background/text/border swatches: `ActiveQuery.css:354–388`.
- Background-image helpers: `ActiveQuery.css:391–411`.
- Fleek filters and opacity: `ActiveQuery.css:414–425`.
- Screen overlay: `ActiveQuery.css:426–438`.
- Dropdown: `ActiveQuery.css:439–453`.
- Blockquote: `ActiveQuery.css:454–470`.
- [Pinned upstream stylesheet](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L338-L470)
- [Source findings](../testing/source-findings.md)
- [Typography cascade map](typography-cascade-map.md)
- [Visibility and interaction-state cascade map](visibility-interaction-cascade-map.md)

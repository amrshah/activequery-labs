# AQCSS Theme Swatches, Backgrounds and Effects

Source: `ActiveQuery.css` SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Evidence: selector declarations are source-confirmed; computed colors and cross-browser rendering remain pending.

## Swatch families

The source has three related swatch families:
- `aq-swatch--*`: background color plus selected foreground color;
- `aq-swatch-text--*`: text color;
- `aq-swatch-border--*`: border color.

The token set includes canvas, primary, secondary, accent, info, success, warning, alert, mute, white and black. Many variants also have `-hover` selectors.

Opacity tokens are separate for canvas/background, text, borders and marks. The source uses CSS relative-color syntax `rgb(from var(...) r g b / ...)` for many swatch declarations.

**High-priority issue:** root swatch variables are declared first as RGB channels and later as hex colors, so later values win. Some border rules still use legacy `rgb(var(--aq-swatch-secondary))`, which may be invalid with the effective hex value. See CSS-001.

## Background-image helpers

`aq-swatch-bg-img` includes:
- fixed, scroll and local background attachment;
- full, cover and contain sizing;
- center, top, bottom, left, right and corner positioning;
- no-repeat, repeat, repeat-x and repeat-y behavior.

These are CSS utilities only. They do not load images or define image URLs.

## Fleek effects

The `aq-fleek` family includes:
- grayscale levels and hover variants;
- invert levels and hover variants;
- sepia levels and hover variants;
- opacity levels and hover variants;
- a fixed screen overlay;
- dropdown wrapper/content styling;
- blockquote marker styling.

The overlay is fixed to the viewport and uses a high z-index. Its visibility is initially hidden through display:none; another mechanism must make it visible.

### Dropdown behavior

The hover dropdown content is displayed by `.aq-fleek--dropdown-hover:hover .aq-fleek--dropdown-content`. The class named `.aq-fleek--dropdown-click` has positioning and hover-state styling but no click event logic in AQCSS. A real click dropdown requires additional JavaScript and accessible keyboard behavior.

### Blockquote behavior

The blockquote effect targets a `blockquote` element combined with `.aq-fleek--blockquote` or AQ attribute selectors. It reads opening/closing quote glyphs from attributes and renders pseudo-elements.

## Compatibility and accessibility

- Relative-color syntax support must be tested in target browsers; no `@supports` fallback was found.
- No `prefers-color-scheme`/`data-theme` dark-mode handling or `prefers-reduced-motion` override was found in the pinned stylesheet.
- Hover-only effects need focus-visible and touch alternatives.
- Overlay behavior needs focus management, escape handling and scroll-lock policy in the application layer.
- Swatch combinations need contrast testing in every theme.

## Source map

- Root theme variables: lines 40–80.
- Typography utilities: lines 280–337 and 471–503.
- Border utilities: lines 338–352.
- Swatch background/text/border rules: lines 354–388.
- Background image helpers: lines 391–411.
- Fleek filters, overlay, dropdown and blockquote: lines 414–470.

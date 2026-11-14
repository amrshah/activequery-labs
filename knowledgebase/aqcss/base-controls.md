# AQCSS Base Styles, Form Controls and Element Utilities — Behavior Map

Source: `ActiveQuery.css` v25.6.0, pinned Git blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-15.

Status: declarations and selector structure are source-confirmed. Existing Chromium/Firefox tests cover focus-outline removal, disabled descendants, tooltip, reduced motion, dropdown and selected theme behavior. This is not a full accessibility audit or a full native-control compatibility matrix.

## 1. Document and element baseline

The stylesheet begins with root font-size and custom properties, then applies a global box-sizing/reset and document defaults. The `html, body` rule sets width/height from AQ variables, font family, line-height, text color, canvas background and `overflow-x:hidden!important`.

The stylesheet also applies normalization rules to common HTML elements and includes selectors for element names such as `splash`, `alert`, `dialogue`, `model` and `preloader`. These are CSS element selectors; this stylesheet does not register custom elements.

Anchor baseline at lines 135–139:
- `a` has transparent background, inherited color and no text decoration.
- `:link`, `:active`, `:hover` and `:visited` share `outline-width:0` and `outline:none`.
- The later broad control/font reset at lines 149–156 also includes `a`.

These global selectors affect application markup beyond AQ-prefixed components. Scope app overrides carefully.

## 2. Inputs and selects

### Inputs

At lines 161–174, `input` and `.input` receive:
- padding `0.5rem`;
- `display:block`;
- configurable overall border;
- independently configurable top/bottom/left/right borders;
- width 100%;
- configurable text and background colors;
- `overflow:visible`.

The invalid-state selector is `:is(.input,input):invalid`. It removes box shadow and applies `--aq-input-invalid-border` (defaulting to a red 0.063rem border). This selector targets native invalidity semantics; the CSS does not define validation logic or messages.

**Token typo (CSS-013):** the bottom border reads `--aq--input-border-bottom` (double hyphen after `aq`) rather than the apparent `--aq-input-border-bottom` family. Overrides must use the exact consumed spelling unless the upstream source changes.

### Selects

At lines 175–183, `select` and `.select` receive vertical padding, width 100%, and the same overall/per-edge border family. The same bottom-border token typo appears here. No matching `:invalid` selector for selects is defined in this block.

### Fieldsets and legends

- `fieldset`: configurable overall and per-edge border tokens, width 100%, margin `0 2px`, and padding `.35rem .625rem .75rem`.
- `legend`: configurable text color, `display:table`, max-width 100%, zero padding and normal wrapping.

The fieldset bottom border fallback references `--aq-fieldset-border`; the top/left/right fallbacks use the general input border token family. Preserve the exact per-edge token names when overriding.

### Checkboxes and radios

At lines 196–198, `.check`, `.radio`, `[type=checkbox]` and `[type=radio]` receive 1.2rem width/height, relative positioning, top offset 0.5rem and zero padding. These declarations affect native controls and custom class hooks alike; test native rendering across target browsers before relying on identical appearance.

### Textareas

`textarea` gets `overflow:auto` and `outline-width:0`. The broad reset also removes outline. The stylesheet does not provide a comprehensive replacement focus-visible ring.

## 3. Buttons and action controls

At lines 202–230, `button`, `[type=button]`, `[type=reset]` and `[type=submit]` receive the WebKit button appearance reset. A shared `:is(...)` selector also styles `.btn` and `.button`.

The shared visual rule:
- removes border;
- sets inline-block display;
- adds 10px left/right padding;
- vertically aligns middle;
- hides overflow;
- removes text decoration;
- starts with inherited color/background, then applies button swatch tokens;
- centers text and uses pointer cursor;
- prevents selection using prefixed and standard user-select declarations;
- forces `width:auto!important`.

Reset/cancel selectors use cancel swatch tokens. Alert selectors use alert text/background tokens. Hover and focus share a rule at lines 237–240.

**CSS-011:** the hover/focus relative-color alpha fallbacks default to `inherit`, which is not a valid numeric/percentage alpha component. Existing browser tests cover the default and explicit opacity-token paths; do not assume every fallback renders as intended.

The shared rule includes `:focus` and `:hover`, not a dedicated `:focus-visible` or `:active` treatment. Focus styling is therefore not a complete keyboard interaction design.

## 4. Focus and disabled-state limitations

The source removes outlines from anchors and form controls through broad selectors (lines 135–156, 195, 200 and 206–207). Existing browser tests confirm focused anchors and buttons have no visible outline in the pinned build. The Mozilla focus-ring pseudo-element rule is not a cross-browser replacement for a complete focus-visible system.

At lines 245–246:
```css
.disabled *,
:disabled * {
  cursor: not-allowed;
  opacity: 0.3;
  pointer-events: none;
  box-shadow: none;
}
```

The descendant combinator is critical: these selectors style children of an element matching `.disabled` or `:disabled`, not the matched element itself. Existing browser tests confirm this behavior (CSS-017).

Further, `.disabled` is only a class hook. It does not set the native `disabled` property, remove an element from keyboard navigation, or prevent application event handlers. Use native disabled semantics where supported and style the actual control explicitly.

Production components must supply visible focus, semantic disabled behavior, keyboard operation, touch target sizing and sufficient contrast.

## 5. Tooltip and other small utilities

| Selector | Source behavior |
|---|---|
| `.input-animate` | Width transition of 0.4s ease-in-out |
| `.input-animate:focus` | Width becomes 100% with `!important` |
| `.tooltip .text` | `display:none` |
| `.tooltip:hover .text` | `display:inline-block`; no focus reveal rule |
| `.code` | Top/bottom margin 1rem with `!important` |
| `.tag` | Inline-block label with background/text tokens, horizontal padding and centered text |
| `.bar-item` | Float-left item with padding, auto width, no border, block display and no outline |

Existing Chromium/Firefox tests confirm hover reveals tooltip text and keyboard focus alone does not. `.input-animate` retains its transition under `prefers-reduced-motion:reduce`; no source override was found. Provide application-level focus and reduced-motion alternatives.

## 6. Display, pointer and image/list helpers

The display helpers are detailed in the [visibility and interaction-state cascade map](visibility-interaction-cascade-map.md). Their key property is that show/hide declarations use `!important`; avoid contradictory display tokens.

Other helpers at lines 280–285:

| Selector | Source behavior |
|---|---|
| `.pointer`, `[pointer]` | `cursor:pointer` only; does not add interaction or keyboard semantics |
| `img`, `.img`, `.image` | No border style, middle vertical alignment, max-width 100%, height auto |
| `:is(svg,.svg):not(:root)` | Overflow hidden, zero margin and padding for non-root SVG |
| `.ul` | Removes list markers, padding and margin |
| `.ul li` | 0.5rem 1rem padding and bottom separator using mute swatch |
| `.ul li:last-child` | Removes bottom border |

The image helper does not set a source, loading behavior, object-fit, aspect ratio or intrinsic dimensions. The SVG rule intentionally excludes the root SVG element via `:not(:root)`.

## 7. Clearfix selectors are not a grid implementation

At lines 260–273, pseudo-elements are applied to `.container`, `.panel`, `.row`, `.row-padding`, `.cell-row`, `.clear` and `.bar`. The pseudo-elements use empty content, table display and clear both.

This proves a clearfix behavior for these selectors. It does **not** prove that each selector has a full grid/container layout implementation in this stylesheet. Do not infer a grid system from the clearfix selector list alone.

## 8. Source map and related references

- Anchor normalization and global form/font reset: `ActiveQuery.css:135–160`.
- Inputs, selects, fieldsets, legends, checks/radios and textarea: `ActiveQuery.css:161–201`.
- Button appearance, themes and hover/focus: `ActiveQuery.css:202–240`.
- Input animation, tooltip, disabled descendants and HR: `ActiveQuery.css:241–249`.
- Code/tag, clearfix, bar item and display helpers: `ActiveQuery.css:251–280`.
- Image, SVG and list helpers: `ActiveQuery.css:281–285`.
- [Pinned upstream stylesheet](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L135-L285)
- [Visibility, display and interaction-state map](visibility-interaction-cascade-map.md)
- [Borders, swatches and effects map](theme-effects.md)
- [Source findings](../testing/source-findings.md)
- [Browser validation plan](../testing/browser-test-plan.md)

## 9. Runtime validation still needed

Existing suite evidence is targeted and should not be generalized beyond its fixtures. Remaining gaps:
- native input/select/textarea/fieldset rendering across browsers and OS themes;
- invalid-state styling for all supported control types;
- checkbox/radio native appearance, focus and touch behavior;
- complete focus-visible and keyboard interaction audit;
- disabled native control versus disabled wrapper versus custom control matrix;
- forced-colors/high-contrast, zoom and responsive reflow;
- image/SVG behavior with varied intrinsic dimensions and embedded content;
- assistive technology semantics for tooltip and dropdown patterns.

No new browser run is claimed by this documentation update.

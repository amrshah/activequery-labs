# AQCSS Base Styles, Controls and Utility Elements

Source: `ActiveQuery.css` SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Evidence: source-confirmed declarations; focus, disabled-state, tooltip, dropdown and reduced-motion behavior has been browser-tested in Chromium/Firefox; touch and full accessibility coverage remains open.

## Document and element baseline

The stylesheet begins with a root font-size clamp and custom properties, then applies a global box-sizing reset and a broad document base. The `html, body` rule sets width/height from AQ variables, font family, line-height, text color, canvas background and `overflow-x:hidden!important`.

The stylesheet also applies normalization rules to common HTML elements and includes custom element-like selectors such as `splash`, `alert`, `dialogue`, `model` and `preloader`. These are selectors for element names; the CSS itself does not register custom elements.

## Form controls

### Inputs

`input` and `.input` are block-level, full-width controls with padding, configurable borders, text color and background color. The source exposes variables for overall and per-edge borders, input text and background.

Invalid input selector: `:is(.input,input):invalid` removes box-shadow and applies a configurable invalid border.

### Selects

`select` and `.select` are full-width with their own padding and the same general border-variable family. The bottom-border variable is spelled `--aq--input-border-bottom` in the source, unlike the apparent `--aq-input-border-bottom` convention. See CSS-013 in the source findings.

### Fieldsets and legends

`fieldset` has configurable per-edge borders, width 100%, margin and padding. `legend` uses a configurable text color and table display.

### Checkboxes and radios

`.check`, `.radio`, `[type=checkbox]` and `[type=radio]` receive 1.2rem dimensions and relative positioning. The exact vertical offset is 0.5rem.

### Textareas

The source resets overflow to auto and outline width to zero. The global outline reset has accessibility implications; test and replace focus styling at component level.

## Buttons

Native buttons and `[type=button|reset|submit]` receive button appearance normalization. The shared visual selector also includes `.btn` and `.button`.

The shared button rule:
- removes border;
- uses inline-block display;
- applies horizontal padding;
- vertically aligns to middle;
- hides overflow;
- removes text decoration;
- uses inherited base color/background before overriding with button swatch tokens;
- centers text;
- uses pointer cursor;
- prevents selection;
- forces auto width with `!important`.

Button themes are controlled through custom properties for button background/text and opacity. Reset/cancel and alert variants have separate selectors. Hover/focus selectors apply a shared hover token family.

**Caution:** the hover alpha fallback uses `inherit` inside relative-color alpha syntax. See CSS-011 and validate in browsers.

## Focus and accessibility

The source applies `outline:none` or `outline-width:0` to links and form controls. Browser tests confirm focused anchors and buttons have no visible outline in the pinned build. The inspected source does not provide a comprehensive replacement focus-visible treatment for every interactive element.

Browser tests confirm the disabled selector styles descendants of `.disabled`/`:disabled`, not the disabled element itself. See CSS-014 and CSS-017.

A production component must explicitly provide:
- visible keyboard focus;
- semantic disabled state;
- keyboard operability;
- touch target sizing;
- non-hover interaction paths;
- contrast that survives theme changes.

## Other utilities

| Selector | Source behavior |
|---|---|
| `.input-animate` | Width transition of 0.4s ease-in-out; focus sets width to 100%; transition remains active under `prefers-reduced-motion: reduce` in Chromium/Firefox |
| `.tooltip .text` | Hides text child by default |
| `.tooltip:hover .text` | Displays text child on hover; keyboard focus alone does not reveal it in browser tests |
| `.code` | Adds top/bottom margin |
| `.tag` | Inline-block label with background/text tokens and horizontal padding |
| `.bar-item` | Float-left horizontal bar item with padding and no border |
| `.hide`, `[hide]` | display:none!important |
| `.show`, `[show]`, `.show-block`, `[show-block]`, `.as-block`, `[as-block]` | display:block!important |
| `.show-inline-block`, `.as-inline-block` and matching attributes | display:inline-block!important |
| `.show-inline`, `.as-inline` and matching attributes | display:inline!important |
| `.show-table`, `.as-table` and matching attributes | display:table!important |
| `.pointer`, `[pointer]` | cursor:pointer |
| `.img`, `.image`, `img` | responsive max-width and auto height |
| `.svg`, `svg` | overflow hidden for non-root SVG |
| `.ul` | unstyled list with padding/margin reset; child rows get separators |

The clearfix rule applies pseudo-elements to `.container`, `.panel`, `.row`, `.row-padding`, `.cell-row`, `.clear` and `.bar`. This does **not** by itself prove that every one of these names has a full grid/container layout implementation in this stylesheet. In particular, do not infer a grid system from the clearfix selector alone.

## Source line map

- Document/form reset and input controls: lines 130–240.
- Tooltip, disabled, code/tag, clearfix and display utilities: lines 241–279.
- Images, SVG and list helpers: lines 280–285.

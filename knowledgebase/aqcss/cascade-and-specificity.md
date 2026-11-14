# AQCSS Cascade, Specificity and Responsive Rule Model

Source: AQCSS v25.6.0, blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-14.

## Structural facts

- Stylesheet size: 1,808 lines, approximately 118 KB.
- Rule blocks in the source-aware catalogue: 1,417.
- Distinct selector text entries in the rule index: approximately 1,409.
- The stylesheet contains 1,285 `!important` declarations across 1,104 source lines.
- Ten `@media` blocks/occurrences were observed, representing nine unique conditions.
- No `@supports`, `@container`, `prefers-color-scheme` or `prefers-reduced-motion` rules were found in the pinned stylesheet.

## Responsive contexts

| Condition | Role |
|---|---|
| `min-width: 600px` | Tablet-prefixed utility family begins |
| `min-width: 993px` | Desktop-prefixed utility family begins |
| `min-width: 1440px` | Large-screen utility family begins |
| Source text `@media (min-width:1px)and(max-width:600px)` | Intended mobile-hide/viewport helper range, but malformed syntax is ignored by Chromium and Firefox |
| `min-width: 601px and max-width: 992px` | Tablet-specific range |
| `min-width: 993px and max-width: 1439px` | Desktop-specific range |
| `max-height: 550px and orientation: landscape` | Short-landscape overlay behavior |
| `pointer: coarse and hover: none` | Touch/coarse-pointer context |
| `pointer: fine and hover: hover` | Fine-pointer/hover context |

The tablet-prefixed utility family starts at 600px. Although the stylesheet appears to intend a mobile helper range through 600px, the actual media prelude lacks required separation around `and`; Chromium and Firefox ignore it. The `.aq-facet-hide-on-mobile` helper therefore remains visible at 599, 600 and 601px in the tested engines. Do not describe this as an active breakpoint overlap.

## Important declarations

The high number of `!important` declarations is a defining cascade constraint.

Practical consequences:
- A later ordinary class rule may not override an AQCSS utility declaration.
- App-level theme overrides may require a more specific selector or carefully scoped `!important`, which can create escalation.
- Do not assume source order alone determines the winning declaration.
- Inspect the exact rule, media context, specificity and importance before overriding.
- Prefer custom properties where the upstream rule actually consumes the token, but validate token type and fallback semantics.

The count is a raw source inventory, not a percentage of all declarations. A generated PostCSS AST catalogue should be used for future precise selector/declaration statistics.

## Custom property behavior

The stylesheet contains repeated custom-property declarations and mixed value conventions:
- Some swatch tokens are first declared as RGB channel triplets and later redefined as hex colors.
- Some rules use modern relative-color syntax `rgb(from ...)`.
- Other rules use `rgb(var(--aq-swatch-...))`, which expects channel values and may fail when the winning variable is a hex color.
- `--aq-paragraph-size` is unitless but is consumed by `font-size`, making the nonzero value invalid.
- Several opacity variables use `inherit` as a fallback; verify the property context before relying on it.

See `custom-property-index.json`, `theme-effects.md` and source findings CSS-019–CSS-023.

## Specificity policy for Labs components

1. Use AQCSS classes only where their complete rule and media context are understood.
2. Scope additional component styles under a component root (for example `.labs-profile-card ...`) rather than broad global selectors.
3. Avoid broad overrides of `html`, `body`, `input`, `button` and other global elements unless the component requires it.
4. Prefer app-owned custom properties for theme values, but do not overwrite AQ tokens with incompatible value types.
5. Record each custom rule and explain why the existing AQCSS rule cannot meet the requirement.
6. Test the winning computed style at each relevant breakpoint and pointer context.

## Runtime work completed and remaining

Verified in Chromium and Firefox by the current Playwright suite: 599/600/601 tablet/mobile helper behavior, 993/1440 responsive utilities, invalid row-gap, facet width, base border token, relative-color alpha support, flex/spacing aliases, focus outline, disabled descendants, tooltip and dropdown interaction, plus source/minified AST parity.

Still pending: 992/993 and 1439/1440 boundary coverage for additional selector families, touch/hybrid pointer behavior, short-landscape overlay behavior, broad color-token coverage across themes, and wider browser compatibility beyond Chromium/Firefox.

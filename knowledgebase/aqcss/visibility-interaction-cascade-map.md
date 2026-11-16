# AQCSS Visibility, Display and Interaction-State Cascade Map

Source: `ActiveQuery.css` v25.6.0, pinned Git blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-16.

Status: selector declarations and media-query structure are source-confirmed. Existing Chromium/Firefox observations are identified separately. This page consolidates display/visibility utilities, pointer helpers, and the stylesheet's hover/focus/disabled behavior; it is not a complete accessibility audit or an exhaustive cascade graph. Pointer capability media behavior has selected Chromium/Firefox coverage and Chromium mobile emulation coverage (run #376); the latest full suite is run #392.

## 1. Display and visibility are not interchangeable

AQCSS's baseline display helpers are at lines 275–279:

| Selector(s) | Declaration | Meaning |
|---|---|---|
| `.hide`, `[hide]` | `display:none!important` | Removed from layout and normal visual rendering |
| `.show`, `[show]`, `.show-block`, `[show-block]`, `.as-block`, `[as-block]` | `display:block!important` | Forces block display |
| `.show-inline-block`, `.as-inline-block` and matching attributes | `display:inline-block!important` | Forces inline-block display |
| `.show-inline`, `.as-inline` and matching attributes | `display:inline!important` | Forces inline display |
| `.show-table`, `.as-table` and matching attributes | `display:table!important` | Forces table display |

There is no corresponding `visibility:hidden` utility in this group. `display:none` removes the element from layout; it is not an opacity or visibility toggle and does not preserve its layout slot.

All these declarations use `!important`. A normal author declaration such as an inline `style="display:block"` will not override `.hide`. An important declaration can still compete according to origin, importance, cascade layer, specificity and source order.

### Same-element conflicts

The display helpers have the same class/attribute specificity within their respective selector forms. The show rules occur after the hide rule (lines 275–279). Therefore, when two matching selectors have equal specificity and importance, a later show declaration can win over an earlier hide declaration. Do not apply contradictory display tokens to the same element and assume that `hide` is a universal veto. Higher-specificity important rules and other cascade origins can change the outcome.

The `.show` family forces particular display types; it does not restore an element's original or context-appropriate display value. For example, `.show` always asks for block, even if the element's natural display would be inline, flex, grid or table-row.

## 2. Pointer cursor helper

At line 280, `.pointer` and `[pointer]` set `cursor:pointer` without `!important`. This changes the cursor presentation only. It does not:
- add click or keyboard handlers;
- make a non-interactive element focusable;
- provide button/link semantics;
- guarantee a touch interaction.

Use a native button or link when the element performs an action or navigation.

## 3. Viewport and input-capability visibility helpers

These are separate media conditions, not one unified responsive visibility system:

| Source line | Exact condition | Selector | Source/runtime interpretation |
|---|---|---|---|
| 1785 | `(pointer: coarse) and (hover: none)` | `.aq-facet-hide-on-touch` | Hides only when the primary pointer is coarse and the primary input cannot hover |
| 1786 | `(min-width:1px)and(max-width:600px)` | `.aq-facet-hide-on-mobile` | Malformed media condition; ignored in Chromium/Firefox |
| 1787 | `(min-width:601px)and(max-width:992px)` | `.aq-facet-hide-on-tablet` | Malformed media condition; ignored in Chromium/Firefox |
| 1805 | `(pointer:fine) and (hover:hover)` | `.aq-facet-hide-on-no-touch` | Hides when the primary pointer is fine and can hover; name is broader/less precise than the actual condition |
| 1806 | `(min-width:993px)and(max-width:1439px)` | `.aq-facet-hide-on-desktop` | Malformed media condition; ignored in Chromium/Firefox |
| 1807 | `(min-width:1440px)` | `.aq-facet-hide-on-screen` | Valid min-width condition; hides at 1440px and wider |

The malformed conditions omit required whitespace around the `and` operator. Existing Chromium/Firefox tests report that mobile, tablet and desktop helpers remain visible throughout their nominal ranges. The valid screen helper works at 1440px. This is already recorded as CSS-018; see the media-query map for exact viewport boundaries and runtime evidence.

The pointer conditions describe input capabilities, not a device category. Hybrid devices and multiple input devices can expose behavior that does not align with a simplistic touch/desktop label. The queries do not inspect every available pointer; they evaluate the primary pointer/hover characteristics.

## 4. Hover, focus, active and disabled states

### Buttons

At lines 237–240, the grouped button selector applies the same hover color treatment to `:focus` and `:hover`:

- `:focus` and `:hover` share foreground/background declarations.
- The declarations use relative-color alpha values with fallback tokens defaulting to `inherit`.
- Existing CSS-011 records that `inherit` is not a valid numeric/percentage alpha component; browser tests cover the source's actual computed behavior and explicit-token case.

No separate `:focus-visible` treatment or button `:active` state is defined in this block. The stylesheet also removes outlines from anchors and controls in the broad reset at lines 135–156. Existing browser tests found no visible focus outline on focused anchors/buttons in the pinned build. The Firefox-specific `::-moz-focusring` rule at line 207 is not a complete replacement for all affected elements and engines.

### Tooltip

- `.tooltip .text` is `display:none` (line 243).
- `.tooltip:hover .text` is `display:inline-block` (line 244).
- No focus/focus-within or click path is defined in this tooltip rule.

Existing browser tests confirm hover reveals the tooltip text and keyboard focus alone does not. Treat it as pointer-hover presentation, not an accessible disclosure component.

### Dropdown

The hover dropdown is documented in [theme and effects](theme-effects.md): content is revealed through `.aq-fleek--dropdown-hover:hover .aq-fleek--dropdown-content`. The class named `.aq-fleek--dropdown-click` does not implement click state in CSS. Existing browser tests confirm hover opens the hover variant, keyboard focus does not, and the click-named variant has no click-to-open behavior.

### Disabled styling

At line 245–246:

```css
.disabled *,
:disabled * {
  cursor: not-allowed;
  opacity: 0.3;
  pointer-events: none;
  box-shadow: none;
}
```

The descendant combinator is material: these selectors style descendants of an element matching `.disabled` or `:disabled`; they do not directly style the matched disabled element itself. A disabled input/button can therefore fail to receive these cursor/opacity/pointer-events declarations from this rule. This is already tracked as CSS-017.

The class `.disabled` is only a styling hook; it does not set the native `disabled` property, remove an element from keyboard navigation, or prevent application event handlers from running. The CSS also does not provide a complete disabled-state contract for custom controls.

## 5. Reduced motion and animation

The source defines `.input-animate` with a 0.4s width transition and expands it on focus (lines 241–242). Existing Chromium/Firefox tests confirm that the transition remains active under `prefers-reduced-motion: reduce`. No reduced-motion override was found in the pinned stylesheet. Applications using this helper should provide their own reduced-motion treatment.

## 6. Cascade and implementation guidance

1. Do not combine hide and show tokens on one element. Both are important display declarations and the later/equally-specific matching rule may win.
2. Do not expect normal inline styles to override these important utilities.
3. Do not use `.pointer` as a substitute for semantic interactive markup.
4. Do not rely on mobile/tablet/desktop hide helpers; their media conditions are invalid in tested Chromium/Firefox.
5. Use the pointer helpers only when primary pointer/hover capability is genuinely the desired criterion; do not treat them as viewport breakpoints.
6. Do not rely on hover-only tooltip/dropdown disclosure for keyboard or touch users.
7. Add visible keyboard focus styles at the component/application layer; the pinned stylesheet removes broad outlines and does not provide a complete focus-visible system.
8. Use native disabled semantics and explicitly style the disabled control itself; the current descendant selectors miss that target.
9. Add a `prefers-reduced-motion: reduce` override for `.input-animate` and other motion effects.
10. Keep CSS behavior and application behavior distinct: CSS cursor/opacity/pointer-events do not implement event handling, ARIA state, focus management or keyboard operation.

## 7. Existing runtime evidence and remaining gaps

The existing successful browser run #313 covered:
- mobile/tablet/desktop hide helper failures and the working screen helper at representative viewport boundaries;
- hover dropdown vs keyboard focus and the click-named dropdown behavior;
- basic focus-outline removal;
- disabled-descendant selector behavior;
- hover-only tooltip behavior;
- reduced-motion behavior for `.input-animate`.

These are targeted tests, not an accessibility conformance audit. Remaining gaps include:
- hybrid and multi-pointer devices, real touch hardware and pointer preference combinations;
- keyboard operation and focus order for application components using these CSS hooks;
- high-contrast/forced-colors behavior and zoom/reflow;
- a complete focus-visible replacement and disabled-state visual/semantic matrix;
- cascade tests combining multiple display tokens, responsive utilities and inline important declarations;
- assistive-technology behavior for tooltip/dropdown implementations.

Do not claim these utilities are accessibility-complete.

## Source anchors

- Baseline controls, button states, tooltip and disabled selector: `ActiveQuery.css:135–249`.
- Display and pointer helpers: `ActiveQuery.css:275–280`.
- Input-capability and viewport helpers: `ActiveQuery.css:1785–1807`.
- [Pinned upstream stylesheet](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L135-L280)
- [Pinned visibility media helpers](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1785-L1807)
- [Browser validation plan](../testing/browser-test-plan.md)
- [Source findings and verification queue](../testing/source-findings.md)
- [Media-query and responsive selector map](media-query-and-selector-map.md)
- [Base styles and controls](base-controls.md)
- [Theme and effects](theme-effects.md)

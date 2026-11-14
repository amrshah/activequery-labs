# AQCSS Cross-Family Cascade and Selector-Conflict Audit

Source: `ActiveQuery.css` v25.6.0, pinned Git blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-15.

## Purpose and evidence boundary

This audit connects utility families that are documented separately. It focuses on rules that target the same element/property, where importance, specificity, source order, media eligibility or CSS sizing constraints determine the result.

Evidence labels:
- **Source-confirmed:** exact selectors, declarations, importance and source order are traced to the pinned stylesheet.
- **Derived:** the likely winning declaration or used-value consequence follows from the CSS cascade/sizing model.
- **Runtime-verified:** only where explicitly tied to existing Chromium/Firefox coverage. This page does not claim that every combination below has a dedicated browser test.

The audit is not a replacement for the family maps. Use those pages for complete token lists and source anchors.

## 1. The practical cascade model

For the utility families mapped here, resolve a conflict in this order:

1. Confirm the selector actually matches. Malformed selector lists, spelling mismatches and impossible `:not()` combinations never enter the cascade.
2. Confirm the enclosing media query matches. The 600/993/1440px min-width blocks are cumulative. Three width-range hide media queries are malformed and ignored in Chromium/Firefox.
3. Compare origin, importance and cascade layer. The pinned stylesheet does not use cascade layers. A normal declaration cannot defeat a competing important declaration merely by appearing later.
4. Compare specificity among declarations at the same origin/importance/layer.
5. Use source order when the preceding cascade criteria tie.
6. For sizing, also account for min/max constraints and intrinsic layout rules; the winning `width` declaration is not always the final used width.

Most AQ utility classes have one class selector (specificity 0-1-0). Important utilities can therefore be difficult to override from ordinary component CSS. A component selector such as `.labs-card .aq-facet--half` has greater class specificity but still does not beat an important AQ declaration if the component declaration is normal.

## 2. High-value cross-family conflict matrix

| Combination on one element | Property overlap | Winning/combined behavior | Evidence |
|---|---|---|---|
| `.aq-border` + `.aq-border--no` | `border` | Important `border:0` defeats the normal border utility | Source-confirmed: lines 338–346; no-border line 337 |
| `.aq-border` + `.aq-swatch-border--primary` | Border color | Border utility creates width/style; swatch changes only color. Both can contribute | Source-confirmed: lines 338–346, 378–388 |
| `.aq-border--no` + `.aq-swatch-border--primary` | Border and border-color | Border is removed by important shorthand; color token alone cannot restore visible border style/width | Derived |
| `.aq-facet--full` + `.aq-facet--w-auto` | Width | Important `w-auto` defeats normal `full`; height from `full` remains | Source-confirmed: lines 575–599 |
| `.aq-facet--full-screen` + `.aq-facet--w-auto` | Width | Both width declarations important and same class specificity; later `w-auto` wins width; full-screen height remains | Source-confirmed: lines 576–599; derived cascade |
| `.aq-facet--w-*` + `.aq-facet--w-min-*` / `--w-max-*` | Width and min/max width | Width is set while min/max constraints can clamp the used size; these are not simple overrides | Source-confirmed: lines 601–636; derived sizing |
| `.aq--margin-all` + `.aq--margin-left` | Margin shorthand and left margin | Both important and equal class specificity; later directional longhand wins left while shorthand still supplies other sides | Source-confirmed: lines 505, 515–520; derived cascade |
| `.aq--padding-all` + `.aq--padding-left` | Padding shorthand and left padding | Same shorthand/longhand pattern; later directional declaration wins the left edge | Source-confirmed: lines 541, 551–556 |
| `.aq-affix--fixed` + `.aq-affix--top` | Position and top | Important fixed position beats normal absolute position; top offset from edge helper remains | Source-confirmed: lines 711–717 |
| `.aq-affix--sticky` + `.aq-affix--top` | Position and top | Important sticky position wins; top:0 supplies the sticky threshold | Source-confirmed: lines 713–717 |
| `.aq-affix--center` + another transform-producing app rule | Transform | Affix utility writes the complete transform value; it does not compose with another transform declaration | Source-confirmed: lines 722–726; derived |
| `.aq-flexon--column` + an alignment helper | Align/justify | More-specific `[class*=--column]:is(...)` override selectors can win over single-class alignment rules for listed alignments | Source-confirmed: lines 766–783; detailed in flex map |
| Two `.aq-flexon--*` filter-like flex utilities for same property | Flex-flow/alignment/gap | Same importance/specificity often leaves source order decisive; some selector spellings do not match independently at all | Source-confirmed; see flex map |
| Two background swatch classes | Background and sometimes color | Same specificity; later source rule wins each overlapping property | Source-confirmed: lines 354–364 |
| Base swatch + matching hover swatch | Background/color | Hover selector adds pseudo-class specificity and overrides the base while hovered, for properties it sets | Source-confirmed: lines 354–364 |
| `.aq-fleek--grayscale` + `.aq-fleek--invert` | Filter | Both replace the complete `filter` property; they do not compose | Source-confirmed: lines 414–421 |
| `.aq-fleek--opacity-max` + `.hide` | Opacity and display | Opacity zero leaves layout box; important display:none removes it from layout | Source-confirmed: lines 275–279, 422–425 |
| `.aq-swatch-border--*` without a border utility | Border color only | No visible border is guaranteed because width/style may remain none | Source-confirmed: lines 378–388 |
| `.pointer` + `.disabled` wrapper | Cursor and descendant pointer events | Pointer cursor applies only to matched element; disabled wrapper sets pointer-events:none on descendants, not wrapper itself | Source-confirmed: lines 245–246, 280; derived |
| `img` + `.aq-facet--wide-screen` | Width and max-width | Width utility sets 100vw important, but the global image max-width:100% remains a sizing constraint and can cap used width | Source-confirmed: line 281 and facet lines 575–600; derived |

## 3. Importance patterns by family

| Family | Typical importance | Cross-family implication |
|---|---|---|
| Margin/padding | Almost all utility declarations important | Normal component spacing rules do not override them |
| Facet sizing | Most dimension/constraint declarations important; `--full` is normal | `--full` is comparatively weak; important sizing tokens can defeat it |
| Flex layout | Most flow/alignment/gap declarations important; `right-bottom` alignment omits important | The right-bottom helper is vulnerable to competing important rules |
| Positioning | `absolute`, `fixed`, `sticky` modes important; edge/corner helpers generally normal | Position mode can win while edge offsets remain active |
| Typography | Weight and text alignment helpers often important; many font-size/case/decoration declarations normal | Weight/alignment resist normal overrides; normal size helpers are easier to override |
| Borders | Basic border/radius declarations normal; no-border important | No-border defeats normal border-producing utilities |
| Swatches | Background/text/border color rules normal | Important component styles can defeat them |
| Fleek effects | Filter/opacity rules normal | Important application effects can defeat them; same-property utilities still compete by specificity/order |
| Visibility | Hide/show display declarations important | Normal display declarations cannot override them |
| Global element/reset rules | Mostly normal, with selected important body overflow rules | Class utilities often outrank normal element selectors, but importance and sizing constraints still matter |

Do not use this table as a blanket rule for every selector. Inspect the exact declaration; family-level summaries are only triage.

## 4. Responsive cross-family precedence

The responsive min-width contexts are:
- `aq-t-`: min-width 600px;
- `aq-d-`: min-width 993px;
- `aq-s-`: min-width 1440px.

These conditions are cumulative, not exclusive. At 1440px and wider, all three media blocks are eligible.

For same-property declarations with equal specificity and importance, later eligible source rules can win. Therefore, if an element carries multiple breakpoint-specific tokens targeting the same property (for example, tablet and desktop margin-all classes), the later desktop rule wins at widths where both media queries match; a large-screen rule can in turn win at 1440px and wider. This is based on stylesheet source order, not the order of class tokens in the HTML attribute.

Important limitations:
- Responsive tokens are not all exact semantic copies of base tokens.
- Some families omit variants, use different alias spellings or contain source defects.
- Responsive flex display lists are syntactically valid but have spelling mismatches with flow declarations; base flex selector list has missing commas.
- Three mobile/tablet/desktop hide-range media queries are malformed and ignored in tested Chromium/Firefox.
- Do not infer exclusive mobile/tablet/desktop behavior from the prefix labels.

Use the [media-query map](media-query-and-selector-map.md) for exact contexts and the family-specific maps for per-family deviations.

## 5. Global selectors versus AQ utility classes

Global element rules can interact with AQ utility classes even though they do not share AQ naming:

- `img,.img,.image` sets max-width:100% and height:auto. An important AQ width can still be constrained by max-width at used-value time.
- `p,.aq-text--p` shares a rule. A paragraph element matches the type selector; an element with the AQ class matches the class selector. The class selector is more specific, but both declarations are in the same rule.
- Heading defaults use `h1`–`h6` and `[class^="aq-text--h"]`. The attribute selector only matches when the class attribute begins with that prefix; it is not equivalent to a token search anywhere in a multi-class attribute.
- The global `:is(button,...,.btn,.button)` selector styles native and custom button classes. Native semantics are not supplied to arbitrary custom elements by CSS.
- `.disabled *` and `:disabled *` target descendants, not the matched disabled element. A direct utility class on the disabled control may still apply to that control, while descendants get pointer-event suppression.
- `html,body` overflow-x and document dimensions are global constraints. A component-level width/overflow utility should be evaluated on the actual element and against the exact important declarations.

Avoid adding broad global overrides to fix a component-specific conflict. Scope the fix to the component root and record any deliberate specificity escalation.

## 6. Selector match failures are not cascade wins

Some apparent conflicts are actually selector matching defects. The declaration never participates if the selector does not match:

- Base flex display selector list: missing commas create descendant selector chains for several intended alternatives.
- Base flex alignment/shrink aliases: missing commas create compound selectors that require multiple classes.
- Responsive flex display lists contain `--warp` spellings while flow declarations use `--wrap`.
- Stretch/grow selectors combine `:not([class*=flexon])` with utility tokens whose own class name contains `flexon`; the intended grow rule cannot match those utility-bearing elements.
- Large-screen typography includes uppercase `aq-S-` tokens where the rest of the family uses lowercase `aq-s-`.
- Responsive mobile/tablet/desktop hide range media preludes are malformed.

These are already documented in the relevant family maps and source findings. Do not describe them as ordinary specificity conflicts or attempt to fix them through more classes.

## 7. Recommended authoring strategy for Labs components

1. Start with one primary utility per property family: one width token, one position mode, one flex direction and one text size at a given breakpoint.
2. Combine utilities only when their property scopes are intentionally complementary (for example, `aq-border` + `aq-swatch-border--primary`).
3. Avoid contradictory tokens on the same property. Do not depend on HTML class order.
4. Treat shorthand plus longhand combinations as intentional only when the source order and importance are understood.
5. Keep responsive variants explicit and test the exact thresholds. Remember the min-width contexts overlap.
6. Use app-owned component CSS for combinations AQCSS cannot express reliably. Scope it under the component root.
7. If overriding an important utility, first consider removing the conflicting utility rather than escalating specificity/importance.
8. Test computed styles on the actual semantic element, not only a generic div; native elements have global rules and intrinsic sizing.
9. Preserve known defects in documentation; never silently describe intended behavior as actual behavior.
10. Do not modify upstream source as part of this knowledgebase audit.

## 8. Minimal conflict-test matrix

A future targeted browser suite should cover these combinations without rerunning the full suite for every documentation update:

| Test | Example class combination | Assert |
|---|---|---|
| Border cancellation | `aq-border aq-border--no` | Computed border width/style |
| Border color | `aq-border aq-swatch-border--primary` | Computed border color and style |
| Full vs auto width | `aq-facet--full aq-facet--w-auto` | Computed width |
| Full-screen vs auto width | `aq-facet--full-screen aq-facet--w-auto` | Width and height separately |
| Spacing shorthand/longhand | `aq--margin-all aq--margin-left` | Four computed margin sides |
| Affix mode/edge | `aq-affix--fixed aq-affix--top` | Position and top |
| Column alignment | `aq-flexon aq-flexon--column aq-flexon--center-top` | Align-items and justify-content |
| Swatch hover | base swatch + hover variant | Background and color before/during hover |
| Filter collision | grayscale + invert | Computed filter string |
| Invisible vs hidden | opacity-max vs hide | Opacity, display and layout participation |
| Image sizing | img + wide-screen facet token | Width and max-width/used size |
| Responsive overlap | tablet and desktop spacing classes at 1200px | Winning margin/padding declaration |

These are proposed focused tests, not claims that all are currently present in the browser suite. Prefer adding them to the existing harness as a coherent test batch when runtime verification is scheduled. Do not run the full GitHub Actions workflow just to validate documentation.

## Source anchors and references

- Global element/control selectors: `ActiveQuery.css:135–285`.
- Typography defaults and utility rules: `ActiveQuery.css:288–335`.
- Border/radius/no-border and swatches: `ActiveQuery.css:337–388`.
- Fleek effects and overlay/dropdown: `ActiveQuery.css:414–453`.
- Spacing shorthand and directional utilities: `ActiveQuery.css:503–574`.
- Facet sizing: `ActiveQuery.css:575–708`.
- Positioning and flex utilities: `ActiveQuery.css:710–811`.
- Responsive contexts: `ActiveQuery.css:813–1783`.
- Visibility and pointer media helpers: `ActiveQuery.css:1785–1807`.
- [Pinned upstream stylesheet](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css)
- [Cascade and specificity model](cascade-and-specificity.md)
- [Responsive media-query map](media-query-and-selector-map.md)
- [Spacing cascade map](spacing-cascade-map.md)
- [Sizing cascade map](sizing-cascade-map.md)
- [Flex cascade map](flex-cascade-map.md)
- [Positioning cascade map](positioning-cascade-map.md)
- [Typography cascade map](typography-cascade-map.md)
- [Visibility and interaction map](visibility-interaction-cascade-map.md)
- [Theme and effects map](theme-effects.md)
- [Base controls map](base-controls.md)

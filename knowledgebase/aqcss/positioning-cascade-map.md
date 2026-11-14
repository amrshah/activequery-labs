# AQCSS Positioning / Affix Cascade Map

Source: ActiveQuery.css v25.6.0, blob SHA c03546ecd1a41d26cbbfa8f1e31d38731f77cf62.
Evidence: selector/declaration behavior below is source-confirmed. Browser layout, scroll-container and containing-block interactions are not newly runtime-verified by this page.

## Scope and source locations

The aq-affix family is a compact positioning utility group repeated in four contexts:

| Context | Prefixes | Source lines | Activation |
|---|---|---:|---|
| Baseline | aq-affix, aq-m-affix | 710–727 | Always |
| Tablet | aq-t-affix | 1049–1066 | min-width: 600px |
| Desktop | aq-d-affix | 1374–1391 | min-width: 993px |
| Large screen | aq-s-affix | 1697–1714 | min-width: 1440px |

The responsive media blocks are cumulative min-width queries, not mutually exclusive device ranges. At 1440px, tablet, desktop and large-screen rules all participate in the cascade.

## Position mode utilities

Each context provides these modes:

| Token suffix | Declaration | Important? | Practical meaning |
|---|---|---:|---|
| --relative | position: relative | No | Establishes a positioned ancestor/containing block; does not itself add an offset |
| --absolute | position: absolute | Yes | Removes the element from normal flow and positions it against its containing block |
| --fixed | position: fixed | Yes | Uses fixed positioning subject to browser containing-block rules |
| --sticky | position: -webkit-sticky; position: sticky | Yes | Includes a prefixed declaration followed by the standard declaration |

The relative utility is the only mode declaration without !important. Absolute, fixed and sticky mode declarations are important.

**Sticky caveat:** --sticky only sets position; it does not set top, bottom or another inset. A sticky element normally needs a non-auto inset on the relevant axis to produce a visible sticky threshold. The edge helper can supply top: 0 or bottom: 0, while the sticky mode's important position declaration wins over the edge helper's ordinary position: absolute declaration.

## Edge and corner helpers

These helpers set absolute positioning plus a zero offset:

| Helper | Properties |
|---|---|
| --top | position:absolute; top:0 |
| --bottom | position:absolute; bottom:0 |
| --left | position:absolute; left:0 |
| --right | position:absolute; right:0 |
| --top-left, --left-top | position:absolute; left:0; top:0 |
| --top-right, --right-top | position:absolute; right:0; top:0 |
| --bottom-left, --left-bottom | position:absolute; left:0; bottom:0 |
| --bottom-right, --right-bottom | position:absolute; right:0; bottom:0 |

The alias pairs are comma-separated alternatives in all four contexts. Unlike the base flex alignment aliases, no missing-comma compound-selector defect was observed in the affix rules.

These helpers do not set dimensions, margins, padding, z-index, or a containing block. The browser's containing-block rules and the ancestor tree determine the actual placement.

## Center and midpoint helpers

The center helpers are also absolute-positioning helpers:

| Helper aliases | Offsets | Transform |
|---|---|---|
| --center, --middle | top:50%; left:50% | translate(-50%, -50%) |
| --left-center, --center-left | top:50%; left:0% | translate(0%, -50%) |
| --right-center, --center-right | top:50%; right:0% | translate(0%, -50%) |
| --center-top, --top-center | left:50%; top:0 | translate(-50%, 0%) |
| --center-bottom, --bottom-center | left:50%; bottom:0 | translate(-50%, 0%) |

Each declaration also writes the same transform to -ms-transform. The standard transform declaration is present and is the one modern browsers use.

**Composition warning:** these helpers assign the transform property directly. Applying another transform utility or application transform to the same element competes for that single property; it does not automatically compose the two transforms. Use a nested wrapper when both transformations are required.

## Cascade and class-combination behavior

The mode declarations appear before the edge/corner/center declarations within each context. Most rules have equal class-selector specificity.

- relative + top/edge/corner/center: the later helper's ordinary position:absolute wins over position:relative. The edge helper is not a relative-offset helper.
- absolute + edge/corner/center: both request absolute positioning; helper contributes the offsets/transform.
- fixed + edge/corner/center: position:fixed!important wins over the helper's ordinary position:absolute; offsets and transforms from the helper remain. This supports fixed edge/center placement.
- sticky + top/bottom: position:sticky!important wins over the helper's ordinary absolute position; the helper supplies the inset needed for sticky behavior.
- sticky + left/right: the helper supplies a horizontal inset, but whether that produces useful sticky behavior depends on the scroll axis and surrounding layout.
- Multiple edge/center helpers on one element can assign conflicting inset properties or transforms. The later matching declaration wins per property; avoid treating them as composable positioning primitives.

The responsive families repeat the same internal ordering and declaration patterns. A responsive helper can override a base helper when both declarations have equal importance and specificity. However, an important base mode such as aq-affix--fixed or aq-affix--sticky is not defeated by a later responsive helper's non-important position:absolute. A responsive important mode declaration can override an earlier important mode declaration when its selector has equal specificity and occurs later.

## What the affix family does not provide

Source inspection of the affix blocks found no:
- z-index or stacking-order utility;
- arbitrary numeric or configurable inset utility;
- width/height sizing;
- sticky inset by default;
- transform composition mechanism;
- responsive variants for the aq-m-affix baseline aliases inside the media queries (the aq-m- aliases are part of the baseline block).

Use the separate facet sizing family for dimensions, application CSS for stacking order/custom offsets, and a positioned ancestor where absolute positioning needs a deliberate containing block. Do not infer that an aq-affix class alone guarantees a particular visual location independent of DOM structure.

## Practical usage patterns

~~~html
<!-- Absolute child anchored to a positioned parent -->
<div class="aq-affix--relative">
  <div class="aq-affix--top-right">...</div>
</div>

<!-- Fixed centered overlay -->
<div class="aq-affix--fixed aq-affix--center">...</div>

<!-- Sticky element with an explicit top inset -->
<header class="aq-affix--sticky aq-affix--top">...</header>

<!-- Tablet-only fixed bottom bar -->
<div class="aq-t-affix--fixed aq-t-affix--bottom">...</div>
~~~

These are source-based class-combination examples, not substitutes for testing the containing block, scroll container, viewport and stacking context in the target page.

## Validation status

- **Source-confirmed:** baseline, tablet, desktop and large-screen affix rule blocks; mode importance; edge/corner aliases; center transforms; repeated ordering; absence of z-index and custom inset declarations within the affix blocks.
- **Derived:** class-combination outcomes described above follow from selector specificity, declaration importance and source order.
- **Runtime-verified in AQX-009:** combining sticky mode with the top helper computes to `position:sticky` and `top:0` in Chromium and Firefox. **Not runtime-verified:** actual sticky movement across nested scroll containers, fixed positioning under transformed ancestors, absolute containing-block geometry, clipping/overflow interactions, and z-index behavior in a composed page.
- **No upstream source changes:** this is a knowledgebase-only mapping.

## Source anchors

- Baseline: ActiveQuery.css:710–727.
- Tablet: ActiveQuery.css:1049–1066 (min-width:600px).
- Desktop: ActiveQuery.css:1374–1391 (min-width:993px).
- Large screen: ActiveQuery.css:1697–1714 (min-width:1440px).
- Responsive media-query model and cumulative behavior: media-query-and-selector-map.md.
- Related dimensions and overflow helpers: sizing-cascade-map.md.

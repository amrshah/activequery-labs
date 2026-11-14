# AQCSS Implementation Recipes — Source-Grounded Patterns

Source: ActiveQuery.css v25.6.0, pinned blob SHA c03546ecd1a41d26cbbfa8f1e31d38731f77cf62.
Status: recipes are source-grounded composition guidance, **not all runtime-tested end-to-end**. Do not treat an untested recipe as a framework guarantee.

## Rules before composing utilities

- Consult the family maps and the [cross-family conflict audit](cross-family-cascade-audit.md).
- The aq-t-, aq-d- and aq-s- min-width blocks are cumulative at 600, 993 and 1440 CSS px.
- Class attribute order does not determine the winner. Importance, specificity and stylesheet order do.
- Many layout utilities use !important. Remove conflicting utility classes before escalating application CSS.
- Use semantic HTML first. CSS does not add button, dialog, disabled, tooltip or form semantics.

## 1. Responsive card grid using flex

~~~html
<section class="aq-flexon aq-flexon--row-wrap aq-flexon--gap">
  <article class="aq-facet--w-12 aq-t-facet--w-6 aq-d-facet--w-4">...</article>
  <article class="aq-facet--w-12 aq-t-facet--w-6 aq-d-facet--w-4">...</article>
</section>
~~~

Intent: one card per row at base widths, two at 600px+, three at 993px+.

The base aq-flexon class reliably establishes flex display. Do not assume a base modifier alone does. Width fractions are important; test the actual gap and box sizing. Two 50% children plus a gap can exceed the row width. Full wrapping/card/gap geometry is not yet end-to-end runtime-verified.

## 2. Responsive direction change

~~~html
<div class="aq-flexon aq-flexon--row aq-d-flexon--column">
  <nav>...</nav><main>...</main>
</div>
~~~

Intent: row at base, column from 993px upward. The responsive desktop column selector appears in the responsive display list and flow declaration. Test the 992/993 boundary. Responsive media blocks are cumulative.

## 3. Spacing with responsive overrides

~~~html
<div class="aq--padding-all-small aq-t--padding-all aq-d--padding-all-large">...</div>
~~~

Intent: 0.5rem base padding, 1rem at 600px+, 2rem at 993px+. Equal-specificity important declarations resolve by eligible source order, not HTML class order.

Avoid the default 1rem directional left token: the base/mobile selector defect maps the left declaration to the right-side token. The right-side class consequently sets both sides. See [spacing cascade map](spacing-cascade-map.md).

## 4. Full-width content and constrained media

~~~html
<div class="aq-facet--full aq--padding-all">
  <img class="aq-facet--wide-screen" src="..." alt="">
</div>
~~~

This is not a safe generic full-bleed recipe without layout verification. aq-facet--full is normal importance and sets width/height to 100%. aq-facet--wide-screen sets width:100vw!important. Global img sets max-width:100% and height:auto; max-width can constrain the used width even when width is important. Viewport width can exceed the containing block and create horizontal overflow. Prefer a dedicated, tested component rule.

## 5. Sticky header

~~~html
<header class="aq-affix--sticky aq-affix--top">...</header>
~~~

Sticky mode sets position:sticky!important; the top helper contributes top:0. Sticky alone does not set an inset. Verify the nearest scrolling ancestor, stacking context and actual scroll behavior. The affix family does not provide z-index utilities.

## 6. Centered overlay content

~~~html
<div class="labs-overlay"><div class="aq-affix--center">...</div></div>
~~~

Use an app-owned overlay root for fixed positioning, backdrop, activation and accessibility. The AQ center helper itself uses absolute positioning and translate. It is not viewport-centering unless the containing block is designed accordingly. Its transform replaces another transform on that element. The AQ screen-overlay helper is a hidden visual primitive, not a complete modal/dialog.

## 7. Typography hierarchy

~~~html
<h1 class="aq-text--fw-700">Page title</h1>
<p class="aq-text--large">Introductory text.</p>
<h2 class="aq-t-text--h2">Section title</h2>
~~~

Native headings receive global size, line-height, weight, margin and color rules. Base named weight utilities are important; text size helpers are generally normal declarations. Tablet typography activates at 600px. Root --aq-paragraph-size defaults to unitless 1.2, invalid when used as font-size; override with a length such as 1.2rem. Large-screen h4/h5/h6 and fs-2/fs-3 selectors contain uppercase-S spelling mismatches.

## 8. Themed bordered panel

~~~html
<section class="aq-border aq-swatch-bg--primary aq-swatch-border--secondary">...</section>
~~~

The border utility establishes border style/width; background swatch supplies background (and paired foreground where declared); border swatch supplies border color only. Root swatch declarations mix RGB triplets and later hex values; legacy rgb(var(...)) consumers can fail with the effective hex token. aq-border--no is important and removes the border even if a border-color utility is present. Confirm contrast, hover and token values in the actual browser. This is not a verified accessible theme.

## 9. Hide vs visually transparent

Use hide/show only when display removal/restoration is intended. Opacity zero retains layout space and does not disable keyboard or pointer interaction. display:none removes the element from layout. CSS .disabled is not native disabled semantics. Interactive content needs proper focus management and semantic state in application code.

## 10. Flex gaps and alignment

~~~html
<div class="aq-flexon aq-flexon--row aq-flexon--gap">...</div>
~~~

--gap sets row-gap only. Use explicit --row-gap and --column-gap when both axes matter. Avoid --row-gap-xlarge: its unitless 2 value is invalid. Base small gap exists; responsive families start at default gap. Column alignment has more-specific axis-specific overrides. Base aq-m alignment aliases have missing-comma selector defects; consult the flex map before choosing aliases.

## Validation checklist

1. Confirm the pinned stylesheet SHA matches this page.
2. Confirm every class token exists in the class-token/rule catalog.
3. Check selector matching, media context, declarations and importance.
4. Test the actual semantic element, not only a generic div.
5. Test viewport boundaries 599/600, 992/993 and 1439/1440.
6. Inspect computed style and actual geometry; percentage width depends on containing block and box sizing.
7. Test keyboard, pointer/touch and reduced motion where interaction is involved.
8. Promote a recipe to runtime-verified only after retaining browser/version, viewport, setup and expected/actual results.

## Related references

- [Cross-family cascade audit](cross-family-cascade-audit.md)
- [Layout utilities](layout-utilities.md)
- [Flex cascade map](flex-cascade-map.md)
- [Spacing cascade map](spacing-cascade-map.md)
- [Sizing cascade map](sizing-cascade-map.md)
- [Positioning / affix map](positioning-cascade-map.md)
- [Typography cascade map](typography-cascade-map.md)
- [Visibility / interaction map](visibility-interaction-cascade-map.md)
- [Theme / effects map](theme-effects.md)
- [Base controls](base-controls.md)
- [Browser validation plan](../testing/browser-test-plan.md)

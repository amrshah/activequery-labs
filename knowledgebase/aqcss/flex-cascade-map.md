# AQCSS Flex Utility Cascade Map

Source: AQCSS v25.6.0, pinned upstream `ActiveQuery.css` blob SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`.
Snapshot: 2026-11-15.
Scope: `aq-flexon` display, flow, alignment, grow/shrink, distribution and gap utilities. This is a source-level cascade map. Existing browser-suite coverage is referenced where recorded; this document does not claim every selector/combination has been runtime-verified.

## Source coverage and responsive contexts

| Family | Source lines | Activation | Selector prefix |
|---|---:|---|---|
| Base | 728–811 | All widths | `aq-flexon--*` and `aq-m-flexon--*` |
| Tablet | 1068–1134 | `min-width:600px` | `aq-t-flexon--*` |
| Desktop | 1392–1458 | `min-width:993px` | `aq-d-flexon--*` |
| Screen | 1716–1782 | `min-width:1440px` | `aq-s-flexon--*` |

Responsive media queries are cumulative. At 1440 CSS px and above, the tablet, desktop and screen-prefixed classes may all apply. Within equal-specificity, equal-importance declarations, later eligible blocks win.

The base rules often pair unprefixed `aq-flexon--*` and `aq-m-flexon--*` spellings. Responsive rules use their own `aq-t-`, `aq-d-` and `aq-s-` spellings. The base and responsive families are not exact copies: they differ in selector syntax, alias behavior and the availability of small gap helpers.

## Utility behavior inventory

| Function | Tokens / aliases | Declarations |
|---|---|---|
| Establish flex container | `aq-flexon`, `aq-m-flexon`; responsive `aq-t-flexon`, `aq-d-flexon`, `aq-s-flexon` | Vendor-prefixed display fallbacks followed by `display:flex!important` |
| Flow initial | `--initial` | `flex-flow:initial!important` |
| Wrapping | `--wrap`, `--no-wrap` | `flex-wrap:wrap` / `nowrap` |
| Row flow | `--row`, `--row-reverse` | `flex-flow:row` / `flex-direction:row-reverse` |
| Row + wrap | `--row-wrap`, `--row-reverse-wrap`, `--row-wrap-reverse`, `--row-reverse-wrap-reverse` | Corresponding `flex-flow` direction/wrap combinations |
| Column flow | `--column`, `--column-reverse` | `flex-flow:column` / `flex-direction:column-reverse` |
| Column + wrap | `--column-wrap`, `--column-reverse-wrap`, `--column-wrap-reverse`, `--column-reverse-wrap-reverse` | Corresponding `flex-flow` direction/wrap combinations |
| Alignment | `--middle` / `--center`; `--center-top` / `--top-center`; `--center-bottom` / `--bottom-center`; `--left-center` / `--center-left`; `--right-center` / `--center-right`; `--left-bottom` / `--bottom-left`; `--right-bottom` / `--bottom-right`; `--left-top` / `--top-left`; `--right-top` / `--top-right` | Sets `align-items` and `justify-content`; additional `[class*=--column]:is(...)` rules swap the cross/main-axis values for column layouts |
| Stretch / no-stretch | `--stretch`, `--stretch-no`, `--no-stretch` | Intended `flex-grow` and `align-items` behavior; see the selector defect below |
| Shrink / no-shrink | `--shrink`, `--shrink-no`, `--no-shrink` | `flex-shrink:var(--aq-flexon--shrink-by,1)` / `flex-shrink:0` |
| Distribution | `--space-around`, `--space-evenly`, `--space-between` | Sets both `justify-content` and `align-content` |
| Gap | `--gap-small`, `--gap`, `--gap-large`, `--gap-xlarge` | Sets `row-gap` only |
| Explicit row gap | `--row-gap-small`, `--row-gap`, `--row-gap-large`, `--row-gap-xlarge` | Sets `row-gap`; xlarge value is invalid |
| Explicit column gap | `--column-gap-small`, `--column-gap`, `--column-gap-large`, `--column-gap-xlarge` | Sets `column-gap` |

All declarations in these utility blocks use `!important` except the `right-bottom` / `bottom-right` alignment declarations, which omit it in every family. The base display declaration and the responsive display declarations use important vendor-prefixed and standard `display:flex` values.

The base family includes small gap helpers (`0.625rem`); the tablet, desktop and screen families do not. Responsive gap families begin at the default 1rem size.

## Critical selector defect: base display list

The base display selector list is malformed at lines 728–743. The first two selectors are correctly comma-terminated:

```css
.aq-flexon,.aq-m-flexon,
```

The following paired lines omit commas between the lines. CSS therefore parses the sequence as a mixture of independent selector-list entries and descendant chains, not as a flat list of alternative classes. In practical terms, `.aq-flexon` and `.aq-m-flexon` are reliable standalone display triggers; most base modifier tokens do not independently match this display rule. The first unprefixed `.aq-flexon--initial` entry is also an independent selector, but the remaining chain should not be treated as independent class alternatives.

The responsive display lists at lines 1068–1083, 1392–1407 and 1716–1731 are comma-separated correctly. They do not share this missing-comma defect, but they contain spelling mismatches described below.

**Safe usage implication:** for baseline layout, include `.aq-flexon` or `.aq-m-flexon` on the container in addition to the desired base flow/alignment modifiers. A modifier such as `.aq-flexon--column` sets `flex-flow:column!important`, but does not reliably establish `display:flex` by itself in the base family. Responsive modifier classes have their own display selector, subject to the misspelled display-list tokens below.

## Display-token spelling mismatches

The display lists include these spellings:

- `--nowrap`
- `--column-warp-reverse`
- `--row-warp-reverse`

The flow-property rules instead declare:

- `--no-wrap`
- `--column-wrap-reverse`
- `--row-wrap-reverse`

This mismatch repeats in base and all three responsive display lists (base lines 731, 736, 742; tablet 1071, 1076, 1082; desktop 1395, 1400, 1406; screen 1719, 1724, 1730). Consequences:

- The correctly spelled `--no-wrap`, `--column-wrap-reverse` and `--row-wrap-reverse` have flow-property declarations, but are absent from the display selector list. In responsive families, these modifiers do not independently activate flex display.
- The misspelled `--nowrap`, `--column-warp-reverse` and `--row-warp-reverse` appear in display lists but have no corresponding flow-property declarations under those spellings.
- In the base family, the malformed selector list compounds the problem: most modifier tokens do not independently match the display rule even where spelling is correct.

Do not silently normalize these class names in examples or generated markup. Preserve source spellings and explain the actual matching behavior.

## Base alignment alias selector defects

The base alignment selectors at lines 766–774 omit commas between some `aq-m-` aliases and the following unprefixed alias. Example:

```css
.aq-flexon--middle,.aq-m-flexon--middle.aq-flexon--center,.aq-m-flexon--center
```

This means:

- `.aq-flexon--middle` matches by itself.
- `.aq-m-flexon--middle` does **not** match by itself; it is part of a compound selector requiring both `.aq-m-flexon--middle` and `.aq-flexon--center`.
- `.aq-m-flexon--center` matches by itself.

The same pattern repeats across the base alignment pairs (middle/center, center-top/top-center, center-bottom/bottom-center, left-center/center-left, right-center/center-right, left-bottom/bottom-left, right-bottom/bottom-right, left-top/top-left and right-top/top-right). The responsive alignment rules use comma-separated aliases and do not reproduce this exact compound-selector defect.

The base `shrink-no` rule at line 791 has a related alias issue:

```css
.aq-flexon--shrink-no,.aq-m-flexon--shrink-no.aq-flexon--no-shrink,.aq-m-flexon--no-shrink
```

The `aq-m-flexon--shrink-no` spelling is compound with `.aq-flexon--no-shrink`; the unprefixed `.aq-flexon--no-shrink` spelling is not independently listed. `.aq-m-flexon--no-shrink` is independently listed. Responsive shrink-no selectors at lines 1122, 1446 and 1770 use comma-separated spellings.

## Stretch / grow selector defects — base differs from responsive families

The source uses two different selector spellings in the base block and the responsive blocks. The distinction is material: the backslash before the asterisk in the base selector escapes the asterisk; it does **not** express the substring operator.

### Base / mobile-companion selectors

At lines 786–789, the source contains:

~~~css
:not([class\*=flexon]):is(.aq-flexon--stretch,.aq-m-flexon--stretch) {flex-grow:1!important;}
[class\*=flexon]:is(.aq-flexon--stretch,.aq-m-flexon--stretch) {align-items:stretch!important;}
:not([class\*=flexon]):is(.aq-flexon--stretch-no,.aq-m-flexon--stretch-no,.aq-flexon--no-stretch,.aq-m-flexon--no-stretch) {flex-grow:var(--aq-flexon--grow-by,1)!important;}
[class\*=flexon]:is(.aq-flexon--stretch-no,.aq-m-flexon--stretch-no,.aq-flexon--no-stretch,.aq-m-flexon--no-stretch) {align-items:normal!important;}
~~~

In [class\*=flexon], the escaped asterisk is part of the attribute name (class*), followed by an ordinary equality matcher. It is **not** [class*=flexon], the substring matcher on the class attribute.

Consequences for base tokens:
- :not([class\*=flexon]) matches ordinary elements because they do not have a class* attribute equal to flexon. The base stretch grow rule therefore matches and sets flex-grow:1!important; the stretch-no / no-stretch grow rule also matches and uses the configured value or its default of 1.
- [class\*=flexon] looks for the separate class* attribute and does not match an ordinary element whose class attribute contains aq-flexon--stretch. The base alignment rule therefore does not apply; computed align-items remains its default unless application CSS sets it.
- The same escaped-selector defect is present in both base declarations for stretch-no / no-stretch: their alignment normal rule does not match.

This replaces the earlier interpretation that the base :not([class*=flexon]) selector was impossible to satisfy. That interpretation was incorrect because it overlooked the escaped asterisk in the pinned source.

### Tablet, desktop and screen selectors

The responsive blocks at lines 1117–1120, 1441–1444 and 1765–1768 use an **unescaped** asterisk:

~~~css
:not([class*=flexon]).aq-t-flexon--stretch {flex-grow:1!important;}
[class*=flexon].aq-t-flexon--stretch {align-items:stretch!important;}
~~~

The desktop and screen families repeat the same pattern with aq-d- and aq-s- prefixes.

Here [class*=flexon] is the actual substring matcher. Since each responsive utility class itself contains flexon:
- the :not([class*=flexon]) grow selector does not match the element carrying the responsive utility;
- the positive [class*=flexon] alignment selector does match;
- responsive stretch therefore does not set flex-grow, but does set align-items:stretch;
- responsive stretch-no / no-stretch likewise do not set flex-grow, but their companion alignment rule sets align-items:normal.

### Runtime evidence

The focused CSSOM/computed-style test passed in Chromium and Firefox in run #392. It confirms:
- base .aq-flexon--stretch: the escaped grow selector matches, the escaped alignment selector does not, computed flex-grow is 1, and computed align-items is normal;
- tablet, desktop and screen stretch classes: computed flex-grow is 0 and align-items is stretch at a 1500px viewport;
- base modifier-only column does not establish flex display, while .aq-flexon plus the column modifier does;
- the malformed mobile shrink-no alias does not match independently, while mobile no-shrink does.

The tests verify the browser's parsed stylesheet and computed values, not merely the source text. Run [#394](https://github.com/amrshah/activequery-labs/actions/runs/43820114556) verifies the tablet, desktop and screen row-wrap-reverse spelling mismatch: the correctly spelled flow token sets row/wrap-reverse without enabling flex display, while the misspelled display token enables flex but leaves wrapping at nowrap. Run [#401](https://github.com/amrshah/activequery-labs/actions/runs/43822000014) verifies the right-bottom alignment cascade in base, tablet, desktop and screen families: right-bottom alone applies flex-end, but the important middle alignment wins when both classes are present because right-bottom lacks !important. Run [#403](https://github.com/amrshah/activequery-labs/actions/runs/43822473172) confirms the base mobile middle alias requires its companion base center class, while base middle, mobile center, and tablet/desktop/screen middle aliases work independently.

## Alignment cascade and axis behavior

The alignment rules set two distinct properties. For row layouts, `align-items` controls the cross axis and `justify-content` controls the main axis. For column layouts, the later, more-specific `[class*=--column]:is(...)` selectors swap the intended values.

The column override selectors have greater specificity than the simple alignment class selectors (attribute selector plus class selector inside `:is` versus one class). They also appear later and use `!important`. When a class name containing `--column` is present, the column-specific mapping wins for the properties it sets.

The `right-bottom` / `bottom-right` base and responsive declarations are the only alignment pair that omits `!important`. Other alignment helpers use important declarations. If an important alignment declaration also matches the same property, it wins regardless of the later source order of the non-important right-bottom rule. This is a source-level cascade difference; whether it causes a visible issue depends on the other classes on the element.

## Gap cascade and invalid xlarge row gap

- `--gap` is an alias for row gap only; it does not set column gap.
- `--row-gap` also sets row gap, while `--column-gap` sets column gap.
- Small is `0.625rem`, default is `1rem`, large is `1.5rem`, xlarge is `2rem` for valid declarations.
- `--gap-xlarge` and `--column-gap-xlarge` use valid `2rem`.
- `--row-gap-xlarge` uses `row-gap:2!important` without a length unit in all four families (base 810; tablet 1133; desktop 1457; screen 1781). This declaration is invalid and is discarded by the CSS parser/browser.
- If a valid `--gap-xlarge` rule also matches, its valid `row-gap:2rem!important` declaration remains effective; the invalid `--row-gap-xlarge` declaration cannot override it.

## Important declarations and cascade

- The display declarations, flow declarations, wrapping, distribution, stretch/shrink companion rules and valid gap declarations use `!important`.
- The four `right-bottom` / `bottom-right` declarations omit `!important` at lines 771, 1105, 1429 and 1753.
- Base display selector specificity varies because the malformed descendant chains include multiple class selectors; the responsive display selectors are single-class selectors.
- Most flow/alignment/gap utilities are single-class selectors (`0-1-0`). Column-specific overrides have higher specificity due to `[class*=--column]` plus the class inside `:is()`.
- When equal-specificity important declarations set the same property, later source order wins among eligible media contexts. A responsive utility only participates when its min-width media query matches.

## Source anchors

- [Base flexon family, lines 728–812](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L728-L812)
- [Tablet flexon family, lines 1068–1134](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1068-L1134)
- [Desktop flexon family, lines 1392–1458](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1392-L1458)
- [Screen flexon family, lines 1716–1782](https://github.com/ActiveQuery/CSS/blob/c03546ecd1a41d26cbbfa8f1e31d38731f77cf62/ActiveQuery.css#L1716-L1782)
- [Responsive media-query map](media-query-and-selector-map.md)
- [Spacing cascade map](spacing-cascade-map.md)
- [Facet sizing cascade map](sizing-cascade-map.md)
- [Source findings / verification queue](../testing/source-findings.md)

## Validation status

- Source line locations, selector spelling, comma placement, declarations and `!important` differences are source-confirmed against the pinned stylesheet.
- Existing Labs browser-suite documentation reports tests for flex base/modifiers, flex aliases and invalid row-gap. The malformed base display selector, all standalone responsive display token mismatches, base alignment/shrink aliases, stretch-grow impossibility and right-bottom importance difference are not evidenced here as a complete dedicated passing test matrix.
- Targeted computed-style tests should isolate each class on an ordinary element, test base modifier-only versus base-container-plus-modifier, test every responsive family at its threshold, and verify the stretch/grow and no-shrink aliases.
- This document maps flex utilities only. Positioning/affix, typography, visibility, theme/global rules, selector overlaps and pseudo-class interactions remain outside this step.

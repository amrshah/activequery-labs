# AQCSS Typography Cascade Map

Source: ActiveQuery.css v25.6.0, blob SHA c03546ecd1a41d26cbbfa8f1e31d38731f77cf62.
Evidence: selector and declaration behavior below is source-confirmed. Computed font rendering, browser font fallback and responsive visual hierarchy are not newly runtime-verified by this page.

## Scope and source locations

Typography is split across the root token block, global element/text rules, baseline text utility rules and three responsive text families.

| Area | Source lines | Scope |
|---|---:|---|
| Root typography tokens | 46–52 | Global custom properties |
| Paragraph and heading defaults | 288–296 | p, h1–h6 and heading-like class reset |
| Base text style utilities | 297–335 | Family, letter spacing, case, alignment, decoration, shadows, weights, size |
| Base/mobile size and weight family | 473–501 | aq-text and aq-m-text |
| Tablet typography | 813–842 | aq-t-text, min-width 600px |
| Desktop typography | 1138–1166 | aq-d-text, min-width 993px |
| Large-screen typography | 1462–1490 | aq-s-text, min-width 1440px |

The responsive min-width blocks are cumulative. At 1440px, tablet, desktop and large-screen typography rules all participate. Responsive text classes are not a mobile-first exclusive breakpoint system.

## Root typography tokens

The :root block declares:

| Custom property | Default | Consumption observed in source |
|---|---|---|
| --aq-font-family | initial | html/body font-family |
| --aq-font-size | 1rem | No consumption found elsewhere in ActiveQuery.css |
| --aq-font-color | var(--aq-swatch-black, black) | html/body color |
| --aq-line-height | 1.5 | html/body line-height; paragraph and heading calculations |
| --aq-paragraph-size | 1.2 | p / .aq-text--p and styled blockquote font-size |
| --aq-h-size-increment | 0.25 | h1–h6 and heading utility calculations |
| --aq-font-size-increment | 0.1 | fs-1 through fs-5 size utility calculations |

### Paragraph-size defect

The root defines --aq-paragraph-size as the unitless token 1.2, but p / .aq-text--p and the styled blockquote rule substitute it directly into font-size. Since the custom property exists and its token stream is valid, var() does not use the 1.2rem fallback; the substituted font-size: 1.2 is invalid. This means the declaration does not provide the expected 1.2rem font size unless the application overrides --aq-paragraph-size with a length.

This is a source-derived CSS value-validity conclusion, not a new browser computed-style test. See CSS-032.

## Element defaults and heading hierarchy

- p and .aq-text--p share font-size: var(--aq-paragraph-size,1.2rem), margin: 1.3em 0 0, padding: 0 and line-height: var(--aq-line-height,1.5).
- h1–h6 use a calculated size based on --aq-h-size-increment, defaulting to 0.25.
- A shared heading selector applies inherited font family, calculated line-height, font-weight:400, margin:1.3em 0 1em and heading text color.
- [class^="aq-text--h"] is a prefix attribute selector. It matches elements whose class attribute begins with that exact text, not any element that merely contains a matching class later in a multi-class string. The h1–h6 type selectors in the same list are independent alternatives.
- Heading utility classes .aq-text--h1 through .aq-text--h6 and their .aq-m-text-- equivalents are separately declared in the base/mobile block.

The default heading formula is:
- h1: 1rem + 6rem × --aq-h-size-increment
- h2: 1rem + 5rem × --aq-h-size-increment
- h3: 1rem + 4rem × --aq-h-size-increment
- h4: 1rem + 3rem × --aq-h-size-increment
- h5: 1rem + 2rem × --aq-h-size-increment
- h6: 1rem + 1rem × --aq-h-size-increment

With the root default 0.25, these resolve to 2.5rem, 2.25rem, 2rem, 1.75rem, 1.5rem and 1.25rem respectively, assuming valid computed root font sizing.

## Base text utility families

### Font sizes

The base and aq-m families include:

| Utility | Font size |
|---|---:|
| --tiny | 0.66rem |
| --small | 0.8rem |
| --medium / --normal | 1rem |
| --large | 1.2rem |
| --xlarge | 1.6rem |
| --xxlarge | 2.4rem |
| --xxxlarge | 3.2rem |
| --jumbo | 4.2rem |

The --fs-1 through --fs-5 family calculates from 1rem plus 5, 4, 3, 2 or 1 rem multiplied by --aq-font-size-increment (default 0.1). --fs-6 is fixed at 1rem.

There are earlier duplicate declarations for .aq-text--fs-1 through .aq-text--fs-5 at lines 331–335 that use --aq-h-size-increment. The later base/mobile declarations at lines 487–491 repeat the same .aq-text selectors and use --aq-font-size-increment. With equal specificity, the later declarations win for the base selectors. The earlier declarations are therefore not the effective final values when the later block is present.

### Font weights

The base aq-text family offers numeric weights 100 through 900 using --fw-* tokens, with all these declarations marked !important. Named aliases include thinnest, thinner, thin, bold-no / no-bold, thick, bold, bolder / xbold, and xx-bolder-style aliases. The aq-m-text, aq-t-text, aq-d-text and aq-s-text responsive families provide numeric --fw-100 through --fw-900 declarations, also !important.

**900-weight alias defect:** the base selector list has .aq-text--fw-900 as a working independent alternative, but .aq-text--jumbo-bold.aq-text--xxxbold and [aq-text-jumbo-bold][aq-text-xxxbold] are compound selectors, not comma-separated aliases. Each compound requires both class tokens or both attributes on the same element. A single jumbo-bold or xxxbold token does not independently match this rule. See CSS-033.

### Alignment, case, decoration and effects

These utilities are in the base global text block; matching responsive aq-t-text / aq-d-text / aq-s-text variants were not found in the inspected stylesheet.

| Family | Tokens | Declaration |
|---|---|---|
| Alignment | --left, --center, --full / --justify, --right | text-align; all !important |
| Case | --case-upper, --case-lower, --case-normal | text-transform |
| Capitalization | .aq-case-capital | text-transform:capitalize |
| Decoration | --underline | text-decoration:underline |
| Hover decoration/weight | --bold-hover, --underline-hover | hover-only; !important |
| Letter spacing | --condensed, --spread, --spread-no / --no-spread | letter-spacing |
| Shadows | --shadow, --shadow-white, --shadow-white-spread, --shadow-spread | text-shadow |

The alignment declarations are important; case, capitalization, decoration, letter spacing and text-shadow declarations are not. When an important alignment utility competes with an ordinary application rule, the important utility wins unless the competing declaration is also important and has a stronger or later-matching cascade position.

The --san-serif utility assigns font-family: san-serif. That is not the CSS generic family keyword sans-serif; it is parsed as a family name rather than selecting the generic sans-serif family. The spelling is source-confirmed; actual fallback depends on installed fonts and browser environment.

## Responsive typography

| Prefix | Media activation | Heading classes | Size scale | Numeric weight scale |
|---|---|---|---|---|
| aq-m-text | Baseline | h1–h6 | tiny through jumbo; fs-1–fs-6 | fw-100–fw-900 |
| aq-t-text | min-width:600px | h1–h6 | tiny through jumbo; fs-1–fs-6 | fw-100–fw-900 |
| aq-d-text | min-width:993px | h1–h6 | tiny through jumbo; fs-1–fs-6 | fw-100–fw-900 |
| aq-s-text | min-width:1440px | intended h1–h6 | tiny through jumbo; intended fs-1–fs-6 | fw-100–fw-900 |

The tablet and desktop families use lowercase prefix spelling consistently. The large-screen family has uppercase S in the h4, h5 and h6 selectors and in fs-2 and fs-3. Class names are case-sensitive, so the documented lowercase aq-s-text spellings for those five tokens do not match those source selectors. h1–h3 and fs-1, fs-4–fs-6 use lowercase spelling. This is also tracked by CSS-004.

Responsive text size declarations are generally ordinary declarations, not !important. Their equal-specificity selectors can override earlier base declarations by source order when both classes are present and the corresponding media query matches. Numeric responsive weight declarations use !important.

## Cascade and composition rules

- A responsive class is additive: it does not disable the baseline class. At a viewport where multiple min-width queries match, all corresponding declarations participate.
- If base and responsive font-size utilities set the same property with equal specificity, the later matching responsive rule wins.
- Weight utilities use !important; a normal-weight declaration elsewhere does not override them.
- Alignment utilities use !important; ordinary text-align rules elsewhere do not override them.
- Case, decoration, letter spacing and shadow utilities are not important and can be overridden by later or more specific rules.
- Font-size utilities are not important. An application rule with greater specificity, or a later equal-specificity rule, can override them.
- Applying multiple classes that set the same property is not a semantic combination; it is a normal CSS cascade conflict. Use one size/weight/alignment utility per property unless the intended winner is deliberate.

## Practical patterns

~~~html
<p class="aq-text--large">Base text size utility</p>

<h2 class="aq-text--h2 aq-d-text--h3">Desktop heading scale override</h2>

<p class="aq-text--left aq-text--case-upper aq-text--bold">Aligned, uppercase, bold text</p>

<p class="aq-t-text--small aq-d-text--large">Responsive size changes at 600px and 993px</p>
~~~

The paragraph example using default --aq-paragraph-size does not guarantee 1.2rem; override the root token with a valid length when that size is required, for example --aq-paragraph-size:1.2rem.

## Validation status

- **Source-confirmed:** root typography tokens; global paragraph/heading rules; base font-family, spacing, case, alignment, decoration, shadow, weight and size utilities; responsive size/weight families; large-screen uppercase-S selector spellings.
- **Derived:** default paragraph font-size invalidity follows from substitution of the unitless root token into font-size; responsive precedence follows from media matching, specificity and source order; the 900-weight alias compound-selector behavior follows from CSS selector grammar.
- **Not runtime-verified here:** computed paragraph font size under default and overridden tokens; visual heading hierarchy across viewport sizes; font fallback for san-serif; computed weight alias behavior; hover states and multi-utility conflicts.
- **No upstream source changes:** this is a knowledgebase-only mapping.

## Source anchors

- Root tokens: ActiveQuery.css:46–52.
- Paragraph and heading defaults: ActiveQuery.css:288–296.
- Base typography utilities: ActiveQuery.css:297–335.
- Base/mobile size and weight utilities: ActiveQuery.css:473–501.
- Tablet typography: ActiveQuery.css:813–842.
- Desktop typography: ActiveQuery.css:1138–1166.
- Large-screen typography: ActiveQuery.css:1462–1490.
- Related source findings: CSS-004, CSS-016, CSS-032 and CSS-033 in testing/source-findings.md.

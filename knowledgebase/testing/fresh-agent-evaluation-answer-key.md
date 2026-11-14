# Fresh-Agent Evaluation — Answer Key and Scoring Rubric

Status: **prepared; candidate evaluation not yet run**.

Score each item 0 or 1. Award 1 only when the answer states the required behavior accurately and cites relevant knowledgebase evidence. A correct guess without evidence is not sufficient. Mark any contradiction of a known defect as a critical error.

## Answer key

| # | Required answer / scoring target | Knowledgebase evidence | Critical |
|---:|---|---|:---:|
| 1 | Tablet starts at 600px, desktop at 993px, screen at 1440px; min-width blocks are cumulative, not exclusive. | `aqcss/media-query-and-selector-map.md`, `aqcss/tokens-and-responsive.md` | |
| 2 | Three range-hide media preludes are malformed and ignored by Chromium/Firefox; helpers remain visible in their intended ranges. The 1440px simple screen helper works. | `aqcss/media-query-and-selector-map.md`, `aqcss/visibility-interaction-cascade-map.md`, `testing/browser-test-plan.md` | **Yes** |
| 3 | Responsive right 1rem selectors are duplicated/mis-specified so right helper sets both left and right; corresponding responsive left helper is missing. Do not generalize to all sizes or base classes. | `aqcss/spacing-cascade-map.md`, `aqcss/cascade-and-specificity.md` | **Yes** |
| 4 | `facet--third` is 3.33333% width, not 33.33333%; it is roughly one tenth of the intended third. | `aqcss/sizing-cascade-map.md`, `testing/runtime-validation-matrix.md` | **Yes** |
| 5 | `facet--rest` only sets `overflow:hidden`; it does not calculate remaining dimensions. | `aqcss/sizing-cascade-map.md` | |
| 6 | Base `.aq-flexon` and `.aq-m-flexon` are reliable display triggers; modifier-only classes do not establish flex display. | `aqcss/flex-cascade-map.md`, `testing/browser-test-plan.md` | |
| 7 | Base alignment aliases contain missing commas/compound selector requirements; e.g. mobile `aq-m-flexon--middle` needs the companion base center class to match the compound selector. | `aqcss/flex-cascade-map.md` | |
| 8 | Intended grow selectors combine `:not([class*=flexon])` with a utility class containing `flexon`, making the selector impossible to satisfy. Base shrink-no alias is malformed; right-bottom declarations omit `!important`. | `aqcss/flex-cascade-map.md`, `testing/source-findings.md` | **Yes** |
| 9 | Fixed/sticky mode uses `!important` and wins over the top helper's normal `position:absolute`; top helper still supplies `top:0`. Sticky requires a real scroll container/inset; do not infer full sticky behavior from computed style alone. | `aqcss/positioning-cascade-map.md` | |
| 10 | `--aq-paragraph-size` is unitless `1.2`, invalid as font-size; tested paragraph inherits approximately root font size. | `aqcss/typography-cascade-map.md` | |
| 11 | Some screen selectors use uppercase `aq-S-` while family convention/lowercase classes use `aq-s-`; examples include h4–h6 and fs-2/fs-3. Case mismatch prevents lowercase spellings from matching those rules. | `aqcss/typography-cascade-map.md` | |
| 12 | Broad reset removes visible focus outline; disabled helper styles descendants rather than applying native disabled behavior to the target. `.disabled` is not equivalent to `disabled` attribute or semantics. | `aqcss/base-controls.md`, `aqcss/visibility-interaction-cascade-map.md` | **Yes** |
| 13 | Tooltip and dropdown are hover-driven; focus alone does not reveal tooltip/hover dropdown, and click-named dropdown class has no click-to-open behavior. | `aqcss/visibility-interaction-cascade-map.md`, `testing/browser-test-plan.md` | |
| 14 | No `prefers-reduced-motion` override; `.input-animate` retained a 0.4s ease-in-out transition under reduced-motion emulation. | `aqcss/base-controls.md`, `aqcss/theme-effects.md`, `testing/browser-test-plan.md` | |
| 15 | Border uses `rgb(var(--aq-swatch-secondary))` while default token is a hex value; that legacy channel syntax is invalid with the hex default, so border shorthand is discarded. Supplying comma-separated channels restores it. | `aqcss/theme-effects.md`, `testing/browser-test-plan.md` | **Yes** |
| 16 | Global image rule sets `max-width:100%; height:auto`; it can cap a `100vw` width to the containing block. Use bounding rect to discuss actual geometry, not just declared width. | `aqcss/base-controls.md`, `aqcss/sizing-cascade-map.md`, `testing/aqcss-composition-test-plan.md` | |
| 17 | `AQ.DOM` returns null for zero matches, an Element for one, and NodeList for multiple. | `aqjs/api-signature-reference.md`, `aqjs/api-inventory.md` | |
| 18 | Element/Document nestedDOM returns the original context on no match; NodeList context flattens descendants and returns original NodeList, one Element, or Array depending on results. | `aqjs/api-signature-reference.md`, `aqjs/api-inventory.md` | |
| 19 | Truthy value assigned only when native `value` exists; otherwise/falsy input writes empty string. Generic Element receives a created/assigned `value=""` property. | `aqjs/api-signature-reference.md`, `testing/runtime-validation-matrix.md` | **Yes** |
| 20 | NodeList get/set content helpers listed as stubs mostly return same collection without mutation; `on` returns same collection for valid args (including empty valid collection) and undefined for invalid/empty guard inputs. | `aqjs/api-signature-reference.md`, `aqjs/nodelist-edge-case-audit.md`, `aqjs/api-contract-closure-matrix.md` | **Yes** |
| 21 | `getIndex` "=" assigns to object property in predicate, mutating first visited item and typically returning index 0; `setSort` comparator assigns undeclared variables and throws in strict module code. | `aqjs/api-signature-reference.md`, `testing/runtime-validation-matrix.md` | **Yes** |
| 22 | Arrays become thenables; Promise resolver calls Array.then with resolve, which attempts to resolve the same Array recursively. Direct callback behavior is tested; Promise assimilation deliberately remains untested pending safe isolation. | `aqjs/api-signature-reference.md`, `aqjs/api-contract-closure-matrix.md` | **Yes** |
| 23 | String input invokes dynamic import and rejection propagates; non-string resolves to instance. Arbitrary/untrusted specifiers are not allowlisted and can load modules; caller must enforce policy. | `aqjs/api-signature-reference.md`, `aqjs/api-contract-closure-matrix.md` | **Yes** |
| 24 | `isNaS` is always true due its regex/source behavior; `isNaF` is not a reliable negative callable check and returns false for arrow functions and strings containing “function”. | `aqjs/type-predicates-and-guards.md`, `testing/source-findings.md` | **Yes** |

## Scoring

- 1 point per item; maximum 24.
- Pass: 22 or more points AND zero critical errors.
- Critical error: answer recommends a known-broken utility as reliable; confuses source-derived claims with browser-verified behavior; reverses a documented behavior; or invents unsupported semantics.
- Record candidate model/agent, date, exact prompt pack revision, answers, score, critical errors and evaluator notes.
- A passing score closes only the retrieval/answering portion of Gate D. It does not close the implementation exercise or Gate E.

## Administration status

Not run. A separate fresh agent must receive only `fresh-agent-evaluation-prompts.md` and the knowledgebase, without this answer key or prior ActiveQuery conversation context.

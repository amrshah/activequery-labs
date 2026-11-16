# ActiveQuery Runtime Validation Matrix

Status snapshot: 2026-11-16.
Run [#413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) is the latest completed browser run: **281 passed, 0 failed, 1 skipped** across Chromium and Firefox (141 authored tests in two browser projects; the one skip is Firefox's unsupported-equivalent mobile hardware emulation case). It closes source/minified coverage for Element setText/setHtml falsy branches, including assignment return values and outerHTML host removal. Broader API, accessibility and compatibility coverage remains incomplete. **Gate C is partially satisfied, not passed in full.**

Legend:
- **Inspected** — source behavior reviewed.
- **Test authored** — a reproducible test exists in the repository.
- **Pending run** — test has not been observed passing in a real browser.
- **Pending authoring** — additional test coverage is still required.

## Latest AQJS contract coverage — verified through run #383

Six additional tests were added for Element `setValue`, `setChild`, `then`/`fax`; NodeList no-op stubs and `on`; and Array `getCount` default-operator edge cases. The first execution exposed incorrect expectations in the tests, not framework regressions. Source review and subsequent passing browser assertions established: `isNaF` matches arrow-function source and strings containing `function`; `Element.setValue` writes an empty `value` property even on a generic Element when the supplied value is falsy or the Element lacks a native value property; and `NodeList.on` returns the same empty collection when called with valid arguments. Workflow [#325](https://github.com/amrshah/activequery-labs/actions/runs/43644825180) passed all 174 browser cases. A further source/minified fixture is authored in commit `5769645f9aa327c627ce58f8dda9a5b40934b8db` and awaits workflow #325.

Run #383 adds Element `setChild` DocumentFragment and partial-failure behavior, Element `setValue` native form-control behavior (text input, checkbox `.value`, select and textarea), and a source/minified parity fixture for those contracts. The tests passed in Chromium and Firefox; the full run passed 251 browser cases with one documented Firefox mobile-emulation skip. Run #340 adds isolated early-registration evidence: `ready` (DOMContentLoaded), `init` (load), and `run` (pageshow) each fired once; the constructor's `readystatechange=complete` handler invoked the queued `initlog` callback once. The same timing fixture passed against source and minified builds. Run #339's parity fixture initially failed from a test-harness variable-name typo (`path` versus `modulePath`); the harness was corrected and run #340 passed. This was not an upstream behavior failure. Run #347 added coverage for `offline`, `online`, and `close` event mappings, unknown lifecycle event names, and NodeList index numeric-string/out-of-range/empty-collection behavior. Run #348 added source/minified parity fixtures for Array query helpers and Element/NodeList bulk DOM mutations; all 194 browser cases passed.

## AQJS core and lifecycle

| API / behavior | Source review | Test coverage | Current status |
|---|---|---|---|
| Constructor default argument | Inspected: null triggers alias and Object/Element/NodeList prototype writes | Default and empty-string constructor tests | Passed in run #313 |
| Import-time prototype extensions | Inspected: native prototypes augmented; String.trim replaced; native writable/configurable descriptor flags are retained | Native trim identity/descriptor test | Passed in run #313 |
| `DOM(selector)` | Inspected: null / Element / NodeList polymorphic result | Zero, one, many matches | Passed in run #313 |
| `nestedDOM(selector)` Element | Inspected | Single descendant and no-match context | Passed in run #313 |
| `nestedDOM(selector)` NodeList | Inspected | Flattened descendants | Passed in run #313 |
| `nestedDOM(selector)` Array | Inspected: Array fails accepted-type guard and is returned unchanged | Explicit unchanged-array test | Passed in run #313 |
| `nestedDOM(selector)` Document | Inspected | Zero/one/many and no-match context test | Passed in run #313 |
| `nestedDOM(selector)` HTMLCollection | Inspected: returns unchanged | Explicit unchanged-result test | Passed in run #313 |
| `extend(...args)` | Inspected; argument validation and custom-element branches mapped | Valid autonomous element and invalid no-hyphen name tests | Passed in run #313 |
| `isEmpty` | Inspected: zero/false/null/empty string and recursive array semantics | Representative cases | Passed in run #313 |
| `exit` | Inspected as no-op returning this | Static and instance receiver identity | Passed in run #313 |
| `keepOn` | Inspected: returns input only for empty length and non-debug | Empty/non-empty/debug cases | Passed in run #313 |
| `defer` | Inspected: spreads input, pops delay, passes remaining array to setTimeout; array is string-coerced by browser timer API and callback is not invoked | Non-throwing timer-handle and callback non-execution tests | Both timer-handle and callback non-execution tests passed in run #313 |
| `getPlugin` | Inspected: dynamic import by string | No allowlist/security test | Pending authoring |
| Lifecycle `on` | Inspected: fixed event names, no late replay | Late ready/init test | Passed in run #313 |
| Constructor `initlog` | Inspected: no readyState check | Late callback test | Passed in run #313 |

## AQJS type predicates

| Method(s) | Source review | Test coverage | Current status |
|---|---|---|---|
| `isArray`, `isNaA`, `isArraySet`, `isNaAS`, `isObjectMap`, `isNaOM` | Inspected | Representative positive/negative checks | Partial; passed in run #313; truth table not exhaustive |
| `isArrayLike`, `isNaAL` | Inspected: unqualified helper references | Explicit ReferenceError tests | Passed in run #313 |
| `isString`, `isNaS` | Inspected: `isNaS` expression is always true for primitive strings, boxed strings and non-strings | Primitive/boxed string test | Passed in run #324; exhaustive truth table remains pending |
| `isObject`, `isNaO`, `isObjectLiteral` | Inspected; null throws before guard | Plain-object checks and null error test | Partial; passed in run #313; cross-realm and other edge cases remain |
| `isNaM`, `isSet`, `isNaOL`, `isObjectLike` | Inspected; naming/undefined helper issues | Map, array and objectLike checks | Partial; selected cases passed in run #313; `isNaOL` and full input matrix remain |
| `isFunction`, `isNaF`, `isClass`, `isNaC` | Inspected heuristic string checks; `isNaF` false-positive for strings containing `function` and arrow functions | Named function, class, arrow and string cases | Selected cases passed in run #324; exhaustive input matrix remains pending |
| `isNodeList`, `isNaNL` | Inspected: references undefined `x` | Both positive and negative methods tested for ReferenceError | Passed in run #313 |
| `isArgument`, `isJSON` | Inspected: type/regex behavior, not JSON parsing | Empty/null argument and arbitrary string JSON tests | Passed in run #313 |

## AQJS Array/Object/primitive extensions

| Target | Methods | Source review | Test coverage | Current status |
|---|---|---|---|---|
| Array | `i`, `then`, `getIndex`, `getCount`, `setSort`, `setItem`, `has`, `getIndexs` | All inventoried; multiple defects identified; `then` makes Arrays thenable and can interfere with Promise-based consumers | i, getIndex, getCount default/operator branches, setSort, both setItem branches, has, getIndexs, then | Partial; selected contracts passed in runs #324 and #327; Array.i TypeError, Array.setSort strict-module ReferenceError and Array.setItem truthy/falsy branches have source/minified parity in runs #397/#399; Promise resolver assimilation remains isolated and bounded, while broader operator/edge coverage remains pending |
| Object | `setValues`, `hasValues` | Missing static predicate call | Both error cases and source/minified parity | Both TypeError cases passed in run #313; source/minified parity passed in run #397 |
| Number | `trim` | Inspected | Primitive trim test | Passed in run #313 |
| String | `trim` | Native override and Unicode mismatch identified | Descriptor and U+FEFF/U+200B comparisons | Passed in run #313 |
| Function | `then` | Inspected | Callback test | Passed in run #313 |

## AQJS Element/NodeList/Document/Window

| Target | Methods / behavior | Source review | Test coverage | Current status |
|---|---|---|---|---|
| Element | `parent`, `name` | Inspected | Parent relationship and nodeName | Passed in run #313 |
| Element | Attributes/styles | Inspected; falsy-value and simple parser limits | Pair early-stop, attribute names/removal, inline style parsing/readback | Partial; selected contracts passed in run #313 |
| Element | Classes | Inspected | Basic set/get/remove plus NodeList bulk class mutators | Partial; selected contracts passed in run #313 |
| Element | `i`, `setChild`, `siblings` | Inspected; sibling default bug | sibling next/prev/default; setChild single/array/empty, DocumentFragment and invalid member after a valid member | Partial; setChild contracts passed in runs #324 and #383, including source/minified parity; `i` remains untested |
| Element | `setAdjacent`, `setHtml`, `getHtml`, `setContent` | Inspected; guards and DOM insertion semantics | Guarded setAdjacent/setHtml, getHtml modes, array setContent | setHtml truthy no-op, falsy innerHTML assignment, assigned-value return semantics and outerHTML host removal passed in source/minified parity in runs #399 and #413; remaining getHtml/setAdjacent modes still need broader matrix |
| Element | `setContent` | Inspected: always clears innerHTML, appends Node/Array; empty Array clears; invalid values throw after clearing | Single Node, array, empty array, DocumentFragment, invalid array member and invalid string | All listed replacement/failure cases passed in Chromium/Firefox and source/minified parity in run #395 |\n| Element | `setHtml` | Inspected: truthy input ignored; falsy branch assigns inner/outer HTML and returns assignment result | Truthy input ignored, empty/zero/false/null innerHTML values, outerHTML host removal and return value | All listed cases passed in source/minified parity in runs #399 and #413 |\n| Element | `siblings` | Inspected: next/prev supported; default references undeclared target | next, prev and default error path | All three cases passed in source/minified parity in run #399 |
| Element | `setText`, `getText`, `setValue`, `getValue` | Inspected; falsy and inverted mode behavior; setValue assigns empty string on falsy input and on generic Elements | setText empty/zero/false/null no-op; getValue default/mode/no-arg; setValue truthy/falsy/generic Element and native control matrix | setText falsy no-op and receiver identity passed in source/minified parity in run #413; selected getValue/setValue contracts passed in runs #324, #383 and #399; broader getValue input matrix remains pending |
| Element | `then`, `fax`, `on` | Inspected | callback result, absent callback, FORM/non-FORM fax, event listener | Selected contracts passed in run #324; form semantics remain unsupported/incomplete |
| Element | `sancha` | Inspected; HTML injection and undeclared identifiers | Static success and data-mode ReferenceError | Passed in run #313 |
| Element | `sift` | Inspected: truthy selector early return | Explicit no-handler test | Passed in run #313 |
| Element | `watch` | Inspected; callback `this` failure and missing observer return | Mutation test captures TypeError and missing user callback | Passed in run #313 |
| NodeList | attributes/styles/classes/value/on | Inspected; some working loops, some stubs | Bulk attributes/styles/classes, setValue across input/checkbox/select/textarea, generic-element exclusion, empty collection, stubs and valid/invalid/empty-list `on` | Selected contracts passed in runs #324 and #392; broader collection edge cases remain pending |
| NodeList | no-op stubs | Inspected: getStyles/getClasses/getHtml/setText/etc. | All identified no-op stubs invoked with representative arguments; no mutation and return shape asserted | Identified stub set passed in run #324; broader argument combinations remain pending |
| Document/Window | `on` | Inspected | Native custom event listeners; invalid event/callback arguments and receiver identity | Valid event dispatch passed in run #313; invalid-argument receiver identity passed in run #327 |

## AQCSS validation

| Area | Source review | Test coverage | Current status |
|---|---|---|---|
| Rule and selector inventory | Brace-aware index committed; PostCSS AST generator committed | AST generation and source hash assertions | Passed in run #313 |
| AQCSS source/minified parity | Lexical comparison indicates parity | PostCSS AST comparison | Passed in run #313 |\n| AQJS source/minified behavior parity | AST structure parity plus selected runtime behavior fixtures | Core DOM, getPlugin imports/rejections, Function/Element/NodeList then, defer, Element value/child/then/setContent/setText/setHtml/getValue/siblings, DocumentFragment, NodeList events/setValue, Array query helpers/sort/index/setItem, Object value-helper failures, predicate edge cases, Document/Window events, early lifecycle and constructor `initlog`, Element/NodeList bulk mutations | Selected fixtures passed in runs #325, #327, #340, #348, #383, #392, #395, #397, #399, #405 and #409; complete method-level semantic parity remains pending |
| AQCSS flex selector cascade | Source-derived base/responsive selector defects, token spelling, alias composition and importance differences | Base vs responsive stretch CSSOM behavior, tablet/desktop/screen wrap-reverse mismatch, right-bottom vs important middle alignment, and mobile middle alias compound-selector behavior | Passed in Chromium and Firefox in runs #392, #394, #401 and #403 |
| Cross-family composition | Source-derived border, facet, spacing, affix, flex, swatch, filter, opacity, image and responsive precedence combinations | AQX-001–008, AQX-010–019 passed in run #365; AQX-009 computed sticky/top cascade passed. Run #392 additionally verifies base vs responsive flex stretch selectors through CSSOM and computed styles. An experimental nested-scroll movement test failed in both engines in run #380 and was withdrawn without weakening assertions | 18 AQX cases plus the focused flex selector test pass; actual sticky movement remains unverified |
| Clean-room portal | Responsive field guide, editable HTML/CSS/JS, isolated preview, AQJS event helper and narrow viewport layout | Four Playwright tests passed in run #369; preview sandbox allows scripts only and omits same-origin access | Passed in CI; public deployment withheld pending OSL-3.0 review |
| Breakpoints and responsive variants | Inspected: mobile/tablet/desktop hide range queries are malformed and ignored by Chromium/Firefox; tablet/desktop/large typography prefixes activate at their min-width thresholds | 599/600/601, 601/992, 993/1439 and 1440 computed-style tests | All tested breakpoint and hide-helper behavior passed in run #313; short-landscape and touch/hybrid behavior remain untested |
| Typography and unit tokens | Multiple source defects documented | Paragraph and large-screen case mismatch tests | Passed in run #313 |
| Layout/flex/spacing | Multiple source defects documented | Facet, row-gap, flex base, spacing aliases and responsive alignment tests | Passed in run #313 |
| Swatches and color functions | Token duplication and invalid rgb() usage documented | Base border token and hover alpha tests | Partial; selected cases passed in run #313; more theme/swatch coverage remains |
| Controls/focus/tooltip/dropdown | Source inspected | Focus outline, hover-only tooltip, hover/focus/click dropdown tests | Partial; keyboard/pointer tests passed in run #313; touch behavior remains untested |
| Reduced motion/dark mode | No built-in reduced-motion override or dark-mode query found in pinned stylesheet | Reduced-motion emulation test; dark-mode source absence review | Reduced-motion gap passed in run #313; dark mode remains an application-level feature |

## Proposed AQCSS composition coverage

The [AQCSS focused composition test plan](aqcss-composition-test-plan.md) specifies additional cross-family and responsive tests. These are pending authoring and must not be counted as runtime coverage until implemented and run. Run #327 is the latest passing baseline; run #313 remains the earlier AQCSS coverage baseline.

## Execution and acceptance

1. Continue adding source-grounded tests for untested API branches, accessibility and compatibility.
2. Inspect any failures without modifying upstream source or weakening source-grounded assertions.
3. Retain test logs, browser versions and generated AST catalog artifacts for every accepted run.
4. Keep the mastery gate open until coverage and independent-agent evaluation are complete.


## Latest confirmed execution record — run #369

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #369](https://github.com/amrshah/activequery-labs/actions/runs/43649159878) |
| Commit | `2139a2dd8a45103506e1bb5deb4f494bd6c32574` |
| Execution | 240 passed, 0 failed, 0 skipped; 120 authored tests across Chromium and Firefox |

## Previous execution record — run #365

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #365](https://github.com/amrshah/activequery-labs/actions/runs/43647892108) |
| Commit | `3d7077d79403d0d693e63198857ccad34e8dcc12` |
| Execution | 232 passed, 0 failed, 0 skipped; 116 authored tests across Chromium and Firefox |

## Previous execution record — run #348

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #348](https://github.com/amrshah/activequery-labs/actions/runs/43646121898) |
| Commit | `d2c9bd26badffc96feb009aec9bbe7c9e222ea1e` |
| Execution | 194 passed, 0 failed, 0 skipped; 97 authored tests across Chromium and Firefox |

## Previous execution record — run #340

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #340](https://github.com/amrshah/activequery-labs/actions/runs/43645942215) |
| Commit | `790b5b9563f288a592a49298b41f2af8f25975d4` |
| Execution | 186 passed, 0 failed, 0 skipped; 93 authored tests across Chromium and Firefox |

## Previous execution record — run #327

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #327](https://github.com/amrshah/activequery-labs/actions/runs/43645400008) |
| Commit | `c9b740941c063ecb0813bda7ff4c3ca49e18b22d` |
| Execution | 182 passed, 0 failed, 0 skipped; 91 authored tests across Chromium and Firefox |

## Previous execution record — run #325

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #324](https://github.com/amrshah/activequery-labs/actions/runs/43644712359) |
| Commit | `5769645f9aa327c627ce58f8dda9a5b40934b8db` |
| Execution | 176 passed, 0 failed, 0 skipped; 88 authored tests across Chromium and Firefox |

## Previous execution record — run #324

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #324](https://github.com/amrshah/activequery-labs/actions/runs/43644712359) |
| Commit | `c5f52071c476289a18f675e678fd0a6eaea9cc39` |
| Execution | 174 passed, 0 failed, 0 skipped; 87 authored tests across Chromium and Firefox |

## Historical execution record — run #313

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #313](https://github.com/amrshah/activequery-labs/actions/runs/43639357350) |
| Commit | `0f1a71a2d9994ba286c51a26c038892c99806d55` |
| Runner | Ubuntu 24.04.5 LTS (`ubuntu-24.04`) |
| Node / npm | Node 22.23.4 / npm 10.9.9 |
| Playwright | `@playwright/test` 1.56.1 |
| Browser binaries | Chromium 141.0.7390.37 (Playwright build v1194); Firefox 142.0.1 (build v1495) |
| Execution | 158 passed, 0 failed, 0 skipped; 31.4 seconds; 2 workers |
| Source integrity | Pinned AQJS/AQCSS source and minified assets fetched and hash-verified before catalog generation and tests |
| Artifact | Generated AQCSS/AQJS AST catalogs uploaded successfully by the workflow |

The historical run validates the 79 authored tests in two browser projects. It does not prove complete framework mastery, exhaustive API coverage, accessibility, touch behavior, WebKit compatibility or the clean-room portal rebuild.


## Sticky movement investigation

Run [#380](https://github.com/amrshah/activequery-labs/actions/runs/43762655505) completed with 245 passed, 2 failed and 1 skipped. Both failures were the experimental AQX-009 nested-scroll movement assertion (Chromium and Firefox); computed `position:sticky` and `top:0` continued to pass. The movement test was removed because the fixture/scroll-container interaction was not yet isolated well enough to support a trustworthy conclusion. This is an unresolved runtime gap, not evidence that the upstream utility is broken. Do not claim actual sticky movement is verified.


## Latest confirmed execution record — run #383

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #383](https://github.com/amrshah/activequery-labs/actions/runs/43817367901) |
| Commit | `f5789517a030fc6d0da78186b18fa7637807a4e4` |
| Execution | 251 passed, 0 failed, 1 skipped; 126 authored tests across Chromium and Firefox |
| New AQJS coverage | Element DocumentFragment/partial-append behavior; text input, checkbox `.value`, select and textarea `setValue`; source/minified parity for both |


## Latest confirmed execution record — run #392

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #392](https://github.com/amrshah/activequery-labs/actions/runs/43819572529) |
| Commit | `baf5ca668a177c041d028efc9f4b982d62804ed1` |
| Execution | 257 passed, 0 failed, 1 skipped; 129 authored tests across Chromium and Firefox |
| New AQCSS evidence | CSSOM confirms base flex stretch selectors contain an escaped asterisk and behave differently from the unescaped responsive selectors; runtime computed-style checks passed in both engines |
| New AQJS evidence | NodeList setValue across input, checkbox .value, select and textarea; generic-element exclusion and empty-collection receiver identity; source/minified parity |


## Latest confirmed execution record — run #395

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #395](https://github.com/amrshah/activequery-labs/actions/runs/43820353410) |
| Commit | `a811ee9d4b9e7621859f1284f4c36b911199e6a6` |
| Execution | 263 passed, 0 failed, 1 skipped; 132 authored tests across Chromium and Firefox |
| New AQJS coverage | Element setContent single Node, Array, empty Array, DocumentFragment, invalid string and partial-append failure behavior; source/minified parity |


## Latest confirmed execution record — run #397

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) |
| Commit | `b2aae452e21f4f34e2351ffacb26d95f36d90f74` |
| Execution | 265 passed, 0 failed, 1 skipped; 133 authored tests across Chromium and Firefox |
| New parity coverage | Array.setSort ReferenceError, Array.i TypeError, Object.setValues/hasValues TypeErrors, isNaS/isNaF outputs matched between source and minified builds |


## Latest confirmed execution record — run #399

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #399](https://github.com/amrshah/activequery-labs/actions/runs/43821478858) |
| Commit | `09f15af9a051948f26a17824f9dd68a84271d167` |
| Execution | 267 passed, 0 failed, 1 skipped; 134 authored tests across Chromium and Firefox |
| New parity coverage | Array.setItem truthy/falsy branches; Element setText empty-string behavior, setHtml truthy no-op, getValue modes, and siblings next/prev/default error behavior |


## Latest confirmed execution record — run #401

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #401](https://github.com/amrshah/activequery-labs/actions/runs/43822000014) |
| Commit | `4c130c3069117ffb2d2bf3066e08d5425d33bea4` |
| Execution | 269 passed, 0 failed, 1 skipped; 135 authored tests across Chromium and Firefox |
| New AQCSS evidence | Right-bottom alignment applies alone but loses to the important middle alignment in base, tablet, desktop and screen families |


## Latest confirmed execution record — run #403

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #403](https://github.com/amrshah/activequery-labs/actions/runs/43822473172) |
| Commit | `30f998b2c303e8ca1351d72ac0c65e4f9fc51558` |
| Execution | 271 passed, 0 failed, 1 skipped; 136 authored tests across Chromium and Firefox |
| New AQCSS evidence | Base mobile middle alias compound-selector requirement vs independently working base/mobile-center and tablet/desktop/screen-middle aliases |


## Latest confirmed execution record — run #405

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #405](https://github.com/amrshah/activequery-labs/actions/runs/43822976254) |
| Commit | `c8c29bf55d67ee5a345f068074cfddc5f404aca6` |
| Execution | 273 passed, 0 failed, 1 skipped; 137 authored tests across Chromium and Firefox |
| New parity coverage | getPlugin approved fixture import, non-string fallback and rejected dynamic import behavior |


## Latest confirmed execution record — run #397

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) |
| Commit | `b2aae452e21f4f34e2351ffacb26d95f36d90f74` |
| Execution | 265 passed, 0 failed, 1 skipped; 133 authored tests across Chromium and Firefox |
| New AQJS parity | Array.setSort ReferenceError, Array.i TypeError, Object.setValues/hasValues TypeErrors and selected isNaS/isNaF predicate outcomes match between source and minified builds |


## Latest confirmed execution record — run #408

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #408](https://github.com/amrshah/activequery-labs/actions/runs/43823338803) |
| Commit | `cd84e63b7604427e75c66567bac02af0b654d5ef` |
| Execution | 275 passed, 0 failed, 1 skipped; 138 authored tests across Chromium and Firefox |
| New AQJS parity | Array.getIndex equals-branch assignment behavior and Array.setItem truthy index/value no-op behavior match between source and minified builds |


## Latest confirmed execution record — run #409

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #409](https://github.com/amrshah/activequery-labs/actions/runs/43823498069) |
| Commit | `a09839f7576b1db7d724f76792a80f6aed80d359` |
| Execution | 277 passed, 0 failed, 1 skipped; 138 authored tests across Chromium and Firefox |
| New parity coverage | Function/Element/NodeList then receiver/return contracts and defer timer/callback-array behavior |


## Latest confirmed execution record — run #413

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) |
| Commit | `092bd90f626d9bddd06d87d445b9a2494c5429d8` |
| Execution | 281 passed, 0 failed, 1 skipped; 141 authored tests across Chromium and Firefox |
| New AQJS evidence | setText falsy no-op and setHtml falsy innerHTML/outerHTML assignment return behavior matched between source and minified builds |


## Latest confirmed execution record — run #413

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) |
| Commit | `092bd90f626d9bddd06d87d445b9a2494c5429d8` |
| Execution | 281 passed, 0 failed, 1 skipped; 141 authored tests across Chromium and Firefox |
| New AQJS coverage | setText ignores empty string/0/false/null and returns its receiver; setHtml writes falsy values, returns the assigned value, converts null to empty innerHTML, and outerHTML assignment can remove the host; source/minified parity |

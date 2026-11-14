# ActiveQuery Runtime Validation Matrix

Status snapshot: 2026-11-15.
Run #171 completed with 106 passed and 16 failed. After correcting the tests and recording an additional AQCSS media-query defect, run #281 completed successfully: **156 passed, 0 failed, 0 skipped** across Chromium and Firefox. This validates the current 78-test authored suite only; broader API, accessibility and compatibility coverage remains incomplete. **Gate C is partially satisfied, not passed in full.**

Legend:
- **Inspected** — source behavior reviewed.
- **Test authored** — a reproducible test exists in the repository.
- **Pending run** — test has not been observed passing in a real browser.
- **Pending authoring** — additional test coverage is still required.

## AQJS core and lifecycle

| API / behavior | Source review | Test coverage | Current status |
|---|---|---|---|
| Constructor default argument | Inspected: null triggers alias and Object/Element/NodeList prototype writes | Default and empty-string constructor tests | Passed in run #281 |
| Import-time prototype extensions | Inspected: native prototypes augmented; String.trim replaced; native writable/configurable descriptor flags are retained | Native trim identity/descriptor test | Passed in run #281 |
| `DOM(selector)` | Inspected: null / Element / NodeList polymorphic result | Zero, one, many matches | Passed in run #281 |
| `nestedDOM(selector)` Element | Inspected | Single descendant and no-match context | Passed in run #281 |
| `nestedDOM(selector)` NodeList | Inspected | Flattened descendants | Passed in run #281 |
| `nestedDOM(selector)` Array | Inspected: Array fails accepted-type guard and is returned unchanged | Explicit unchanged-array test | Passed in run #281 |
| `nestedDOM(selector)` Document | Inspected | Zero/one/many and no-match context test | Passed in run #281 |
| `nestedDOM(selector)` HTMLCollection | Inspected: returns unchanged | Explicit unchanged-result test | Passed in run #281 |
| `extend(...args)` | Inspected; argument validation and custom-element branches mapped | Valid autonomous element and invalid no-hyphen name tests | Passed in run #281 |
| `isEmpty` | Inspected: zero/false/null/empty string and recursive array semantics | Representative cases | Passed in run #281 |
| `exit` | Inspected as no-op returning this | Static and instance receiver identity | Passed in run #281 |
| `keepOn` | Inspected: returns input only for empty length and non-debug | Empty/non-empty/debug cases | Passed in run #281 |
| `defer` | Inspected: spreads input, pops delay, passes remaining array to setTimeout; array is string-coerced by browser timer API | Non-throwing timer-handle test | Passed in run #281 |
| `getPlugin` | Inspected: dynamic import by string | No allowlist/security test | Pending authoring |
| Lifecycle `on` | Inspected: fixed event names, no late replay | Late ready/init test | Passed in run #281 |
| Constructor `initlog` | Inspected: no readyState check | Late callback test | Passed in run #281 |

## AQJS type predicates

| Method(s) | Source review | Test coverage | Current status |
|---|---|---|---|
| `isArray`, `isNaA`, `isArraySet`, `isNaAS`, `isObjectMap`, `isNaOM` | Inspected | Representative positive/negative checks | Partial; passed in run #281; truth table not exhaustive |
| `isArrayLike`, `isNaAL` | Inspected: unqualified helper references | Explicit ReferenceError tests | Passed in run #281 |
| `isString`, `isNaS` | Inspected: `isNaS` appears broken | Primitive/boxed string test | Passed in run #281 |
| `isObject`, `isNaO`, `isObjectLiteral` | Inspected; null throws before guard | Plain-object checks and null error test | Partial; passed in run #281; cross-realm and other edge cases remain |
| `isNaM`, `isSet`, `isNaOL`, `isObjectLike` | Inspected; naming/undefined helper issues | Map, array and objectLike checks | Partial; selected cases passed in run #281; `isNaOL` and full input matrix remain |
| `isFunction`, `isNaF`, `isClass`, `isNaC` | Inspected heuristic string checks | Named function and class checks | Partial; selected cases passed in run #281; negative predicates remain |
| `isNodeList`, `isNaNL` | Inspected: references undefined `x` | Both positive and negative methods tested for ReferenceError | Passed in run #281 |
| `isArgument`, `isJSON` | Inspected: type/regex behavior, not JSON parsing | Empty/null argument and arbitrary string JSON tests | Passed in run #281 |

## AQJS Array/Object/primitive extensions

| Target | Methods | Source review | Test coverage | Current status |
|---|---|---|---|---|
| Array | `i`, `then`, `getIndex`, `getCount`, `setSort`, `setItem`, `has`, `getIndexs` | All inventoried; multiple defects identified | i, getIndex, getCount, setSort, both setItem branches, has, getIndexs, then | Partial; selected contracts passed in run #281; default getCount branch and remaining edge cases pending |
| Object | `setValues`, `hasValues` | Missing static predicate call | Both error cases | Passed in run #281 |
| Number | `trim` | Inspected | Primitive trim test | Passed in run #281 |
| String | `trim` | Native override and Unicode mismatch identified | Descriptor and U+FEFF/U+200B comparisons | Passed in run #281 |
| Function | `then` | Inspected | Callback test | Passed in run #281 |

## AQJS Element/NodeList/Document/Window

| Target | Methods / behavior | Source review | Test coverage | Current status |
|---|---|---|---|---|
| Element | `parent`, `name` | Inspected | Parent relationship and nodeName | Passed in run #281 |
| Element | Attributes/styles | Inspected; falsy-value and simple parser limits | Pair early-stop, attribute names/removal, inline style parsing/readback | Partial; selected contracts passed in run #281 |
| Element | Classes | Inspected | Basic set/get/remove plus NodeList bulk class mutators | Partial; selected contracts passed in run #281 |
| Element | `i`, `setChild`, `siblings` | Inspected; sibling default bug | sibling next/prev/default tests | Partial; sibling paths passed in run #281; `i` and `setChild` remain untested |
| Element | `setAdjacent`, `setHtml`, `getHtml`, `setContent` | Inspected; guards and DOM insertion semantics | Guarded setAdjacent/setHtml, getHtml modes, array setContent | Partial; selected contracts passed in run #281 |
| Element | `setText`, `getText`, `setValue`, `getValue` | Inspected; falsy and inverted mode behavior | setText, getText and getValue modes | Partial; selected contracts passed in run #281; Element setValue remains untested |
| Element | `then`, `fax`, `on` | Inspected | on tested; then/fax pending | Partial; `on` passed in run #281; then/fax remain untested |
| Element | `sancha` | Inspected; HTML injection and undeclared identifiers | Static success and data-mode ReferenceError | Passed in run #281 |
| Element | `sift` | Inspected: truthy selector early return | Explicit no-handler test | Passed in run #281 |
| Element | `watch` | Inspected; callback `this` failure and missing observer return | Mutation test captures TypeError and missing user callback | Passed in run #281 |
| NodeList | attributes/styles/classes/value/on | Inspected; some working loops, some stubs | Bulk attributes/styles/classes, setValue, getStyles/getClasses and content no-op cases | Partial; selected contracts passed in run #281 |
| NodeList | no-op stubs | Inspected: getStyles/getClasses/getHtml/setText/etc. | Representative stubs and content no-op behavior | Partial; selected stubs passed in run #281; not exhaustive |
| Document/Window | `on` | Inspected | Native custom event listeners | Passed in run #281 |

## AQCSS validation

| Area | Source review | Test coverage | Current status |
|---|---|---|---|
| Rule and selector inventory | Brace-aware index committed; PostCSS AST generator committed | AST generation and source hash assertions | Passed in run #281 |
| Source/minified parity | Lexical comparison indicates parity | PostCSS AST comparison | Passed in run #281 |
| Breakpoints and responsive variants | Inspected: mobile/tablet/desktop hide range queries are malformed and ignored by Chromium/Firefox; tablet/desktop/large typography prefixes activate at their min-width thresholds | 599/600/601, 601/992, 993/1439 and 1440 computed-style tests | All tested breakpoint and hide-helper behavior passed in run #281; short-landscape and touch/hybrid behavior remain untested |
| Typography and unit tokens | Multiple source defects documented | Paragraph and large-screen case mismatch tests | Passed in run #281 |
| Layout/flex/spacing | Multiple source defects documented | Facet, row-gap, flex base, spacing aliases and responsive alignment tests | Passed in run #281 |
| Swatches and color functions | Token duplication and invalid rgb() usage documented | Base border token and hover alpha tests | Partial; selected cases passed in run #281; more theme/swatch coverage remains |
| Controls/focus/tooltip/dropdown | Source inspected | Focus outline, hover-only tooltip, hover/focus/click dropdown tests | Partial; keyboard/pointer tests passed in run #281; touch behavior remains untested |
| Reduced motion/dark mode | No built-in reduced-motion override or dark-mode query found in pinned stylesheet | Reduced-motion emulation test; dark-mode source absence review | Reduced-motion gap passed in run #281; dark mode remains an application-level feature |

## Execution and acceptance

1. Continue adding source-grounded tests for untested API branches, accessibility and compatibility.
2. Inspect any failures without modifying upstream source or weakening source-grounded assertions.
3. Retain test logs, browser versions and generated AST catalog artifacts for every accepted run.
4. Keep the mastery gate open until coverage and independent-agent evaluation are complete.


## Confirmed execution record

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #281](https://github.com/amrshah/activequery-labs/actions/runs/43638192585) |
| Commit | `84a1381a7ac761ca7a8e9aa5a949c393555dcecc` |
| Runner | Ubuntu 24.04.5 LTS (`ubuntu-24.04`) |
| Node / npm | Node 22.23.4 / npm 10.9.9 |
| Playwright | `@playwright/test` 1.56.1 |
| Browser binaries | Chromium 141.0.7390.37 (Playwright build v1194); Firefox 142.0.1 (build v1495) |
| Execution | 156 passed, 0 failed, 0 skipped; 23.8 seconds; 2 workers |
| Source integrity | Pinned AQJS/AQCSS source and minified assets fetched and hash-verified before catalog generation and tests |
| Artifact | Generated AQCSS/AQJS AST catalogs uploaded successfully by the workflow |

The run validates the 78 authored tests in two browser projects. It does not prove complete framework mastery, exhaustive API coverage, accessibility, touch behavior, WebKit compatibility or the clean-room portal rebuild.

# ActiveQuery Runtime Validation Matrix

Status snapshot: 2026-11-15.
Run #171 completed with 106 passed and 16 failed. After correcting the tests and recording an additional AQCSS media-query defect, run #195 completed successfully: **138 passed, 0 failed, 0 skipped** across Chromium and Firefox. This validates the current 69-test authored suite only; broader API, accessibility and compatibility coverage remains incomplete. **Gate C is partially satisfied, not passed in full.**

Legend:
- **Inspected** — source behavior reviewed.
- **Test authored** — a reproducible test exists in the repository.
- **Pending run** — test has not been observed passing in a real browser.
- **Pending authoring** — additional test coverage is still required.

## AQJS core and lifecycle

| API / behavior | Source review | Test coverage | Current status |
|---|---|---|---|
| Constructor default argument | Inspected: null triggers alias and Object/Element/NodeList prototype writes | Default and empty-string constructor tests | Test authored; pending run |
| Import-time prototype extensions | Inspected: native prototypes augmented; String.trim replaced; native writable/configurable descriptor flags are retained | Native trim identity/descriptor test | Corrected assertion; rerun pending |
| `DOM(selector)` | Inspected: null / Element / NodeList polymorphic result | Zero, one, many matches | Test authored; pending run |
| `nestedDOM(selector)` Element | Inspected | Single descendant and no-match context | Test authored; pending run |
| `nestedDOM(selector)` NodeList | Inspected | Flattened descendants | Test authored; pending run |
| `nestedDOM(selector)` Array | Inspected: Array fails accepted-type guard and is returned unchanged | Explicit unchanged-array test | Corrected test; rerun pending |
| `nestedDOM(selector)` Document | Inspected | Not yet isolated | Pending authoring |
| `nestedDOM(selector)` HTMLCollection | Inspected: returns unchanged | Explicit unchanged-result test | Test authored; pending run |
| `extend(...args)` | Inspected; argument validation and custom-element branches mapped | Valid autonomous element and invalid no-hyphen name tests | Test authored; pending run |
| `isEmpty` | Inspected: zero/false/null/empty string and recursive array semantics | Representative cases | Test authored; pending run |
| `exit` | Inspected as no-op returning this | No test | Pending authoring |
| `keepOn` | Inspected: returns input only for empty length and non-debug | Empty/non-empty/debug cases | Test authored; pending run |
| `defer` | Inspected: spreads input, pops delay, passes remaining array to setTimeout; array is string-coerced by browser timer API | Non-throwing timer-handle test | Corrected test; rerun pending |
| `getPlugin` | Inspected: dynamic import by string | No allowlist/security test | Pending authoring |
| Lifecycle `on` | Inspected: fixed event names, no late replay | Late ready/init test | Test authored; pending run |
| Constructor `initlog` | Inspected: no readyState check | Late callback test | Test authored; pending run |

## AQJS type predicates

| Method(s) | Source review | Test coverage | Current status |
|---|---|---|---|
| `isArray`, `isNaA`, `isArraySet`, `isNaAS`, `isObjectMap`, `isNaOM` | Inspected | No full truth table | Pending authoring |
| `isArrayLike`, `isNaAL` | Inspected: unqualified helper references | Not yet tested | Pending authoring |
| `isString`, `isNaS` | Inspected: `isNaS` appears broken | Primitive/boxed string test | Test authored; pending run |
| `isObject`, `isNaO`, `isObjectLiteral` | Inspected; null throws before guard | Null test only | Partial; pending run |
| `isNaM`, `isSet`, `isNaOL`, `isObjectLike` | Inspected; naming/undefined helper issues | Array/Map and objectLike error cases partial | Partial; pending run |
| `isFunction`, `isNaF`, `isClass`, `isNaC` | Inspected heuristic string checks | No full truth table | Pending authoring |
| `isNodeList`, `isNaNL` | Inspected: references undefined `x` | isNodeList error test | Test authored; pending run |
| `isArgument`, `isJSON` | Inspected: type/regex behavior, not JSON parsing | null false-positive test | Partial; pending authoring |

## AQJS Array/Object/primitive extensions

| Target | Methods | Source review | Test coverage | Current status |
|---|---|---|---|---|
| Array | `i`, `then`, `getIndex`, `getCount`, `setSort`, `setItem`, `has`, `getIndexs` | All inventoried; multiple defects identified | i, getIndex, setSort, setItem | Partial; pending run and remaining methods |
| Object | `setValues`, `hasValues` | Missing static predicate call | Both error cases | Test authored; pending run |
| Number | `trim` | Inspected | Primitive trim test | Test authored; pending run |
| String | `trim` | Native override and Unicode mismatch identified | Descriptor and U+FEFF/U+200B comparisons | Test authored; pending run |
| Function | `then` | Inspected | Callback test | Test authored; pending run |

## AQJS Element/NodeList/Document/Window

| Target | Methods / behavior | Source review | Test coverage | Current status |
|---|---|---|---|---|
| Element | `parent`, `name` | Inspected | No getter edge tests | Pending authoring |
| Element | Attributes/styles | Inspected; falsy-value and simple parser limits | No complete test matrix | Pending authoring |
| Element | Classes | Inspected | Basic set/get and event helper tests | Partial; pending run |
| Element | `i`, `setChild`, `siblings` | Inspected; sibling default bug | sibling next/prev/default tests | Partial; pending run |
| Element | `setAdjacent`, `setHtml`, `getHtml`, `setContent` | Inspected; guards and DOM insertion semantics | setAdjacent/setHtml only | Partial; pending run |
| Element | `setText`, `getText`, `setValue`, `getValue` | Inspected; falsy and inverted mode behavior | Not yet tested | Pending authoring |
| Element | `then`, `fax`, `on` | Inspected | on tested; then/fax pending | Partial; pending run |
| Element | `sancha` | Inspected; HTML injection and undeclared identifiers | Static success and data-mode ReferenceError | Test authored; pending run |
| Element | `sift` | Inspected: truthy selector early return | Explicit no-handler test | Test authored; pending run |
| Element | `watch` | Inspected; callback `this` failure and missing observer return | Mutation test captures TypeError and missing user callback | Test authored; pending run |
| NodeList | attributes/styles/classes/value/on | Inspected; some working loops, some stubs | setValue, getStyles/getClasses and content no-op cases | Partial; pending run |
| NodeList | no-op stubs | Inspected: getStyles/getClasses/getHtml/setText/etc. | Not exhaustively asserted | Pending authoring |
| Document/Window | `on` | Inspected | Native custom event listeners | Test authored; pending run |

## AQCSS validation

| Area | Source review | Test coverage | Current status |
|---|---|---|---|
| Rule and selector inventory | Brace-aware index committed; PostCSS AST generator committed | AST generation and source hash assertions | Test authored; pending run |
| Source/minified parity | Lexical comparison indicates parity | PostCSS AST comparison | Test authored; pending run |
| Breakpoints and responsive variants | Inspected: mobile-hide media query is malformed and ignored by Chromium/Firefox; tablet typography activates at 600px | 599/600/601 computed-style test | Corrected assertion; rerun pending; 992/993/1440 tests pending |
| Typography and unit tokens | Multiple source defects documented | Paragraph and large-screen case mismatch tests | Test authored; pending run |
| Layout/flex/spacing | Multiple source defects documented | Facet and row-gap tests pending | Pending authoring |
| Swatches and color functions | Token duplication and invalid rgb() usage documented | Base border token and hover alpha tests | Partial; pending run and more color coverage |
| Controls/focus/tooltip/dropdown | Source inspected | Keyboard/touch/hover tests pending | Pending authoring |
| Reduced motion/dark mode | No built-in support found in pinned stylesheet | Absence/source assertions; app-level implementation deferred | Pending authoring |

## Execution and acceptance

1. Re-run the corrected Playwright suite in Chromium and Firefox.
2. Inspect any remaining failures without modifying upstream source or weakening source-grounded assertions.
3. Add the remaining API and CSS tests above.
4. Retain test logs, browser versions and generated AST catalog artifacts.
5. Only then update this matrix with observed pass/fail results.


## Confirmed execution record

| Field | Verified value |
|---|---|
| Workflow | [ActiveQuery knowledgebase browser tests #195](https://github.com/amrshah/activequery-labs/actions/runs/43635407735) |
| Commit | `5666320ae68016d0df9265a32d9e00b11f7987e1` |
| Runner | Ubuntu 24.04.5 LTS (`ubuntu-24.04`) |
| Node / npm | Node 22.23.4 / npm 10.9.9 |
| Playwright | `@playwright/test` 1.56.1 |
| Browser binaries | Chromium 141.0.7390.37 (Playwright build v1194); Firefox 142.0.1 (build v1495) |
| Execution | 138 passed, 0 failed, 0 skipped; 19.5 seconds; 2 workers |
| Source integrity | Pinned AQJS/AQCSS source and minified assets fetched and hash-verified before catalog generation and tests |
| Artifact | Generated AQCSS/AQJS AST catalogs uploaded successfully by the workflow |

The run validates the 69 authored tests in two browser projects. It does not prove complete framework mastery, exhaustive API coverage, accessibility, touch behavior, WebKit compatibility or the clean-room portal rebuild.

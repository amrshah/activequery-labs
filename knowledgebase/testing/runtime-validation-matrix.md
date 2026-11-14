# ActiveQuery Runtime Validation Matrix

Status snapshot: 2026-11-15.
Run #171 completed with 106 passed and 16 failed. After run #313, additional test coverage was added. The latest completed browser run #327 passed: **182 passed, 0 failed, 0 skipped** across Chromium and Firefox (91 authored tests in two browser projects). Run #325 remains the previous 88-test baseline; run #313 remains the historical 79-test baseline. Broader API, accessibility and compatibility coverage remains incomplete. **Gate C is partially satisfied, not passed in full.**

Legend:
- **Inspected** — source behavior reviewed.
- **Test authored** — a reproducible test exists in the repository.
- **Pending run** — test has not been observed passing in a real browser.
- **Pending authoring** — additional test coverage is still required.

## Latest AQJS contract coverage — verified in run #324

Six additional tests were added for Element `setValue`, `setChild`, `then`/`fax`; NodeList no-op stubs and `on`; and Array `getCount` default-operator edge cases. The first execution exposed incorrect expectations in the tests, not framework regressions. Source review and subsequent passing browser assertions established: `isNaF` matches arrow-function source and strings containing `function`; `Element.setValue` writes an empty `value` property even on a generic Element when the supplied value is falsy or the Element lacks a native value property; and `NodeList.on` returns the same empty collection when called with valid arguments. Workflow [#325](https://github.com/amrshah/activequery-labs/actions/runs/43644825180) passed all 174 browser cases. A further source/minified fixture is authored in commit `5769645f9aa327c627ce58f8dda9a5b40934b8db` and awaits workflow #325.

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
| Array | `i`, `then`, `getIndex`, `getCount`, `setSort`, `setItem`, `has`, `getIndexs` | All inventoried; multiple defects identified; `then` makes Arrays thenable and can interfere with Promise-based consumers | i, getIndex, getCount default/operator branches, setSort, both setItem branches, has, getIndexs, then | Partial; delimiter, no-delimiter and missing-property default `getCount` cases passed in run #324; direct callback/missing/non-function callback behavior passed in run #327; Promise resolver assimilation remains pending and must be isolated safely |
| Object | `setValues`, `hasValues` | Missing static predicate call | Both error cases | Passed in run #313 |
| Number | `trim` | Inspected | Primitive trim test | Passed in run #313 |
| String | `trim` | Native override and Unicode mismatch identified | Descriptor and U+FEFF/U+200B comparisons | Passed in run #313 |
| Function | `then` | Inspected | Callback test | Passed in run #313 |

## AQJS Element/NodeList/Document/Window

| Target | Methods / behavior | Source review | Test coverage | Current status |
|---|---|---|---|---|
| Element | `parent`, `name` | Inspected | Parent relationship and nodeName | Passed in run #313 |
| Element | Attributes/styles | Inspected; falsy-value and simple parser limits | Pair early-stop, attribute names/removal, inline style parsing/readback | Partial; selected contracts passed in run #313 |
| Element | Classes | Inspected | Basic set/get/remove plus NodeList bulk class mutators | Partial; selected contracts passed in run #313 |
| Element | `i`, `setChild`, `siblings` | Inspected; sibling default bug | sibling next/prev/default and setChild single/array/empty cases | Partial; setChild cases passed in run #324; `i` remains untested |
| Element | `setAdjacent`, `setHtml`, `getHtml`, `setContent` | Inspected; guards and DOM insertion semantics | Guarded setAdjacent/setHtml, getHtml modes, array setContent | Partial; selected contracts passed in run #313 |
| Element | `setText`, `getText`, `setValue`, `getValue` | Inspected; falsy and inverted mode behavior; setValue assigns empty string on falsy input and on generic Elements | setText, getText, getValue modes, setValue truthy/falsy/generic Element | Selected contracts passed in run #324; broader control-type matrix remains pending |
| Element | `then`, `fax`, `on` | Inspected | callback result, absent callback, FORM/non-FORM fax, event listener | Selected contracts passed in run #324; form semantics remain unsupported/incomplete |
| Element | `sancha` | Inspected; HTML injection and undeclared identifiers | Static success and data-mode ReferenceError | Passed in run #313 |
| Element | `sift` | Inspected: truthy selector early return | Explicit no-handler test | Passed in run #313 |
| Element | `watch` | Inspected; callback `this` failure and missing observer return | Mutation test captures TypeError and missing user callback | Passed in run #313 |
| NodeList | attributes/styles/classes/value/on | Inspected; some working loops, some stubs | Bulk attributes/styles/classes, setValue, stubs and valid/invalid/empty-list `on` | Selected contracts passed in run #324; broader collection edge cases remain pending |
| NodeList | no-op stubs | Inspected: getStyles/getClasses/getHtml/setText/etc. | All identified no-op stubs invoked with representative arguments; no mutation and return shape asserted | Identified stub set passed in run #324; broader argument combinations remain pending |
| Document/Window | `on` | Inspected | Native custom event listeners; invalid event/callback arguments and receiver identity | Valid event dispatch passed in run #313; invalid-argument receiver identity passed in run #327 |

## AQCSS validation

| Area | Source review | Test coverage | Current status |
|---|---|---|---|
| Rule and selector inventory | Brace-aware index committed; PostCSS AST generator committed | AST generation and source hash assertions | Passed in run #313 |
| AQCSS source/minified parity | Lexical comparison indicates parity | PostCSS AST comparison | Passed in run #313 |\n| AQJS source/minified behavior parity | AST structure parity plus selected runtime behavior fixtures | Core DOM, selected edge cases, Element value/child/then, NodeList events, Array `getCount` default branch, Array `then`, and Document/Window events | Selected fixtures passed in runs #325 and #327; complete method-level semantic parity remains pending |
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


## Latest confirmed execution record — run #327

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

# ActiveQuery Runtime Validation Matrix

Status snapshot: 2026-11-14.
Important: test cases are authored and committed, but no GitHub Actions run/status has been retrieved. **No runtime test in this matrix is marked passed.**

Legend:
- **Inspected** — source behavior reviewed.
- **Test authored** — a reproducible test exists in the repository.
- **Pending run** — test has not been observed passing in a real browser.
- **Pending authoring** — additional test coverage is still required.

## AQJS core and lifecycle

| API / behavior | Source review | Test coverage | Current status |
|---|---|---|---|
| Constructor default argument | Inspected: null triggers alias and Object/Element/NodeList prototype writes | Default and empty-string constructor tests | Test authored; pending run |
| Import-time prototype extensions | Inspected: native prototypes augmented; String.trim replaced | Native trim identity/descriptor test | Test authored; pending run |
| `DOM(selector)` | Inspected: null / Element / NodeList polymorphic result | Zero, one, many matches | Test authored; pending run |
| `nestedDOM(selector)` Element | Inspected | Single descendant and no-match context | Test authored; pending run |
| `nestedDOM(selector)` NodeList | Inspected | Flattened descendants | Test authored; pending run |
| `nestedDOM(selector)` Array | Inspected | Zero/one/many polymorphic returns | Test authored; pending run |
| `nestedDOM(selector)` Document | Inspected | Not yet isolated | Pending authoring |
| `nestedDOM(selector)` HTMLCollection | Inspected: returns unchanged | Explicit unchanged-result test | Test authored; pending run |
| `extend(...args)` | Inspected; argument validation and custom-element branches mapped | No dedicated browser tests yet | Pending authoring |
| `isEmpty` | Inspected: zero/false/null/empty string and recursive array semantics | Representative cases | Test authored; pending run |
| `exit` | Inspected as no-op returning this | No test | Pending authoring |
| `keepOn` | Inspected: returns input only for empty length and non-debug | No test | Pending authoring |
| `defer` | Inspected: passes array to setTimeout | TypeError test | Test authored; pending run |
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
| Number | `trim` | Inspected | No runtime tests | Pending authoring |
| String | `trim` | Native override and Unicode mismatch identified | Descriptor and U+FEFF/U+200B comparisons | Test authored; pending run |
| Function | `then` | Inspected | No runtime test | Pending authoring |

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
| Element | `sancha` | Inspected; HTML injection and undeclared identifiers | No browser test | Pending authoring |
| Element | `sift` | Inspected: truthy selector early return | Explicit no-handler test | Test authored; pending run |
| Element | `watch` | Inspected; callback/observer lifecycle issues | No browser test | Pending authoring |
| NodeList | attributes/styles/classes/value/on | Inspected; some working loops, some stubs | Only sibling and nestedDOM paths | Pending authoring |
| NodeList | no-op stubs | Inspected: getStyles/getClasses/getHtml/setText/etc. | Not exhaustively asserted | Pending authoring |
| Document/Window | `on` | Inspected | No event tests | Pending authoring |

## AQCSS validation

| Area | Source review | Test coverage | Current status |
|---|---|---|---|
| Rule and selector inventory | Brace-aware index committed; PostCSS AST generator committed | AST generation and source hash assertions | Test authored; pending run |
| Source/minified parity | Lexical comparison indicates parity | PostCSS AST comparison | Test authored; pending run |
| Breakpoints and responsive variants | Inspected | 599/600/601 tablet/mobile overlap test | Partial; 992/993/1440 tests pending |
| Typography and unit tokens | Multiple source defects documented | Paragraph and large-screen case mismatch tests | Test authored; pending run |
| Layout/flex/spacing | Multiple source defects documented | Facet and row-gap tests pending | Pending authoring |
| Swatches and color functions | Token duplication and invalid rgb() usage documented | Base border token and hover alpha tests | Partial; pending run and more color coverage |
| Controls/focus/tooltip/dropdown | Source inspected | Keyboard/touch/hover tests pending | Pending authoring |
| Reduced motion/dark mode | No built-in support found in pinned stylesheet | Absence/source assertions; app-level implementation deferred | Pending authoring |

## Execution and acceptance

1. Run the committed Playwright suite in Chromium and Firefox.
2. Inspect and fix test harness failures without modifying upstream source.
3. Add the remaining API and CSS tests above.
4. Retain test logs, browser versions and generated AST catalog artifacts.
5. Only then update this matrix with observed pass/fail results.

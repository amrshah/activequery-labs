# Browser Validation Plan and Current Coverage

Status: latest PR-19 browser run [#506](https://github.com/amrshah/activequery-labs/actions/runs/43860188409) passed **365 tests with 1 documented skip**. Pages packaging validation [#559](https://github.com/amrshah/activequery-labs/actions/runs/43860188396) passed required-file checks, pinned source/license hash verification, distributable asset checks and artifact upload; deployment was skipped for the PR event. Coverage remains targeted rather than exhaustive.

## Test environment

- Runner: GitHub Actions, Ubuntu 24.04 (pinned; Playwright 1.56.1 does not support the newer Ubuntu 26.04 runner image).
- Node: 22.
- Browser engines: Chromium and Firefox.
- Playwright: `@playwright/test` pinned to 1.56.1.
- AQCSS and AQJS are cloned and checked out at the exact source SHAs in `source-baseline.md`.
- Tests run against local copies of the pinned upstream source; the upstream repositories are not modified.

## Current automated coverage

### Source/minified parity

- PostCSS AST comparison checks all AQCSS source and minified rules, selectors, media context and declarations after syntax-preserving whitespace normalization.
- Browser tests compare core AQJS selector/Element behavior and selected edge contracts across source and minified module builds, including Element `setValue`, `setChild`, `then`, NodeList event registration/empty-collection return, Array `getCount` default-operator behavior, Array `then`, Document/Window event helpers, early lifecycle hooks and constructor `initlog` timing, Array query helper parity, Element/NodeList bulk mutation parity, Element fragment/form-control contracts, NodeList multi-control setValue parity, Element setContent replacement/failure parity, Array/Object/predicate failure parity, and Array.setItem / Element setText, setHtml, getValue and siblings parity, plus base/responsive flex importance cascade and mobile-middle alias composition (runs #325, #327, #340, #348, #383, #392, #395, #397, #399, #401 and #403).
- CI verifies exact Git blob SHAs for both source and minified files before testing.
- Recent AQJS regression coverage merged in PRs #12–#16 includes lifecycle/watch and sift findings, Element text-helper contracts, and `sancha()` raw-HTML interpolation/security behavior. The dedicated `sancha()` suite passed in run [#478](https://github.com/amrshah/activequery-labs/actions/runs/43844759071); the merged-branch full suite passed again in run #480.
- The portal consent gate, pre-consent network silence, post-consent asset requests, theme persistence, keyboard editor-tab navigation, learning-guide navigation and narrow viewport behavior passed in run #491.

### AQJS

| Test | Expected contract | Coverage file |
|---|---|---|
| DOM no match | `null` | `tests/aqjs.spec.js` |
| DOM one match | Element | `tests/aqjs.spec.js` |
| DOM multiple matches | NodeList | `tests/aqjs.spec.js` |
| nestedDOM Element one match | Element | `tests/aqjs.spec.js` |
| nestedDOM Element no match | Original context | `tests/aqjs.spec.js` |
| nestedDOM NodeList context | Flattened plain array | `tests/aqjs.spec.js` |
| Element class mutation/query | Adds, checks and removes classes | `tests/aqjs.spec.js` |
| Element event helper | Native event listener invoked | `tests/aqjs.spec.js` |
| Document nestedDOM | Zero/one/many descendant results and no-match context | `tests/aqjs.spec.js` |
| Array helpers | `getCount`, `has`, `getIndexs`, `then`, and both `setItem` branches; test results are wrapped because AQJS makes Arrays thenable | `tests/aqjs.spec.js` |
| Element attributes/styles | Pair early-stop, attribute-name/remove helpers and inline style reads | `tests/aqjs.spec.js` |
| Element content | HTML/text retrieval and substring modes; node-array `setContent` | `tests/aqjs.spec.js` |
| NodeList bulk mutators | Attributes, inline styles and classes applied across collection | `tests/aqjs.spec.js` |
| Element parent/name | Parent relationship and node name getters | `tests/aqjs.spec.js` |
| Type predicates | Positive/negative checks plus known broken array-like paths, `isNaS` always true and `isNaF` string/arrow false positives | `tests/aqjs.spec.js` |\n| Element value/child/then/fax | Truthy/falsy value writes, generic Element value-property creation, single/array child append, callback result and FORM/non-FORM return | `tests/aqjs.spec.js` |\n| NodeList stubs and events | Identified no-op stubs do not mutate; `on` validates arguments and returns an empty collection unchanged | `tests/aqjs.spec.js` |\n| Array getCount default branch | Delimiter/no-delimiter matching and missing-property TypeError | `tests/aqjs.spec.js` |
| getPlugin rejection | Rejected dynamic import propagates TypeError; non-string fallback returns instance | `tests/aqjs.spec.js` |
| Document/Window on guards | Invalid event/callback arguments return the original receiver | `tests/aqjs.spec.js` |
| Early lifecycle and initlog | `ready`, `init`, `run` and constructor `readystatechange=complete` callback fire once when registered before lifecycle completion | `tests/aqjs.spec.js` |
| Remaining lifecycle event names | `offline`, `online`, `close` map to native events; unknown names are ignored; method returns instance | `tests/aqjs.spec.js` |
| NodeList index edges | Numeric-string index, out-of-range undefined and empty-list receiver return | `tests/aqjs.spec.js` |

### AQCSS

- PostCSS structural parse of the pinned source verifies that the stylesheet parses and that expected media queries, custom properties and representative selectors are present (`tests/css-source-parse.spec.js`).
- Acorn AST inventory of AQJS source/minified artifacts verifies exported names, class methods, prototype extension targets and method names (`tests/js-source-parse.spec.js`).

| Test | Expected contract | Coverage file |
|---|---|---|
| Text alignment utility | Computed text alignment is center | `tests/aqcss.spec.js` |
| Circle border utility | Computed radius is non-zero | `tests/aqcss.spec.js` |
| Tablet-prefixed typography | `aq-t-` rule activates at 600px | `tests/aqcss.spec.js` |
| Mobile/tablet/desktop hide helpers | All three range media queries are malformed and ignored; helpers remain visible at 599/600/601, 601/992 and 993/1439px. The simple screen-hide query works at 1440px | `tests/aqcss.spec.js` |
| Dropdown interaction | Hover variant opens on pointer hover but not keyboard focus; click variant has no click-to-open behavior | `tests/aqcss.spec.js` |
| Short-landscape overlay | At 800x550 the media query matches in both engines; Firefox renders the pseudo-element, Chromium omits it from CSSOM after a stray semicolon; at 800x551 neither renders it | `tests/aqcss.spec.js` |
| Reduced motion | `.input-animate` retains a 0.4s transition under `prefers-reduced-motion: reduce` | `tests/aqcss.spec.js` |
| Third-width anomaly | Computed width remains a small fraction, capturing source value without normalizing | `tests/aqcss.spec.js` |
| Xlarge row-gap anomaly | Invalid `2` unitless declaration does not compute as 2px | `tests/aqcss.spec.js` |

## Next targeted AQCSS composition coverage

The source-grounded but not-yet-implemented cross-family cases are listed in [AQCSS Focused Composition Test Plan](aqcss-composition-test-plan.md). They are proposals, not existing tests or passing evidence. Add them as a deliberate focused test batch rather than rerunning the full suite for documentation-only work.

## Known gaps in automated coverage

- Constructor alias/prototype mutation is covered for default null and explicit empty-string construction, but not all arbitrary aliases.
- No tests yet for every AQJS method or every collection-specific edge case; the identified NodeList no-op stubs now have representative invocation/no-mutation assertions.
- `sancha`, `sift` and `watch` have authored targeted tests and remain passing through run #327; broader behavioral branches remain untested.
- Lifecycle late registration, early `ready`/`init`/`run`, constructor `initlog` completion, and `offline`/`online`/`close` mappings have authored coverage and pass through run #347; repeated construction and unusual lifecycle timing remain to be expanded.
- The clean-room portal is validated in CI but is not publicly deployed; the Pages workflow is intentionally unchanged pending the OSL-3.0 distribution review.
- AQCSS cross-family composition coverage now includes all 19 fully asserted AQX cases (001–019). AQX-009 real scroll-container sticky movement passed in Chromium and Firefox in run #506.
- No exhaustive CSS selector catalogue coverage.
- Base border-token and hover alpha computed-style tests have been authored; exhaustive swatch/theme coverage remains outstanding.
- Basic focus-outline, disabled-descendant and hover-only tooltip tests remain passing through run #327; touch/hybrid device, zoom and comprehensive accessibility audits remain outstanding. Reduced-motion and short-landscape tests also passed, including a documented browser-specific CSSOM difference.
- No WebKit project yet.

## Current authored test inventory

Counts below are taken from the Chromium test listing in verified workflow run #429, rather than inferred from source-file line counts:

- `tests/aqjs.spec.js`: 69 targeted browser tests.
- `tests/aqcss.spec.js`: 46 targeted computed-style/browser tests.
- `tests/rebuild-portal.spec.js`: 4 clean-room portal tests (render, sandbox/live edit, AQJS event bridge, narrow layout).
- `tests/minified-parity.spec.js`: 24 source/minified parity tests.
- `tests/css-source-parse.spec.js`: 4 source/catalog tests; `tests/js-source-parse.spec.js`: 1 API inventory test; `tests/knowledgebase-integrity.spec.js`: 1 link-integrity test.
- Latest complete execution: run #506 executed 366 browser-project cases across Chromium and Firefox: **365 passed, 0 failed, 1 documented Firefox mobile-emulation skip**. The repository's historical authored-test count is not treated as current; use the workflow output as the authoritative execution count. The workflow is configured for both `push` and `pull_request` to `main`.

## Execution record

| Date | Commit / run | Result |
|---|---|---|
| 2026-11-14 | Run #171, commit `77a78e44235dbbca6b07320074f4149d6131dd55` | Failed: 106 passed, 16 failed across 122 Chromium/Firefox cases. Failures traced to incorrect expectations/fixture issues in `defer`, native trim descriptor flags, `Array.setItem` thenable result serialization, Array `nestedDOM` support, mobile hide breakpoint, hover alpha support assertion, and zero-size tooltip fixture. No upstream source changes. |
| 2026-11-15 | Run #313, commit `0f1a71a2d9994ba286c51a26c038892c99806d55` | Historical success: 158 passed, 0 failed, 0 skipped; 79 tests × 2 browsers. [Workflow evidence](https://github.com/amrshah/activequery-labs/actions/runs/43639357350). |
| 2026-11-15 | Run #324, commit `c5f52071c476289a18f675e678fd0a6eaea9cc39` | **Success:** 174 passed, 0 failed, 0 skipped; 87 tests × 2 browsers. [Workflow evidence](https://github.com/amrshah/activequery-labs/actions/runs/43644712359). |
| 2026-11-15 | Run #325, commit `5769645f9aa327c627ce58f8dda9a5b40934b8db` | **Success:** 176 passed, 0 failed, 0 skipped; 88 tests × 2 browsers. [Workflow evidence](https://github.com/amrshah/activequery-labs/actions/runs/43644825180). |

Update this table only after retrieving the actual workflow run, job logs and test summary. A successful workflow file commit is not a successful test run.


## Latest execution — run #392

[Workflow #392](https://github.com/amrshah/activequery-labs/actions/runs/43819572529) passed 257 browser cases, 0 failed, 1 skipped; 129 authored tests across Chromium and Firefox. The one skip is the documented Firefox mobile hardware-emulation case. The run includes the CSSOM-level AQCSS flex selector distinction and NodeList setValue source/minified parity.


## Latest execution — run #395

[Workflow #395](https://github.com/amrshah/activequery-labs/actions/runs/43820353410) passed 263 browser cases, 0 failed, 1 skipped; 132 authored tests across Chromium and Firefox. The run includes Element setContent replacement, DocumentFragment, empty-array and invalid-input behavior with source/minified parity.


## Latest execution — run #397

[Workflow #397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) passed 265 browser cases, 0 failed, 1 skipped; 133 authored tests across Chromium and Firefox. It adds source/minified parity for known Array, Object and predicate failure contracts.


## Latest execution — run #399

[Workflow #399](https://github.com/amrshah/activequery-labs/actions/runs/43821478858) passed 267 browser cases, 0 failed, 1 skipped; 134 authored tests across Chromium and Firefox. It adds parity for Array.setItem and Element setText/setHtml/getValue/siblings edge behavior.


## Latest execution — run #401

[Workflow #401](https://github.com/amrshah/activequery-labs/actions/runs/43822000014) passed 269 browser cases, 0 failed, 1 skipped; 135 authored tests across Chromium and Firefox. It adds right-bottom vs middle importance cascade coverage across all AQCSS flex contexts.


## Latest execution — run #403

[Workflow #403](https://github.com/amrshah/activequery-labs/actions/runs/43822473172) passed 271 browser cases, 0 failed, 1 skipped; 136 authored tests across Chromium and Firefox. It verifies the base mobile middle compound selector and independently working responsive middle aliases.


## Latest execution — run #405

[Workflow #405](https://github.com/amrshah/activequery-labs/actions/runs/43822976254) passed 273 browser cases, 0 failed, 1 skipped; 137 authored tests across Chromium and Firefox. It adds getPlugin import/fallback/rejection parity.


## Latest execution — run #397

[Workflow #397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) passed 265 browser cases, 0 failed, 1 skipped; 133 authored tests across Chromium and Firefox. The run adds selected AQJS source/minified defect-parity checks for Array.setSort, Array.i, Object.setValues/hasValues and type predicates.


## Latest execution — run #408

[Workflow #408](https://github.com/amrshah/activequery-labs/actions/runs/43823338803) passed 275 browser cases, 0 failed, 1 skipped; 138 authored tests across Chromium and Firefox. The run adds Array.getIndex and Array.setItem source/minified edge-behavior parity.


## Latest execution — run #409

[Workflow #409](https://github.com/amrshah/activequery-labs/actions/runs/43823498069) passed 277 browser cases, 0 failed, 1 skipped; 138 authored tests across Chromium and Firefox. It adds Function/Element/NodeList then and defer source/minified parity.


## Latest execution — run #413

[Workflow #413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) passed 281 browser cases, 0 failed, 1 skipped; 141 authored tests across Chromium and Firefox. It adds source/minified parity for Element setText falsy values and setHtml falsy innerHTML/outerHTML assignment results.


## Latest execution — run #413

[Workflow #413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) passed 281 browser cases, 0 failed, 1 skipped; 141 authored tests across Chromium and Firefox. The run adds Element setText/setHtml falsy branch and outerHTML assignment-return source/minified parity.


## Latest execution — run #416

[Workflow #416](https://github.com/amrshah/activequery-labs/actions/runs/43824307566) passed 285 browser cases, 0 failed, 1 skipped; 143 authored tests across Chromium and Firefox. The run adds Array.getCount fallback operator and failure-path source/minified parity.


## Latest execution — run #417

[Workflow #417](https://github.com/amrshah/activequery-labs/actions/runs/43824492132) passed 287 browser cases, 0 failed, 1 skipped; 143 authored tests across Chromium and Firefox. It adds lifecycle event mapping source/minified parity.


## Latest execution — run #418

[Workflow #418](https://github.com/amrshah/activequery-labs/actions/runs/43824577065) passed 287 browser cases, 0 failed, 1 skipped; 144 authored tests across Chromium and Firefox. The run validates the current knowledgebase after the AQJS lifecycle event-mapping parity addition in #417.


## Latest execution — run #420

[Workflow #420](https://github.com/amrshah/activequery-labs/actions/runs/43824816097) passed 287 browser cases, 0 failed, 1 skipped; 144 authored tests across Chromium and Firefox. The run validates the knowledgebase update for Array.getCount and lifecycle parity.


## Latest execution — run #422

[Workflow #422](https://github.com/amrshah/activequery-labs/actions/runs/43825270639) passed 289 browser cases, 0 failed, 1 skipped; 145 authored tests across Chromium and Firefox. The run adds NodeList stub source/minified parity for empty and populated collections.


## Latest execution — run #425

[Workflow #425](https://github.com/amrshah/activequery-labs/actions/runs/43825926932) passed 293 browser cases, 0 failed, 1 skipped; 147 authored tests across Chromium and Firefox. The run adds AQJS isJSON predicate edge cases and source/minified parity.


## Latest execution — run #428

[Workflow #428](https://github.com/amrshah/activequery-labs/actions/runs/43826836114) passed 297 browser cases, 0 failed, 1 skipped; 149 authored tests across Chromium and Firefox. It includes AQCSS/AQJS dynamic class interaction coverage and source/minified parity.


## Latest execution — run #429

[Workflow #429](https://github.com/amrshah/activequery-labs/actions/runs/43827183631) passed 297 browser cases, 0 failed, 1 skipped; 149 authored tests across Chromium and Firefox. The run validates the new AQCSS/AQJS integration knowledgebase entry.

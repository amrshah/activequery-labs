# Browser Validation Plan and Current Coverage

Status: test harness committed; execution result has not yet been confirmed from GitHub Actions. Do not describe these tests as passed until a completed run is inspected.

## Test environment

- Runner: GitHub Actions, Ubuntu latest.
- Node: 22.
- Browser engines: Chromium and Firefox.
- Playwright: `@playwright/test` pinned to 1.56.1.
- AQCSS and AQJS are cloned and checked out at the exact source SHAs in `source-baseline.md`.
- Tests run against local copies of the pinned upstream source; the upstream repositories are not modified.

## Current automated coverage

### Source/minified parity

- PostCSS AST comparison checks all AQCSS source and minified rules, selectors, media context and declarations after syntax-preserving whitespace normalization.
- Browser test compares core AQJS selector and Element helper behavior between source and minified module builds.
- CI verifies exact Git blob SHAs for both source and minified files before testing.

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

### AQCSS

- PostCSS structural parse of the pinned source verifies that the stylesheet parses and that expected media queries, custom properties and representative selectors are present (`tests/css-source-parse.spec.js`).
- Acorn AST inventory of AQJS source/minified artifacts verifies exported names, class methods, prototype extension targets and method names (`tests/js-source-parse.spec.js`).

| Test | Expected contract | Coverage file |
|---|---|---|
| Text alignment utility | Computed text alignment is center | `tests/aqcss.spec.js` |
| Circle border utility | Computed radius is non-zero | `tests/aqcss.spec.js` |
| Tablet-prefixed typography | `aq-t-` rule activates at 600px | `tests/aqcss.spec.js` |
| Third-width anomaly | Computed width remains a small fraction, capturing source value without normalizing | `tests/aqcss.spec.js` |
| Xlarge row-gap anomaly | Invalid `2` unitless declaration does not compute as 2px | `tests/aqcss.spec.js` |

## Known gaps in automated coverage

- Constructor alias/prototype mutation is covered for default null and explicit empty-string construction, but not all arbitrary aliases.
- No tests yet for every AQJS method or collection-specific stub.
- No tests yet for `sancha`, `sift` and `watch`.
- No test yet for lifecycle event timing.
- No exhaustive CSS selector catalogue coverage.
- No computed-style tests for theme token duplication, borders and all swatch variants.
- No touch/hybrid device, reduced-motion, short landscape, zoom or accessibility audit.
- No WebKit project yet.

## Execution record

| Date | Commit / run | Result |
|---|---|---|
| 2026-11-14 | Workflow and initial test suite committed | Pending external GitHub Actions confirmation |

Update this table only after retrieving the actual workflow run, job logs and test summary. A successful workflow file commit is not a successful test run.

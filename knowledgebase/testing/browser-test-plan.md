# Browser Validation Plan and Current Coverage

Status: first full browser execution completed with failures; assertion corrections are now committed and a rerun is in progress. Do not describe runtime validation as passed until the corrected run completes.

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
| Mobile hide helper | Pinned media query is malformed and ignored; helper remains visible at 599/600/601px in Chromium/Firefox | `tests/aqcss.spec.js` |
| Third-width anomaly | Computed width remains a small fraction, capturing source value without normalizing | `tests/aqcss.spec.js` |
| Xlarge row-gap anomaly | Invalid `2` unitless declaration does not compute as 2px | `tests/aqcss.spec.js` |

## Known gaps in automated coverage

- Constructor alias/prototype mutation is covered for default null and explicit empty-string construction, but not all arbitrary aliases.
- No tests yet for every AQJS method or collection-specific stub.
- `sancha`, `sift` and `watch` now have authored targeted tests; they remain unexecuted and require review after the first browser run.
- Lifecycle late-registration and callback timing tests have been authored; they remain unexecuted.
- No exhaustive CSS selector catalogue coverage.
- Base border-token and hover alpha computed-style tests have been authored; exhaustive swatch/theme coverage remains outstanding.
- Basic focus-outline, disabled-descendant and hover-only tooltip tests have been authored; touch/hybrid device, reduced-motion, short-landscape, zoom and comprehensive accessibility audits remain outstanding.
- No WebKit project yet.

## Current authored test inventory

- `tests/aqjs.spec.js`: 37 targeted browser tests.
- `tests/aqcss.spec.js`: 17 targeted computed-style/browser tests.
- Additional source-structure and minified-parity specs are present and should be counted/reviewed as part of the first CI execution.
- The workflow is configured for both `push` and `pull_request` to `main`, but the latest commit currently has no reported status checks. Authored tests are not passed tests.

## Execution record

| Date | Commit / run | Result |
|---|---|---|
| 2026-11-14 | Run #171, commit `77a78e44235dbbca6b07320074f4149d6131dd55` | Failed: 106 passed, 16 failed across 122 Chromium/Firefox cases. Failures traced to incorrect expectations/fixture issues in `defer`, native trim descriptor flags, `Array.setItem` thenable result serialization, Array `nestedDOM` support, mobile hide breakpoint, hover alpha support assertion, and zero-size tooltip fixture. No upstream source changes. |
| 2026-11-15 | Commits `9bae1d1`, `625d72e`, `ef68245` | Corrected the identified tests and updated behavior documentation; rerun pending. |

Update this table only after retrieving the actual workflow run, job logs and test summary. A successful workflow file commit is not a successful test run.

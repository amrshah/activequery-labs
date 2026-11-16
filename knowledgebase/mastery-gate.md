# ActiveQuery Mastery Gate

**Status: NOT PASSED.**

The framework is not declared mastered until Gates A–D have objective, independently reviewable evidence. Portal completion is a separate Gate E. Passing a large test suite or producing extensive documentation is not, by itself, mastery.

## Gate A — Source coverage and governance

- [x] Framework philosophy is mapped separately from executable library behavior (`architecture/framework-overview.md`, `architecture/principle-implementation-review.md`).
- [x] AQS, AQI, AQPE and AQKISS concepts are explicitly marked conceptual/unverified where authoritative executable specifications were not found.
- [x] Upstream freshness and source blob identities were rechecked on 2026-11-16 (`source-freshness.md`).
- [x] AQCSS selector rules, class tokens, declarations, custom properties, media-query contexts, responsive token anomalies and documented family-level cascade conflicts are structurally indexed. This is source coverage, not exhaustive runtime validation of every class combination.
- [x] AQJS exports, constructors, static methods and prototype extension families are inventoried.
- [x] Third-party/bundled code is distinguished from AQ-authored code; bundled components and their MIT/ISC notices are listed in `governance/distribution-and-attribution-audit.md`.
- [x] OSL-3.0 distribution conditions, external deployment, source availability, attribution, trademark exclusions, recipient assent and the upstream DCO distinction are documented.
- [x] The portal pipeline stages exact pinned upstream source and license files into the Pages artifact and gates browser fetching behind assent. PR packaging validation passed in [workflow #533](https://github.com/amrshah/activequery-labs/actions/runs/43845146125).
- [ ] Confirm post-merge Pages deployment and independently smoke-test the public portal.

## Gate B — Semantic understanding

- [ ] Every public API has an exact receiver/signature/defaults, input constraints, return shape, side effects, error behavior and async contract.
- [x] Element, NodeList, Array, Document, Window and lifecycle receiver differences are compared in the behavior matrix.
- [x] Global/prototype mutation implications are source-mapped and tested, including constructor alias pollution and native String.trim replacement.
- [x] AQCSS utility naming, responsive prefixes and representative cross-family cascade behavior are mapped to source and browser evidence.
- [x] Selected suspected defects are reproduced and classified as unsafe/unsupported rather than presented as working APIs.
- [ ] Complete remaining API contract gaps, including lifecycle timing/repeated construction, Function.then invalid-callback cases, remaining sancha placeholder variants, and lower-priority NodeList argument matrices.
- [ ] Prove source/minified semantic equivalence across the documented public API surface. Existing parity is substantial but selected, not exhaustive.

## Gate C — Runtime and accessibility validation

- [x] A reproducible Playwright harness runs in Chromium and Firefox against pinned source and minified assets.
- [x] AQCSS AST/source validation and representative responsive computed-style tests pass.
- [x] Representative API, collection, event, mutation, error and edge contracts are browser-tested.
- [x] Latest full browser workflow after PR #18, [#489](https://github.com/amrshah/activequery-labs/actions/runs/43852291933), passed **359 tests with 1 documented skip**.
- [x] Portal preview consent gating, pinned asset loading, theme persistence, keyboard editor-tab navigation, learning guides and narrow viewport behavior passed in the same browser workflow.
- [ ] Comprehensive keyboard/focus/touch/pointer/reduced-motion coverage across the framework is incomplete; selected cases pass, but this is not a full accessibility audit.
- [ ] Add broader assistive-technology checks and complete the remaining AQCSS composition matrix.

## Gate D — Knowledgebase usefulness to a fresh agent

- [x] The 24-question evaluation prompts and separate answer key/scoring rubric are documented (`testing/fresh-agent-evaluation-prompts.md`, `testing/fresh-agent-evaluation-answer-key.md`).
- [ ] A genuinely fresh agent answers AQCSS questions from the knowledgebase alone with citations.
- [ ] A genuinely fresh agent answers AQJS selector/event/DOM/collection questions from the knowledgebase alone with citations.
- [ ] A fresh agent correctly identifies unsupported/stub APIs and documented hazards.
- [ ] Evaluation reaches at least 22/24 with zero critical errors.
- [ ] The separate implementation exercise passes browser tests and source review.

**Important:** the evaluation has not been administered. The current assistant cannot count its own prior-context work as a fresh-agent benchmark.

## Gate E — Clean-room portal proof (separate from mastery)

- [x] A new portal implementation was authored from the knowledgebase under `rebuild/`.
- [x] AQCSS and AQJS guides, responsive component examples and side-by-side HTML/CSS/JS live playground are implemented.
- [x] User code runs in an iframe with `sandbox="allow-scripts"` and no `allow-same-origin`.
- [x] Accessible editor-tab keyboard navigation, theme switching/persistence, responsive layout and learning-guide navigation are browser-tested.
- [x] Pinned upstream source and notice files are staged into the Pages artifact by CI; pull-request packaging validation passed in [workflow #533](https://github.com/amrshah/activequery-labs/actions/runs/43845146125).
- [ ] Confirm the post-merge Pages deployment and public-site smoke test.

## Next work order

1. Verify post-merge Pages deployment and public asset/consent behavior.
2. Reconcile all AQJS closure-matrix rows with the now-merged tests and latest CI evidence.
3. Continue P0 API contract closure and method-level source/minified parity.
4. Complete targeted AQCSS accessibility and composition tests.
5. Run the 24-question benchmark in a genuinely fresh agent/session, without exposing the answer key.
6. Run the separate fresh-agent implementation exercise and independently review the result.

## Declaration rule

Only when Gates A–D pass may the framework knowledge be declared mastered. Gate E remains a separate portal quality/release proof. If any critical gap remains, report it plainly and keep the status **NOT PASSED**.

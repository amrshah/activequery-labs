# ActiveQuery Mastery Gate

**Status: NOT PASSED.**

The mastery label is withheld until every gate below has objective evidence. A large volume of notes is not proof of mastery.

## Gate A — Source coverage

- [x] The framework philosophy is mapped separately from executable library behavior (`architecture/framework-overview.md`, `architecture/principle-implementation-review.md`).
- [x] AQS, AQI, AQPE and AQKISS concepts are explicitly marked conceptual/unverified where authoritative executable specifications were not found.
- [ ] Governance, DCO and OSL-3.0 implications are understood for the intended portal distribution model.
- [x] Upstream freshness and the last source-file commits were rechecked on 2026-11-16; AQCSS, AQJS and Governance default branches still point to the pinned revisions (source-freshness.md).

- [x] Every AQCSS selector rule is inventoried structurally; the PostCSS AST catalog is generated and validated in CI.
- [x] Every unique class token is mapped to rule IDs, selectors and source lines; complete declarations are available in the rule catalog.
- [x] Custom properties are indexed across declarations and `var()` references (26 declared names; 71 names across declarations/references).
- [x] All AQCSS media-query contexts, responsive token-prefix anomalies, family-level declaration/cascade behavior and documented cross-family selector conflicts are source-mapped for the pinned v25.6.0 stylesheet (see `aqcss/media-query-and-selector-map.md` and its linked family maps). This is source coverage, not exhaustive runtime testing of every class combination.
- [x] AQJS export, constructor, static methods and prototype extension method families are inventoried.
- [ ] Third-party/bundled code distinguished from AQ-authored code.
- [x] Licensing and attribution constraints documented, including OSL-3.0 external deployment, third-party notices, trademark exclusions and DCO sign-off requirements.

## Gate B — Semantic understanding

- [ ] Every public API has exact signature, input constraints, return type, side effects and failure behavior.
- [x] AQJS methods that differ between Element, NodeList and other prototypes are explicitly compared in the behavior matrix.
- [x] Global/prototype mutation implications are source-mapped and tested, including default constructor alias pollution and native String.trim replacement.
- [x] AQCSS utility naming and responsive prefixes are mapped from actual media rules and browser tests, including the ineffective mobile-hide helper.
- [ ] Interactions between AQCSS selectors and AQJS methods documented where applicable.
- [ ] Suspected defects reproduced or cleared through tests; no unexplained behavior is presented as guaranteed.
- [x] Public claims about AQI batching/delegation, local scope, AQPE context behavior and AQS continuity are traced to executable source/specification or explicitly scoped as conceptual/unimplemented.
- [ ] Source and minified distributions are proven semantically equivalent across the documented API surface.

## Gate C — Runtime validation

- [x] Minimal reproducible AQJS test harness runs in at least two modern browser engines; latest verified run [#395](https://github.com/amrshah/activequery-labs/actions/runs/43820353410) passed 263 browser cases, with 1 documented Firefox mobile-emulation skip across 132 authored tests.
- [x] AQCSS computed-style tests run at representative narrow, medium and wide viewports (599/600/601, 993 and 1440 CSS px); wider selector-family coverage remains incomplete.
- [ ] Keyboard, focus, touch/pointer and reduced-motion behavior checked where relevant. Selected focus/tooltip keyboard, pointer media-query, reduced-motion and Chromium mobile-emulation tests pass; comprehensive keyboard navigation and assistive-technology coverage remain open.
- [x] Representative selector/API examples have passing expected-result tests in Chromium and Firefox.
- [x] Representative error paths, empty results, invalid input, multiple matches and collection behavior have passing tests.
- [x] Runtime pass claims are tied to retained GitHub Actions logs and generated catalog artifacts.

## Gate D — Knowledgebase usefulness to a fresh agent

- [ ] A fresh agent can answer representative AQCSS selector questions from the knowledgebase alone.
- [ ] A fresh agent can implement representative layout and typography examples without repeatedly opening upstream source.
- [ ] A fresh agent can use AQJS selector, event, DOM and collection APIs correctly.
- [ ] A fresh agent can identify unsupported/stub APIs and known hazards.
- [ ] Answers cite the knowledgebase and point back to upstream source.
- [ ] Fresh-agent evaluation scores at least 22/24 with zero critical errors.
- [ ] Implementation exercise passes browser tests and source review.
- [x] Retrieval evaluation has documented prompts, expected answers and scoring (`testing/fresh-agent-evaluation-prompts.md` and `testing/fresh-agent-evaluation-answer-key.md`); administration and scoring remain pending.

## Gate E — Build-from-scratch proof

- [x] A new, clean portal implementation is produced from the knowledgebase, not copied from the current portal (`rebuild/` on the clean-room branch).
- [x] The new portal demonstrates AQCSS and AQJS usage accurately, including a documented third-width limitation and a tested AQJS event helper.
- [x] Components are keyboard-labelled, responsive and professionally designed; narrow viewport behavior is covered by Playwright.
- [x] The live playground supports side-by-side HTML/CSS/JS editing and preview, with `sandbox="allow-scripts"` and no `allow-same-origin`.
- [x] The portal is tested end-to-end in Chromium and Firefox, including a narrow mobile viewport and the AQJS event bridge ([run #369](https://github.com/amrshah/activequery-labs/actions/runs/43649159878)).
- [x] Existing portal is not treated as a reference implementation for the rebuild; the new implementation is authored from the knowledgebase.
- [ ] Light/dark modes are evaluated as a later design phase, after the framework mastery gate.

Release boundary: the clean-room branch is CI-validated, but public Pages deployment is intentionally withheld pending OSL-3.0 distribution review. The light/dark evaluation and fresh-agent retrieval benchmark remain open.

## Declaration rule

Only when A–D pass may the framework knowledge be declared mastered. Gate E is the separate proof that the knowledge can be applied to recreate a professional portal from scratch. If any critical gap remains, state the gap and keep the status **NOT PASSED**.

# ActiveQuery Mastery Gate

**Status: NOT PASSED.**

The mastery label is withheld until every gate below has objective evidence. A large volume of notes is not proof of mastery.

## Gate A — Source coverage

- [ ] The framework philosophy is mapped separately from executable library behavior.
- [ ] AQS, AQI, AQPE and AQKISS concepts have authoritative specifications or are explicitly marked conceptual/unverified.
- [ ] Governance, DCO and OSL-3.0 implications are understood for the intended portal distribution model.
- [ ] Upstream freshness and the last source-file commits are checked before each major adoption/rebuild milestone.

- [ ] Every AQCSS selector rule inventoried from a CSS-aware parse.
- [ ] Every unique class selector mapped to its complete rule block and source line(s).
- [ ] Every custom property inventoried with declaration and usage sites.
- [ ] All media queries and selector overrides mapped.
- [ ] AQJS export, constructor, static methods and every prototype extension fully inventoried.
- [ ] Third-party/bundled code distinguished from AQ-authored code.
- [ ] Licensing and attribution constraints documented.

## Gate B — Semantic understanding

- [ ] Every public API has exact signature, input constraints, return type, side effects and failure behavior.
- [ ] AQJS methods that differ between Element, NodeList and other prototypes are explicitly compared.
- [ ] Global/prototype mutation implications understood.
- [ ] AQCSS utility naming and responsive prefixes mapped from actual media rules, not assumptions.
- [ ] Interactions between AQCSS selectors and AQJS methods documented where applicable.
- [ ] Suspected defects reproduced or cleared through tests; no unexplained behavior is presented as guaranteed.

## Gate C — Runtime validation

- [ ] Minimal reproducible AQJS test harness runs in at least two modern browser engines.
- [ ] AQCSS visual tests run at representative narrow, medium and wide viewports.
- [ ] Keyboard, focus, touch/pointer and reduced-motion behavior checked where relevant.
- [ ] Selector/API examples have passing expected-result tests.
- [ ] Error paths, empty results, invalid input, multiple matches and collection behavior tested.
- [ ] No runtime test is described as passed unless its output is retained.

## Gate D — Knowledgebase usefulness to a fresh agent

- [ ] A fresh agent can answer representative AQCSS selector questions from the knowledgebase alone.
- [ ] A fresh agent can implement representative layout and typography examples without repeatedly opening upstream source.
- [ ] A fresh agent can use AQJS selector, event, DOM and collection APIs correctly.
- [ ] A fresh agent can identify unsupported/stub APIs and known hazards.
- [ ] Answers cite the knowledgebase and point back to upstream source.
- [ ] Retrieval evaluation has documented prompts, expected answers and scoring.

## Gate E — Build-from-scratch proof

- [ ] A new, clean portal implementation is produced from the knowledgebase, not copied from the current portal.
- [ ] The new portal demonstrates AQCSS and AQJS usage accurately.
- [ ] Components are accessible, responsive and professionally designed.
- [ ] The live playground supports side-by-side source editing and preview, with isolated execution.
- [ ] The portal is tested end-to-end on mobile and desktop.
- [ ] Existing portal is not treated as a reference implementation for the rebuild.
- [ ] Light/dark modes are evaluated as a later design phase, after the framework mastery gate.

## Declaration rule

Only when A–D pass may the framework knowledge be declared mastered. Gate E is the separate proof that the knowledge can be applied to recreate a professional portal from scratch. If any critical gap remains, state the gap and keep the status **NOT PASSED**.

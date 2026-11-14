# ActiveQuery Knowledgebase — Agent Task Routing

1. Read `knowledgebase/README.md` and `source-baseline.md`.
2. For framework architecture/initialization, read `architecture/aqjs-runtime-model.md`.
3. For AQJS usage, read `aqjs/api-inventory.md`; if the method is marked suspicious/unverified, do not recommend it without tests.
4. For AQCSS selectors, read `aqcss/selector-families.md`; this is currently a taxonomy, not a complete class-by-class API. Use upstream source for any missing selector until the catalogue is complete.
5. For integration patterns, read `integration/README.md` when it exists; otherwise mark the knowledge gap.
6. For visual behavior or browser compatibility, require a runtime test record. Source inspection alone is not proof of rendered behavior.
7. Never claim framework mastery until all acceptance gates in `mastery-gate.md` pass.

## Do not do these things

- Do not recreate the Labs portal yet.
- Do not add dark mode yet.
- Do not redesign or patch upstream AQCSS/AQJS source.
- Do not infer that a similarly named class/API has expected conventional behavior.
- Do not conceal likely upstream defects; report and isolate them.
- Do not call community-authored components native AQ features.

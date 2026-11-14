# Instructions for AI agents using ActiveQuery Labs

1. Read `../knowledgebase/README.md` first. The knowledgebase is the canonical technical reference.
2. Read `../knowledgebase/agent-reference/task-routing.md` and the relevant domain reference before implementation.
3. Check `../knowledgebase/source-baseline.md` and `../knowledgebase/mastery-gate.md` for source identity and research status.
4. Reopen upstream source only when the knowledgebase marks a gap, the pinned SHA/version differs, a discrepancy is found, or an upstream release may affect the requested behavior.
5. When source is re-inspected, add the verified finding and source anchor to the knowledgebase so future agents do not repeat the research.
6. Keep upstream AQCSS/AQJS source unmodified. Preserve license headers and third-party notices if source redistribution is explicitly required and permitted.
7. In code reviews, identify AQCSS selectors, AQJS APIs, browser-native behavior and custom additions separately.
8. Do not call a component "native AQCSS" unless it exists in the upstream source.
9. Prefer semantic HTML and progressive enhancement. Test keyboard operation, responsive layouts and real browser behavior.
10. Never claim browser or CI validation unless the corresponding test actually ran and passed.
11. Never declare ActiveQuery mastery unless every required gate has objective evidence.
12. When upstream versions change, update source notes, source hashes, traceability and machine-readable indexes together.

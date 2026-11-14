# ActiveQuery Research Baseline — Superseded

This early baseline has been superseded by the source-pinned, agent-oriented knowledgebase.

Start here: [ActiveQuery AI Knowledgebase](../knowledgebase/README.md)

Current source identities and hashes are recorded in:
- [Source baseline](../knowledgebase/source-baseline.md)
- [Source freshness](../knowledgebase/source-freshness.md)
- [Source traceability](../knowledgebase/source-traceability/index.md)

**Important AQJS warning:** `new ActiveQuery()` with no argument triggers a global/prototype mutation because the default `null` passes the constructor's alias regex. The explicit empty-string form `new ActiveQuery("")` avoids that particular constructor branch, but importing AQJS still modifies native prototypes, including replacing `String.prototype.trim`. See [AQJS runtime model](../knowledgebase/architecture/aqjs-runtime-model.md).

The knowledgebase remains in progress. Do not treat this repository's documentation as a mastery declaration until every gate in [mastery-gate.md](../knowledgebase/mastery-gate.md) has passed.

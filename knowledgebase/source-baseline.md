# Upstream Source Baseline

Snapshot date: 2026-11-14

This file pins the exact upstream source revisions used for the current systematic examination. Hashes are Git blob SHAs returned by GitHub for the fetched files. A later source change invalidates claims only where the changed code is relevant; agents must compare hashes before relying on this baseline.

| Project | Repository | Branch | File | Version in source header / README | Blob SHA | Size |
|---|---|---|---|---|---|---:|
| AQCSS | https://github.com/ActiveQuery/CSS | main | ActiveQuery.css | 25.6.0 | `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62` | 118,361 chars |
| AQJS | https://github.com/ActiveQuery/JS | main | ActiveQuery.js | 25.6.0 | `b8ec9e5be8668d048eea3385cd9012dfddb69cf0` | 44,399 chars |
| AQCSS license | https://github.com/ActiveQuery/CSS | main | LICENSE.txt | 25.6.0 | `95913ab0528af615935ad360fe4ab42feb09ed3d` | 12,960 chars |
| AQJS license | https://github.com/ActiveQuery/JS | main | LICENSE.txt | 25.6.0 | `28eb6b57f17f9af993123b943fa6eae63be43ac2` | 13,841 chars |

## Licensing and third-party notices

- Both upstream projects identify the Open Software License 3.0 (OSL-3.0).
- AQCSS README/source identifies W3CSS and Normalize.css as third-party components; preserve their separate license notices.
- AQJS source identifies Array.sortBy v1.2.2 (MIT) and is-json v2.0.1 (ISC) as third-party notices.
- Never relabel upstream code as MIT or assume the Labs repository's license applies to upstream assets.
- Preserve upstream copyright and license notices if upstream source is redistributed.

## Governance and licensing context

The Governance repository identifies the Compliance Framework v21.1 and provides an Ethical Source Policy, Code of Conduct Policy, DCO and OSL-3.0 license. The OSL text includes an External Deployment provision that treats making the Original Work or Derivative Works available over a network to others as distribution under section 1(c). This is a material consideration for a public portal that bundles or deploys upstream source; obtain legal review before deciding a distribution model. See `architecture/governance-and-licensing.md`.

The public ActiveQuery framework overview describes a philosophy plus independent libraries and names AQS, AQI, AQPE, AQKISS, AQDB, AQPHP, AQPY and AQML. The inspected public repositories in this research provide concrete AQCSS and AQJS implementations; other named layers remain conceptual/unverified until their authoritative specifications and code are located. See `architecture/framework-overview.md`.

## First-pass structural observations

### AQCSS

- Main stylesheet: 1,808 lines, approximately 118 KB.
- It contains broad base/framework selectors as well as the `aq-` namespace.
- A raw token scan found 1,818 distinct class-like tokens, but this is **not** a valid selector count: it includes class names referenced in selectors, comments, and other contexts. The authoritative inventory must come from parsed selector rules with provenance.
- Source includes multiple media-query regions. A complete breakpoint and cascade map remains pending.
- The CSS must be studied as a whole: variables, base resets, inherited W3CSS-derived behavior, AQ-specific utilities, responsive overrides, pseudo-classes and attribute selectors all matter.

### AQJS

- Main source: 1,152 lines, approximately 44 KB.
- It exports a named `ActiveQuery` class using `export const ActiveQuery = Object.freeze(class { ... })`.
- The implementation extends native prototypes through `ActiveQuery.extend`, including Element, NodeList, Array, String, Number, Object, Document, Window and Function surfaces.
- A constructor argument can install a global selector alias and nested-query helpers on several prototypes. This is a global side effect and must be documented carefully.
- The static `DOM(selector)` helper returns `null`, one Element, or a NodeList depending on match count.
- `nestedDOM(selector)` has separate behavior for Element/Document and collection contexts.
- Additional method families include type predicates, lifecycle/event helpers, DOM mutation helpers, collection methods, templating (`sancha`), filtering (`sift`) and mutation observation (`watch`).
- This is an inventory, not a complete API contract. Method signatures, edge cases, return behavior and defects remain under examination.

## Status

**Research status: in progress. Not a mastery declaration.**

Completed:
- Confirmed access to the upstream AQCSS, AQJS and Labs repositories.
- Retrieved the exact main stylesheet and JavaScript source.
- Recorded source blob SHAs, source sizes, versions and license files.
- Began line-by-line AQJS examination and structural inventory.
- Read the existing Labs research baseline, agent instructions and machine-readable index.

Outstanding:
- Complete AQCSS selector/rule/cascade catalogue.
- Complete AQJS public and prototype API catalogue.
- Trace implementation details and edge cases.
- Build reproducible browser tests and validate behavior.
- Reconcile and expand existing agent skills/indexes to point to the completed knowledgebase.
- Run retrieval-based acceptance tests with a fresh-agent workflow.

Do not use this file alone as an API reference.

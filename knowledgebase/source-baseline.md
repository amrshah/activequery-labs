# Upstream Source Baseline

Snapshot date: 2026-11-14

This file pins the exact upstream source revisions used for the current systematic examination. Hashes are Git blob SHAs returned by GitHub for the fetched files. A later source change invalidates claims only where the changed code is relevant; agents must compare hashes before relying on this baseline.

| Project | Repository | Branch | File | Version in source header / README | Blob SHA | Size |
|---|---|---|---|---|---|---:|
| AQCSS | https://github.com/ActiveQuery/CSS | main | ActiveQuery.css | 25.6.0 | `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62` | 118,361 chars |
| AQJS | https://github.com/ActiveQuery/JS | main | ActiveQuery.js | 25.6.0 | `b8ec9e5be8668d048eea3385cd9012dfddb69cf0` | 44,399 chars |
| AQCSS minified | https://github.com/ActiveQuery/CSS | main | ActiveQuery.min.css | 25.6.0 | `bdda032d530661c32d9a9351a4ae95219347f081` | 108,833 chars |
| AQJS minified | https://github.com/ActiveQuery/JS | main | ActiveQuery.min.js | 25.6.0 | `594d778cd5fefe2caa039a7904343e385b77a50c` | 23,373 chars |
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

## Last source-file commits observed

- AQCSS `ActiveQuery.css`: commit `b1120e47027ceba6e6c8b8bf7796af4f6f002f1d`, 2025-06-28.
- AQJS `ActiveQuery.js`: commit `5dd9145d6f36ad7e3966b6f55ecd6fcbe15003c7`, 2025-07-05.
- Latest repository commits observed: AQCSS `6f479f6a3f315d2623af79dd49c84cb379b52473` (2025-07-05), AQJS `adb1b19770ca68840dc2f9e62de556a324bee2fa` (2025-07-05), Governance `ab369232ac801cfbf769d9838c07d4ea8846dfd5` (2025-06-28).
- The published sources appear unchanged since mid-2025 in the commit history examined. See `source-freshness.md`.

## First-pass structural observations

### AQCSS

- Main stylesheet: 1,808 lines, approximately 118 KB.
- It contains broad base/framework selectors as well as the `aq-` namespace.
- A brace-aware lexical rule-prelude scan found 1,417 selector rule blocks and 1,813 unique class tokens, plus 26 unique declared custom-property names (71 unique names appear across declarations and var() references; 45 are reference-only). The earlier lexical count included 20 BEM selector modifiers and has been corrected against PostCSS AST. The lexical indexes are supplemented by a PostCSS AST catalog generated and checked in CI. The rule catalog preserves complete declaration blocks, media context and source lines; the class-token index maps 1,813 tokens to rule IDs/lines/selectors; the corrected custom-property index records 26 declared names and 71 names across declarations/references. Cascade and computed behavior still require browser-specific interpretation.
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
- Retrieved and pinned exact source/minified assets, blob SHAs, source sizes, versions and license files.
- Built the 1,417-rule AQCSS selector/declaration catalog, 1,813-token class index and custom-property declaration/reference index; generated PostCSS AST catalogs in CI.
- Inventoried the AQJS named export, constructor, static/instance methods and prototype extension targets.
- Added 70 authored Playwright tests; run #204 passed 140 Chromium/Firefox browser cases.
- Documented 73 source findings, traceability anchors, governance/license context and third-party provenance findings.

Outstanding:
- Finish the AQCSS cascade/override map and exhaustive selector-family semantic review; structural selector/rule/token/property indexes now exist.
- Finish AQJS per-method contracts and edge-case coverage; the public/prototype method inventory exists, but some signatures/branches remain untested.
- Expand browser coverage beyond the current 70 authored tests / 140 passing Chromium+Firefox cases, especially touch/hybrid, reduced motion, broader viewport matrices and remaining APIs.
- Complete AQCSS third-party provenance attribution beyond first-pass exact matches.
- Reconcile and expand existing agent skills/indexes to point to the verified knowledgebase.
- Run retrieval-based acceptance tests with an independent fresh-agent workflow; not yet executed.

Do not use this file alone as an API reference.

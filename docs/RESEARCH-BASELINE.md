# ActiveQuery source research baseline

Research snapshot: 2026-11-14. This document records directly inspected upstream repository content, not assumptions about unpublished behavior.

## Repositories inspected

- AQCSS: https://github.com/ActiveQuery/CSS — default branch `main`.
- AQJS: https://github.com/ActiveQuery/JS — default branch `main`.
- Governance: https://github.com/ActiveQuery/Governance — default branch `main`.

## AQCSS evidence

The upstream README identifies AQCSS v25.6.0 and describes it as mobile-first, responsive, dependency-free, and cross-browser. The inspected `ActiveQuery.css` source is approximately 118 KB and its copyright header identifies OSL-3.0. Its header explicitly requires the copyright/third-party notice to remain intact.

The inspected stylesheet includes W3CSS v4.10 and Normalize.css v8.0.1 notices. The README also identifies these components and points to `LICENSE.txt`.

Verified selector examples found in the source include:

- Layout: `.container`, `.panel`, `.row`, `.row-padding`, `.cell-row`, `.bar`, `.bar-item`.
- Typography: `.aq-text--serif`, `.aq-text--san-serif`, `.aq-text--center`, `.aq-text--left`, `.aq-text--right`, `.aq-text--fw-400`, `.aq-text--fw-700`, `.aq-text--h1` through `.aq-text--h5`.
- Borders: `.aq-border`, `.aq-border--top`, `.aq-border--bottom`, `.aq-border--circle`, `.aq-border--round`.
- Theme tokens: `.aq-swatch--primary`, `.aq-swatch--secondary`, `.aq-swatch--accent`, `.aq-swatch--info`, `.aq-swatch--success`, `.aq-swatch--warning`, `.aq-swatch--alert`, `.aq-swatch--mute`, plus matching text and border variants.
- Responsive media rules observed at 600px, 601–992px, 993–1439px and 1440px, plus pointer/hover and orientation rules.

These are source-presence observations. Before documenting precise visual or behavioral semantics, each selector should be tied to its full rule block and a browser test.

## AQJS evidence

The inspected `ActiveQuery.js` source is approximately 44 KB. Its header identifies AQJS v25.6.0, OSL-3.0, copyright and third-party notices. The file exports a named `ActiveQuery` class:

```js
import { ActiveQuery } from "ActiveQuery.js";
const aq = new ActiveQuery();
```

The constructor sets instance references to static helpers including `DOM`, `nestedDOM`, `extend`, `isEmpty`, `exit` and `keepOn`. It also registers a `readystatechange` listener and executes queued `initlog` callbacks when the document reaches `complete`. If constructed with a qualifying string argument, the source assigns a global selector helper and adds nested selector helpers to Element, NodeList and Object prototypes. Do not use that optional prototype extension without first understanding its global impact.

The source defines a static `DOM(selector)` helper that returns null for no matches, a single element for one match, or a NodeList for multiple matches. `nestedDOM(selector)` supports Element, Document, NodeList and HTMLCollection contexts.

The source also contains instance type predicates including `isArray`, `isArraySet`, `isObjectMap`, `isArrayLike`, `isString`, `isObject`, `isObjectLiteral`, `isFunction`, `isClass`, `isNodeList`, `isSet`, `isArgument`, `isJSON`, and `isEmpty`. These names are inventory only; signatures and edge cases require further method-by-method inspection and tests.

## Governance

The inspected Governance README identifies the ActiveQuery Compliance Framework v21.1 and links to Ethical Source Policy, Code of Conduct Policy and Developer Certificate of Origin documents. Governance and licensing details should be read from the specific upstream files before making contribution or redistribution claims.

## Licensing and attribution rules for this portal

- Do not modify or relicense upstream AQCSS/AQJS source files.
- Preserve upstream headers and notices if source files are ever redistributed.
- Keep third-party license obligations visible.
- Treat original portal-authored examples as separate works, with their own clearly stated license.
- OSL-3.0 is not MIT; do not describe upstream code as MIT.
- This portal is independent community documentation and is not the official ActiveQuery website.

## Research limitations

This baseline is not a complete API reference. It is a verified starting point based on the exact README, source and license files inspected. Every additional documented method, selector, behavior, or compatibility claim needs source-level review and reproducible validation.

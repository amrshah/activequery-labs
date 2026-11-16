# AQJS Source and Minified Semantic Parity Audit

Source artifact: `ActiveQuery.js`, blob SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`, 44,399 bytes.
Minified artifact: `ActiveQuery.min.js`, blob SHA `594d778cd5fefe2caa039a7904343e385b77a50c`, 23,373 bytes.
Both artifacts are from the ActiveQuery/JS repository's current main content at inspection time and match the pinned blob identifiers already recorded by this knowledgebase.

## What is established

The existing CI AST catalog validates structural parity for exported names, class method names/kinds/static flags, extension targets and extension method names/descriptor kinds. Existing Playwright coverage compares selected behaviors in Chromium and Firefox.

A direct source/minified inspection of the high-risk methods below found the same material control flow and observable hazards in both artifacts:

| Method / family | Source observation | Minified observation | Current conclusion |
|---|---|---|---|
| Array `i` | Calls `ActiveQuery.isNaN` before indexing | Same reference and guard | Hazard preserved; no mismatch seen. |
| Array `getIndex` | `=` branch assigns in predicate | Same assignment expression | Defect preserved; no mismatch seen. |
| Array `getCount` | Same operator branches and default split | Same branches and split | No mismatch seen; default branch still needs runtime cases. |
| Array `setSort` | Assigns undeclared `aVal`, `bVal` | Same undeclared assignments | Hazard preserved; strict-mode test pending. |
| Array `setItem` | Truthy either argument returns early; only both falsy reach splice | Equivalent conditional expression | No mismatch seen. |
| Element `siblings` | Default references `target` | Same identifier | Hazard preserved. |
| Element `setAdjacent` | Truthy args return early | Same guard | No mismatch seen. |
| Element `setHtml` | Truthy HTML returns early | Equivalent conditional expression | No mismatch seen. |
| Element `getValue` | Boolean substring modes, including inverted index behavior when mode true | Equivalent nested conditional | No mismatch seen. |
| NodeList `siblings` | Double-indexes first Element | Same double indexing | Hazard preserved. |
| NodeList stubs | Empty bodies or return-this bodies | Same empty/return-this bodies | No mismatch seen for inspected stub set. |
| Object `setValues` / `hasValues` | Guard and missing static `ActiveQuery.isNaO` call | Same guard and call | Hazard preserved. |
| Predicates | Unqualified identifiers and `x` reference | Same identifier references | Hazard preserved. |
| `sancha`, `sift`, `watch` | Same undeclared identifiers, guard/callback paths and observer behavior in inspected sections | Minified excerpt retains those paths | No material mismatch observed in inspected paths. |

## Runtime parity evidence added

Playwright test `AQJS source and minified builds preserve Element value/child and NodeList event contracts` was added in commit `5769645f9aa327c627ce58f8dda9a5b40934b8db` and passed in [run #325](https://github.com/amrshah/activequery-labs/actions/runs/43644825180). It compares both builds for Element `setValue` truthy/falsy behavior, generic-Element value-property creation, `setChild` array append/receiver identity, Element `then` callback return, NodeList event registration and empty-collection return, and Array `getCount` default-operator behavior. The complete run passed 176 browser cases across 88 authored tests in Chromium and Firefox. A second fixture, `AQJS source and minified builds preserve Array then and Document/Window event contracts`, passed in [run #327](https://github.com/amrshah/activequery-labs/actions/runs/43645400008). It compares direct Array `then` callback return and invalid callback behavior, Document/Window event dispatch, and invalid-argument receiver identity. Run #327 passed 182 browser cases across 91 authored tests in Chromium and Firefox. A third fixture, `AQJS source and minified builds preserve early lifecycle and initlog timing`, passed in [run #340](https://github.com/amrshah/activequery-labs/actions/runs/43645942215). It verifies `ready`, `init`, `run`, and constructor `initlog` completion callbacks in an isolated iframe. Run #340 passed 186 browser cases across 93 authored tests in Chromium and Firefox. Two further parity fixtures passed in [run #348](https://github.com/amrshah/activequery-labs/actions/runs/43646121898): Array `getCount` loose/strict/substring/default branches, `getIndex` assignment branch, `has`, `getIndexs`, and Element/NodeList attribute, style and class mutations. Run #348 passed 194 browser cases across 97 authored tests in Chromium and Firefox.

Run [#392](https://github.com/amrshah/activequery-labs/actions/runs/43819572529) adds NodeList setValue source/minified parity for input, checkbox .value, select and textarea values, falsy clearing, generic-element exclusion and empty-list identity. Run [#395](https://github.com/amrshah/activequery-labs/actions/runs/43820353410) adds Element setContent parity for single Node, Array, empty Array, DocumentFragment, invalid string and partial-append failure behavior. Run [#397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) adds source/minified parity for selected known defect contracts: Array.setSort ReferenceError, Array.i TypeError, Object.setValues/hasValues TypeErrors, and isNaS/isNaF predicate outcomes. Run [#408](https://github.com/amrshah/activequery-labs/actions/runs/43823338803) adds source/minified parity for Array.getIndex's equals-branch assignment behavior and Array.setItem's truthy index/value no-op behavior. Run [#413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) adds source/minified parity for Element.setText empty-string/zero/false/null no-op behavior and Element.setHtml falsy assignment return values, null-to-empty innerHTML conversion, and outerHTML host removal. Run [#416](https://github.com/amrshah/activequery-labs/actions/runs/43824307566) adds source/minified parity for Array.getCount's unrecognised-operator fallback, no-match case and TypeError when the substring branch receives a non-string property value. Run [#417](https://github.com/amrshah/activequery-labs/actions/runs/43824492132) adds source/minified parity for instance lifecycle event mapping (`offline`, `online`, `close`, unknown event) and receiver identity. Run [#417](https://github.com/amrshah/activequery-labs/actions/runs/43824492132) adds source/minified parity for instance lifecycle event mapping (`offline`, `online`, `close`, unknown event) and receiver identity. Run [#422](https://github.com/amrshah/activequery-labs/actions/runs/43825270639) adds source/minified parity for NodeList no-op stubs on empty and populated collections, confirming same-collection returns, no mutation, `getStyles()` undefined and `getClasses()` returning the receiver. This is a meaningful additional sample, not a substitute for a method-by-method parity harness.

## Limits — do not overclaim

This is a focused manual comparison, not a complete method-by-method semantic equivalence proof.

- AST parity does not compare expression semantics, string constants, branch ordering, exception behavior or side effects.
- A handful of method bodies have been inspected side-by-side; not every public method has a canonical observation fixture.
- Existing Playwright tests compare selected source/minified outcomes, not the complete public API. Array `then` was exercised only through direct callback invocation; Promise resolver assimilation remains intentionally untested until a safely terminable isolated fixture is designed.
- Browser differences, timing, event ordering, Promise assimilation and global pollution require controlled fixtures.
- A manual visual comparison can miss subtle minifier-induced differences.

## Required completion work

1. Build a generated fixture registry keyed by API surface and method, covering all class methods and all prototype extension methods.
2. Run each fixture twice in isolated pages: once importing source and once importing minified build.
3. Normalize observations to JSON-safe values: primitive result, receiver identity marker, exception name, relevant DOM snapshot, event count and explicitly selected global keys.
4. For async methods, capture settled/rejected state with bounded timeouts; never allow a thenable test to hang the runner.
5. Include normal, empty, falsy, invalid, missing callback, repeated call and cross-realm inputs where applicable.
6. Treat any unexplained mismatch as a release-blocking finding; preserve known defects as expected parity observations rather than “fixing” one build.
7. Keep the parity gate open until all public API rows have an explicit fixture or a documented reason a fixture is not meaningful.

## Current gate status

- Structural AST parity: existing CI evidence.
- Selected runtime parity: existing test evidence, coverage partial.
- Focused manual source/minified review: completed for the high-risk methods listed above.
- Full method-level semantic parity: **NOT PROVEN**.
- Mastery Gate B parity criterion remains unchecked.

References: [API inventory](api-inventory.md), [contract closure matrix](api-contract-closure-matrix.md), [runtime validation matrix](../testing/runtime-validation-matrix.md), [mastery gate](../mastery-gate.md).


Run [#397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) adds source/minified parity for Array.setSort's strict-module ReferenceError, Array.i's TypeError from the missing ActiveQuery.isNaN static method, Object.setValues/hasValues TypeErrors, and selected isNaS/isNaF predicate outputs. This closes parity for these specific failure contracts, not all Array/Object/predicate inputs.


Run [#399](https://github.com/amrshah/activequery-labs/actions/runs/43821478858) adds source/minified parity for Array.setItem's truthy no-op and both-falsy insertion, Element setText's empty-string no-op, setHtml's truthy-input no-op, getValue's default and inverted mode, and Element siblings next/prev/default ReferenceError behavior. This is selected behavior parity, not a complete method-by-method proof.


Run [#405](https://github.com/amrshah/activequery-labs/actions/runs/43822976254) adds source/minified parity for getPlugin: approved fixture import, non-string fallback to the instance, and propagation of a rejected dynamic import. This does not validate untrusted module specifiers or create an allowlist; callers must enforce that security boundary.


Run [#409](https://github.com/amrshah/activequery-labs/actions/runs/43823498069) adds source/minified parity for Function, Element and NodeList then callback receiver/return contracts and defer timer/callback-array behavior. This is selected parity evidence; unusual callback inputs and lifecycle replay remain pending.


Run [#413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) adds source/minified parity for Element setText falsy inputs and setHtml falsy innerHTML assignments (empty string, zero, false, null), assignment return values, and outerHTML host removal. This closes the selected falsy branch set; other HTML-sink security and serialization cases remain outside this fixture.


Run [#417](https://github.com/amrshah/activequery-labs/actions/runs/43824492132) adds source/minified parity for instance lifecycle offline/online/close event mapping, ignored unknown names, and the invariant that all registration calls return the same ActiveQuery instance.

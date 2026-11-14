# AQJS API Contract Closure Matrix

Source: ActiveQuery.js SHA b8ec9e5be8668d048eea3385cd9012dfddb69cf0.
Status: active closure matrix derived from the API inventory, behavior matrix and runtime validation matrix. Each row records remaining work; passed test evidence is identified explicitly.

## Objective

Every public method should have its exact receiver and signature/defaults, accepted inputs, return type and receiver identity, mutation/global side effects, normal/empty/falsy/invalid-input behavior, errors and async behavior, and source/minified comparison where relevant. Do not repair upstream AQJS while documenting or testing it.

## Newly authored coverage (passed in run #324)

Six additional Playwright tests were added in `tests/aqjs.spec.js` and all passed in run [#324](https://github.com/amrshah/activequery-labs/actions/runs/43644712359): Element `setValue`, `setChild`, `then` and `fax`; NodeList no-op stubs and `on` validation; and Array `getCount` default-operator delimiter/missing-property behavior. The initial test assumptions were corrected after source review; no upstream code was changed. A further source/minified behavior fixture was added in commit `5769645f9aa327c627ce58f8dda9a5b40934b8db` and passed in [run #325](https://github.com/amrshah/activequery-labs/actions/runs/43644825180). It compares Element value/child/then behavior, NodeList event behavior and the Array `getCount` default branch across source and minified builds. Run [#327](https://github.com/amrshah/activequery-labs/actions/runs/43645400008) then added `getPlugin` rejected-import coverage, invalid-argument `Document.on`/`Window.on` receiver checks, and a source/minified fixture for Array `then` direct callback semantics plus document/window event registration. The full run passed 182 browser cases across 91 authored tests. This remains selected-method parity, not full semantic proof.

## Priority 0 — unresolved API contracts

| Surface | Missing contract | Required test focus | Current evidence |
|---|---|---|---|
| getPlugin(name) | allowed input, rejection path, import errors, security boundary | approved module, invalid type, rejected module, allowlist boundary | approved fixture, non-string fallback and rejected import TypeError passed in runs #313/#327; allowlist/security boundary remains an application responsibility and is not tested |
| Array.i | guard and index coercion | default, integer/string index, out-of-range, falsy | a direct call reproduces `ReferenceError` because `ActiveQuery.isNaN` is undefined; tested in the existing browser suite, but normal indexing remains unavailable |
| Array.getCount | full default-operator grammar and malformed input behavior | each operator, delimiter/no-delimiter, missing property, no match, multiple matches | delimiter, no-delimiter and missing-property cases passed in run #324; other operator shapes pending |
| Array.then | Promise resolver assimilation | callback, missing callback, non-function callback, thenable resolution; isolate hang risk | direct callback result, missing/non-function callback and source/minified parity passed in run #327; Promise resolver assimilation remains untested because the self-thenable can hang resolution |
| Element.setValue | falsy clearing and supported element types | input/select/textarea/checkbox; zero, false, empty string; generic Element | truthy/falsy input and generic Element property creation passed in run #324; full control-type matrix pending |
| Element.setChild | single/array append and invalid node handling | Element, fragment, array, empty array, invalid member | single Element, array and empty array passed in run #324; fragment/invalid member pending |
| Element.then | callback and receiver/return semantics | callable, absent/non-function callback, returned value | callback result and missing/non-function callback passed in run #324 |
| Element.fax | FORM behavior incomplete | form vs non-form, controls, submit semantics; likely classify unsupported | FORM returns undefined and non-FORM returns receiver, passed in run #324; form behavior remains unsupported |
| NodeList.i | indexing and guard semantics | zero/one/multiple, invalid index, empty list | index 0 and invalid string guard passed in run #313; out-of-range/empty collection pending |
| NodeList.siblings | current behavior likely throws | next/prev/default with 0/1/multiple members | next/default TypeError reproduced in run #313; preserve as unsupported |
| NodeList stubs | exact no-op return values and coverage | each stub with normal args; assert identity/no mutation/undefined | all identified no-op stubs invoked with representative arguments and passed in run #324; additional input variations pending |
| NodeList.on | event validation and return value | valid/invalid event, empty and non-empty collections, callback invocation | valid/invalid arguments, empty collection identity and listener dispatch passed in run #324 |
| Document/Window.on | event validation and return value | valid/invalid event, missing callback, listener cleanup limits | custom event dispatch passed in run #313; invalid event/callback receiver identity and source/minified parity passed in run #327 |
| Lifecycle on | early/late registration and replay semantics | before/after DOMContentLoaded/load/pageshow; unknown event | late registration tested; broader timing pending |

## Priority 1 — predicate and value truth tables

Run in isolated ES module pages with no accidental global names such as x, isArray or isObject.

| Group | Inputs to represent |
|---|---|
| Arrays/Sets/Maps | undefined, null, [], non-empty array, Set, empty/non-empty Set, Map, empty/non-empty Map |
| Strings | primitive, boxed String, empty, whitespace-only, number, null |
| Objects | plain same-realm object, null-prototype object, class instance, Date, cross-realm object, null, undefined |
| Functions/classes | declaration, expression, arrow, async, class, bound/native function, non-callable object with custom toString |
| Node collections | empty NodeList, one/multiple NodeList, HTMLCollection, Element, DocumentFragment |
| Empty semantics | null, undefined, false, 0, "0", "0.0", "", whitespace, nested arrays, exceptions list |
| String/Number trim | standard whitespace, U+FEFF, U+200B, custom charlist, boxed values |

Expected outcomes must be traced to source and checked at runtime. For broken predicates, assert actual errors/false positives and classify the method unsafe rather than normalizing it.

## Priority 2 — Element/NodeList behavior and DOM mutation

- Attributes: empty/falsy values, early-stop behavior, missing names, removal of absent attributes.
- Styles: kebab-case vs camelCase, values with additional colons, invalid CSS values, inline/computed readback.
- Classes: multiple names, whitespace, duplicates and empty strings.
- Content: text vs HTML, empty string, null, Element vs array, detached nodes and destructive replacement.
- Value: input/select/textarea, checkbox/radio, zero/false/empty, getter modes.
- Events: callback context, event object, duplicate listeners, invalid callback and missing removal helper.
- Siblings: preserve known failure paths; test only to confirm unsupported/defective behavior.
- NodeList methods: verify receiver identity and whether mutation affects every member or none.

## Priority 3 — source/minified semantic parity

AST parity proves structural names/targets and CSS rule parity; it does not prove all method bodies behave equivalently.

1. Build a method-level fixture list for every public class/prototype method.
2. Run identical observations against source and minified builds in isolated browser pages.
3. Compare return shape, error category, DOM mutations, event effects and global side effects.
4. Avoid unstable object stringifications and timing values; define canonical observations.
5. Preserve known hazards such as Array thenable behavior in both builds and assert parity.
6. Record any mismatch as a release-blocking finding until explained.

## Priority 4 — API contract acceptance

An API row is complete only when the inventory contains signature/defaults and receiver, exact return contract including polymorphic shapes, mutations/side effects/global writes, truthy/falsy/empty/invalid cases, errors/async behavior, Element vs NodeList distinction, source line anchors, test name or explicit untested status, and source/minified parity status.

## Unsafe / unsupported classification

Do not present these as recommended working APIs until separately cleared:
- Array.setItem normal truthy arguments are blocked by its guard.
- Array.getIndex "=" branch assigns in the predicate.
- Array.then makes Arrays thenable and creates Promise-assimilation hazards.
- Element.setAdjacent and Element.setHtml guards block normal truthy calls.
- Element.siblings default path and NodeList siblings are defective.
- NodeList content/read methods include no-op stubs.
- Object.setValues/hasValues call a missing static predicate.
- isArrayLike, isNodeList and related predicates have unresolved global/identifier hazards; `isNaS` is always true and `isNaF` is a stringification heuristic with false positives/negatives, so neither is suitable for type validation.
- sancha builds HTML strings from data and has undeclared identifiers; do not pass untrusted input.
- getPlugin dynamically imports its argument; do not accept untrusted module specifiers.
- watch observer callback and lifecycle/disconnect behavior need deeper review.

Use native DOM/JavaScript APIs when they provide a safer, clearer contract.

## New source-review artifacts

The current source-review pass adds four focused references:
- [API signature and return contract reference](api-signature-reference.md) — receiver, signatures/defaults, return shapes and side effects.
- [Element/NodeList edge-case audit](nodelist-edge-case-audit.md) — exact stubs, collection divergences and failure paths.
- [Predicate truth and failure-path audit](predicate-truth-table.md) — source expressions and ambient-global hazards.
- [Source/minified parity audit](source-minified-parity-audit.md) — inspected high-risk methods and the limits of current parity evidence.

These are source-review improvements. The six new contract tests passed in run #324 and selected source/minified fixtures passed in runs #325 and #327. They do not close the remaining runtime or full semantic-parity criteria.

## References

- [API inventory](api-inventory.md)
- [Prototype behavior matrix](behavior-matrix.md)
- [Type predicates and guards](type-predicates-and-guards.md)
- [Templating and observation](templating-and-observation.md)
- [AQJS runtime model](../architecture/aqjs-runtime-model.md)
- [Source findings](../testing/source-findings.md)
- [Runtime validation matrix](../testing/runtime-validation-matrix.md)
- [Mastery gate](../mastery-gate.md)

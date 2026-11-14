# AQJS API Contract Closure Matrix

Source: ActiveQuery.js SHA b8ec9e5be8668d048eea3385cd9012dfddb69cf0.
Status: planning matrix derived from the API inventory, behavior matrix and runtime validation matrix. This is not a claim that the tests below already exist or pass.

## Objective

Every public method should have its exact receiver and signature/defaults, accepted inputs, return type and receiver identity, mutation/global side effects, normal/empty/falsy/invalid-input behavior, errors and async behavior, and source/minified comparison where relevant. Do not repair upstream AQJS while documenting or testing it.

## Priority 0 — unresolved API contracts

| Surface | Missing contract | Required test focus | Current evidence |
|---|---|---|---|
| getPlugin(name) | allowed input, rejection path, import errors, security boundary | approved module, invalid type, rejected module, allowlist boundary | inspected only; no allowlist/security test |
| Array.i | guard and index coercion | default, integer/string index, out-of-range, falsy | untested |
| Array.getCount | default operator branch unclear | each operator, missing delimiter, no match, multiple matches | selected cases passed; default branch pending |
| Array.then | Promise resolver assimilation | callback, missing callback, thenable resolution; isolate hang risk | callback tested; interoperability pending |
| Element.setValue | falsy clearing and supported element types | input/select/textarea/checkbox; zero, false, empty string | untested |
| Element.setChild | single/array append and invalid node handling | Element, fragment, array, empty array, invalid member | untested |
| Element.then | callback and receiver/return semantics | callable, absent/non-function callback, returned value | untested |
| Element.fax | FORM behavior incomplete | form vs non-form, controls, submit semantics; likely classify unsupported | untested |
| NodeList.i | indexing and guard semantics | zero/one/multiple, invalid index, empty list | partial; exact contract pending |
| NodeList.siblings | current behavior likely throws | next/prev/default with 0/1/multiple members | source review shows defect |
| NodeList stubs | exact no-op return values and coverage | each stub with normal args; assert identity/no mutation/undefined | representative stubs only |
| Document/Window.on | event validation and return value | valid/invalid event, missing callback, listener cleanup limits | basic custom events passed |
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
- isArrayLike, isNodeList and related predicates have unresolved global/identifier hazards; `isNaS` is always true and must not be used as a negative string predicate.
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

These are source-review improvements only. They do not close the pending runtime or semantic-parity criteria.

## References

- [API inventory](api-inventory.md)
- [Prototype behavior matrix](behavior-matrix.md)
- [Type predicates and guards](type-predicates-and-guards.md)
- [Templating and observation](templating-and-observation.md)
- [AQJS runtime model](../architecture/aqjs-runtime-model.md)
- [Source findings](../testing/source-findings.md)
- [Runtime validation matrix](../testing/runtime-validation-matrix.md)
- [Mastery gate](../mastery-gate.md)

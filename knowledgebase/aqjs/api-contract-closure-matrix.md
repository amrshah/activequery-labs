# AQJS API Contract Closure Matrix

Source: ActiveQuery.js SHA b8ec9e5be8668d048eea3385cd9012dfddb69cf0.
Status: active closure matrix derived from the API inventory, behavior matrix and runtime validation matrix. Each row records remaining work; passed test evidence is identified explicitly.

## Objective

Every public method should have its exact receiver and signature/defaults, accepted inputs, return type and receiver identity, mutation/global side effects, normal/empty/falsy/invalid-input behavior, errors and async behavior, and source/minified comparison where relevant. Do not repair upstream AQJS while documenting or testing it.

## Newly authored coverage (passed in run #324)

Six additional Playwright tests were added in `tests/aqjs.spec.js` and all passed in run [#324](https://github.com/amrshah/activequery-labs/actions/runs/43644712359): Element `setValue`, `setChild`, `then` and `fax`; NodeList no-op stubs and `on` validation; and Array `getCount` default-operator delimiter/missing-property behavior. The initial test assumptions were corrected after source review; no upstream code was changed. A further source/minified behavior fixture was added in commit `5769645f9aa327c627ce58f8dda9a5b40934b8db` and passed in [run #325](https://github.com/amrshah/activequery-labs/actions/runs/43644825180). It compares Element value/child/then behavior, NodeList event behavior and the Array `getCount` default branch across source and minified builds. Run [#327](https://github.com/amrshah/activequery-labs/actions/runs/43645400008) then added `getPlugin` rejected-import coverage, invalid-argument `Document.on`/`Window.on` receiver checks, and a source/minified fixture for Array `then` direct callback semantics plus document/window event registration. The full run passed 182 browser cases across 91 authored tests. Run [#340](https://github.com/amrshah/activequery-labs/actions/runs/43645942215) added an isolated early-lifecycle fixture: `ready`, `init`, and `run` each fired once, and the constructor's `initlog` callback ran once on `readystatechange=complete`. The same fixture passed against source and minified builds. The full run passed 186 browser cases across 93 authored tests. Run [#348](https://github.com/amrshah/activequery-labs/actions/runs/43646121898) added source/minified parity fixtures for Array query helpers (`getCount`, `getIndex`, `has`, `getIndexs`) and Element/NodeList attribute, style and class mutation contracts; all 194 browser cases across 97 authored tests passed. This remains selected-method parity, not full semantic proof.

## Priority 0 — unresolved API contracts

| Surface | Missing contract | Required test focus | Current evidence |
|---|---|---|---|
| getPlugin(name) | allowed input, rejection path, import errors, security boundary | approved module, invalid type, rejected module, allowlist boundary | approved fixture, non-string fallback and rejected import TypeError passed in runs #313/#327; the same import/fallback/rejection contract passed against source and minified builds in run #405; allowlist/security boundary remains an application responsibility and is not tested |
| Array.i | guard and index coercion | default, integer/string index, out-of-range, falsy | a direct call throws `TypeError` because `ActiveQuery.isNaN` is undefined and therefore not callable; source/minified parity for this failure passed in run #397, but normal indexing remains unavailable |
| Array.getCount | full default-operator grammar and malformed input behavior | `==`, `===`, `*`, delimiter/no-delimiter, unrecognised operator fallback, missing property, no match, multiple matches, non-string substring property | core operators and delimiter/no-delimiter/missing-property passed in #324; unrecognised `>` fallback, no-match and non-string TypeError passed in source/minified parity in #416 |
| Array.then | Promise resolver assimilation | callback, missing callback, non-function callback, thenable resolution; isolate hang risk | direct callback result, missing/non-function callback and source/minified parity passed in run #327; Promise resolver assimilation remains untested because the self-thenable can hang resolution |
| Array.setItem | truthy/falsy insertion guard | ordinary truthy index/value, both-falsy insertion, receiver identity | both branches passed in source/minified parity in run #399; ordinary truthy calls remain no-ops by design/source defect |
| Element.setValue | falsy clearing and supported element types | text input, checkbox value property, select, textarea; truthy assignment, falsy clearing, generic Element | Basic truthy/falsy and generic Element behavior passed in run #324; text/checkbox/select/textarea matrix passed in Chromium and Firefox in run #383; source/minified parity passed in run #383. This verifies the `.value` property, not checkbox checked-state semantics. |
| Element.setChild | single/array append and invalid node handling | Element, DocumentFragment, array, empty array, invalid member after valid member | single Element, array and empty array passed in run #324; DocumentFragment consumption, receiver identity, and partial append before native TypeError passed in Chromium/Firefox and source/minified parity in run #383 |
| Element.setContent | replacement, Node/Array/DocumentFragment and invalid input | single Node, array, empty array, fragment, invalid array member and invalid string | replacement semantics, fragment consumption, empty-array clearing and partial append before TypeError passed in Chromium/Firefox; source/minified parity passed in run #395 |
| Element.setText | truthy/falsy write behavior | empty string, zero, false, null, ordinary string, receiver identity | truthy writes, falsy no-op behavior and receiver identity passed in source/minified parity in PR #15 CI (run #477); falsy values do not clear existing text |
| Element.setHtml | truthy guard and falsy mode | truthy markup, falsy markup, outerHTML mode | truthy markup is ignored and receiver identity passed in source/minified parity in run #399; falsy innerHTML conversion/assignment return values and outerHTML host removal/return value passed in source/minified parity in run #413 |
| Element.getValue | default and mode-flag return semantics | found/missing substring, mode flag, no argument, receiver identity | default and inverted mode behavior passed in source/minified parity in run #399 |
| Element.siblings | next/prev/default branches | next, prev, default branch error | next/prev and default ReferenceError passed in source/minified parity in run #399 |
| Element.then | callback and receiver/return semantics | callable, absent/non-function callback, returned value | callback result and missing/non-function callback passed in run #324 |
| Element.fax | FORM behavior incomplete | form vs non-form, controls, submit semantics; likely classify unsupported | FORM returns undefined and non-FORM returns receiver, passed in run #324; form behavior remains unsupported |
| NodeList.i | indexing and guard semantics | zero/one/multiple, numeric-string, invalid index, out-of-range, empty list | index 0, invalid string, numeric-string index, out-of-range undefined and empty-list receiver identity passed in runs #313/#347 |
| NodeList.setValue | supported controls and collection identity | input, checkbox .value, select, textarea, generic element, falsy clearing, empty collection | basic multi-input behavior existed earlier; expanded multi-control, generic-element exclusion and empty-collection identity passed in Chromium/Firefox and source/minified parity in run #392 |
| NodeList.siblings | current behavior likely throws | next/prev/default with 0/1/multiple members | next/default TypeError reproduced in run #313; preserve as unsupported |
| NodeList stubs | exact no-op return values and coverage | each stub with normal/odd args, populated and empty collections; assert identity/no mutation/undefined | all identified stubs were invoked with representative arguments in #324; populated/empty collection behavior and source/minified parity passed in #422; unusual argument matrix remains optional additional coverage |
| NodeList.on | event validation and return value | valid/invalid event, empty and non-empty collections, callback invocation | valid/invalid arguments, empty collection identity and listener dispatch passed in run #324 |
| Document/Window.on | event validation and return value | valid/invalid event, missing callback, listener cleanup limits | custom event dispatch passed in run #313; invalid event/callback receiver identity and source/minified parity passed in run #327 |
| Lifecycle on | early/late registration and replay semantics | before/after DOMContentLoaded/load/pageshow; offline/online/close; unknown event | late registration no-replay, early `ready`/`init`/`run`, offline/online/close dispatch, unknown-event ignore and receiver identity passed in runs #313/#340/#347; offline/online/close mapping, unknown-event ignore and receiver identity also passed in source/minified parity in run #417; repeated construction and unusual timing remain pending |
| Element.setStyles | declaration parsing, colon handling, CSS value acceptance | property/value split, values containing colons, return identity, source/minified parity | `url(https://...)` is truncated to `url(\"https\")`; direct Chromium/Firefox regression and source/minified parity passed in merged-branch run #480. Do not claim the parser handles arbitrary valid CSS values. |
| Element.watch | observer callback, return contract, lifecycle/disconnect | mutation with callback, missing/non-function callback, return value, source/minified parity, disconnect | Reproduction and source/minified parity tests merged in PR #13; the callback binding failure and observer return behavior are documented. The API exposes no disconnect handle. The merged regression suite passed again in browser workflow #480. |
| Element.sift | selector guard and keyboard filtering | valid selector, empty selector, handler installation, keyboard event, source/minified parity | PR #12 added the valid-selector early-return regression and source/minified parity coverage; the behavior is reproduced and documented. Empty-selector and keyboard-event edge behavior remain open. The merged regression suite passed again in browser workflow #480. |
| Element.sancha | static append/replace and data-template execution | static template, swap flag, data input, missing identifiers, escaping, source/minified parity | PR #16 CI (run #478) and the merged-branch browser workflow #480 passed source/minified tests for data interpolation. Markup supplied as a value becomes live DOM (not escaped text); strict-mode undeclared loop variables and global `variables` coupling are documented. Additional placeholder combinations remain open. |
| ActiveQuery.extend("dom") | custom-element name validation | valid hyphenated name, no-hyphen invalid name, valid name containing digits, source/minified parity | Source/minified regression tests cover valid registration, browser SyntaxError for a no-hyphen name accepted by AQ's regex, and rejection of a spec-valid digit name; the cases passed in merged-branch browser run #480. |
| Function.then | callback receiver and return value | callable, missing/non-function callback, receiver identity | selected Function/Element/NodeList then receiver/return behavior passed in source/minified parity in run #409; broader invalid-callback cases remain pending |

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
- Content: text vs HTML, empty string, null, Element vs array, detached nodes and destructive replacement. `setContent` has selected array-replacement coverage; broader invalid-member and empty/falsy matrix remains pending.
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
- sancha static append/replace and data-mode ReferenceError have authored regression/parity tests (CI pending); escaping/security and remaining placeholder behavior are unresolved.
- getPlugin dynamically imports its argument; do not accept untrusted module specifiers.
- `watch` observer callback failure is covered by authored reproduction/parity tests (CI pending); lifecycle/disconnect behavior remains unresolved.

Use native DOM/JavaScript APIs when they provide a safer, clearer contract.

## New source-review artifacts

The current source-review pass adds four focused references:
- [API signature and return contract reference](api-signature-reference.md) — receiver, signatures/defaults, return shapes and side effects.
- [Element/NodeList edge-case audit](nodelist-edge-case-audit.md) — exact stubs, collection divergences and failure paths.
- [Predicate truth and failure-path audit](predicate-truth-table.md) — source expressions and ambient-global hazards.
- [Source/minified parity audit](source-minified-parity-audit.md) — inspected high-risk methods and the limits of current parity evidence.

These are source-review improvements. The initial contract tests passed in runs #324–#348; expanded Element DocumentFragment/form-control contracts passed in #383, NodeList multi-control setValue parity passed in #392, and Element setContent replacement/failure contracts passed in #395. Run [#397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) additionally verifies source/minified parity for Array.setSort, Array.i, Object.setValues/hasValues and selected type predicate outcomes. Run [#408](https://github.com/amrshah/activequery-labs/actions/runs/43823338803) additionally verifies source/minified parity for Array.getIndex's equals-branch assignment defect and Array.setItem's truthy argument no-op behavior. Run [#425](https://github.com/amrshah/activequery-labs/actions/runs/43825926932) additionally verifies source/minified parity for the `isJSON` type/regex predicate, including the empty-array stringification edge case. Run [#428](https://github.com/amrshah/activequery-labs/actions/runs/43826836114) adds AQCSS/AQJS dynamic class interaction parity for `.hide`/`.show` via Element class mutators. These are selected-method checks, not full semantic parity or closure of the remaining runtime criteria.

## References

- [API inventory](api-inventory.md)
- [Prototype behavior matrix](behavior-matrix.md)
- [Type predicates and guards](type-predicates-and-guards.md)
- [Templating and observation](templating-and-observation.md)
- [AQJS runtime model](../architecture/aqjs-runtime-model.md)
- [Source findings](../testing/source-findings.md)
- [Runtime validation matrix](../testing/runtime-validation-matrix.md)
- [Mastery gate](../mastery-gate.md)


## AQCSS/AQJS integration coverage

A representative class bridge is now browser-tested: Element `setClasses(["hide"])` activates AQCSS `.hide` (`display:none!important`); adding `.show` wins by later source order at equal specificity/importance; removing `.show` reveals `.hide` again; removing `.hide` restores the AQCSS baseline display. The same behavior passed against AQJS source and minified builds in run #428. See `integration/aqcss-aqjs-display-bridge.md`.


## Predicate contract batch — passed run #464

[Run #464](https://github.com/amrshah/activequery-labs/actions/runs/43834593267) passed 331 browser executions with one documented skip across Chromium and Firefox. Three new source/minified parity fixtures now verify:
- Ambient-global hazards in `isArrayLike`, `isObjectLike` and `isNodeList`, including behavior changes when the names those methods resolve as globals are injected.
- `isEmpty` default sentinels, numeric/whitespace normalization, recursive arrays, exception exclusions and invalid exception-list return.
- `isObjectLiteral` behavior for ordinary objects, class instances, Date, arrays, boxed primitives, functions, own-property exclusions, null and null-prototype objects.

These cases are now runtime-verified for both distributions. This does not close the entire predicate truth table: cross-realm inputs, custom `toString` objects, and the full function/class predicate matrix remain open. The overall Gate B and source/minified parity criteria remain NOT PASSED.

## Verified edge-contract evidence — merged-branch run #480

The source/minified fixture for Array.then, Element.setAdjacent and Element.sift passed in merged-branch run [#480](https://github.com/amrshah/activequery-labs/actions/runs/43845146200), in Chromium and Firefox. It establishes direct callback/receiver behavior and the missing/non-function callback no-op for Array.then; the no-op insertion behavior of setAdjacent; and the truthy-selector early return plus empty-selector keyup SyntaxError for sift. Promise resolver assimilation remains deliberately unexecuted because the Array thenable can recursively re-enter resolution; that risk is source-backed, not a claimed runtime hang measurement.

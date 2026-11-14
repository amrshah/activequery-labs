# AQJS Predicate Truth and Failure-Path Audit

Source: `ActiveQuery.js` blob SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.
Status: source-derived truth/failure analysis. Runtime coverage is partial; do not treat these as validated behavior for every input.

## Core predicate truth table

| Predicate | Source expression / behavior | Consequence |
|---|---|---|
| `isArray(a)` | `!!a && Array.isArray(a)` | True only for truthy Arrays. |
| `isNaA(a)` | `!(!!a && Array.isArray(a))` | True for null, undefined, false, zero and all non-Arrays. |
| `isArraySet(a)` | `!!a && a instanceof Set` | True for same-realm Set instances; cross-realm caveat. |
| `isNaAS(a)` | Negation of `isArraySet` expression | True for falsy values and non-Sets. |
| `isObjectMap(a)` | `!!a && a instanceof Map` | True for same-realm Map instances. |
| `isNaOM(a)` | Negation of Map expression | True for falsy values and non-Maps. |
| `isString(a)` | Primitive string OR `a instanceof String` | Supports primitive and boxed strings. |
| `isNaS(a)` | `typeof a !== "string" || !(a instanceof String)` | Always true: primitive strings fail the boxed-instance test; boxed strings and all other values satisfy the first disjunct. It is not a logical negation of isString. |
| `isObject(a)` | `!!a && a.constructor === Object` | Same-realm ordinary objects commonly pass; null/falsy fail; custom/cross-realm objects may not. |
| `isNaO(a)` | Negation of object expression | True for falsy and non-plain-object values. |
| `isObjectLiteral(a)` | Reads `Object.getOwnPropertyNames(a)` before checking truthiness/type | Null/undefined throw before its later guard; not a robust plain-object test. |
| `isNaM(a)` | Negation of `!!a && a instanceof Map` | Overlaps `isNaOM`; true for falsy and non-Map values. |
| `isFunction(a)` | Truthy and `/function|()=>/.test(a.toString())` | String heuristic; the empty capture group in `()` means the `=>` alternative matches arrow-function source even when whitespace precedes the arrow. Callable values can still fail and non-callable custom stringifiers can pass. |
| `isNaF(a)` | Negates the same truthy regex expression | Returns false for ordinary arrow functions and functions whose source contains `function`; true for other values that do not match. It is not a reliable negative callable predicate. |
| `isClass(a)` | Truthy and string contains `class` | String heuristic, not reliable class reflection. |
| `isNaC(a)` | Negates same class-string check | Inherits heuristic limits. |
| `isSet(a)` | Negates Array/falsy-string pattern checks | Despite name, checks an Array's string representation; not `instanceof Set`. |
| `isArgument(a)` | Rejects whitespace-only or stringified values containing `undefined` | Not a general argument-presence check. |
| `isJSON(a)` | Type/regex check after empty/undefined filter | Does not parse JSON. `null` may pass because `typeof null === "object"`. |

## Identifier-resolution hazards

| Method | Unqualified / incorrect identifier | Likely failure mode | Existing evidence |
|---|---|---|---|
| `isArrayLike(a)`, `isNaAL(a)` | `isArray`, `isArraySet`, `isNodeList` | ReferenceError in clean module scope unless globals happen to exist | Explicit ReferenceError tests passed in run #313. |
| `isObjectLike(a)`, `isNaOL(a)` | `isObject`, `isObjectMap()` | ReferenceError in clean scope; second call also omits `a` | Source review; runtime matrix says selected objectLike paths partial. |
| `isNodeList(a)`, `isNaNL(a)` | `x.toString()` rather than `a.toString()` | ReferenceError unless a global `x` exists; with global x, result depends on x not argument | Explicit ReferenceError tests passed in run #313. |
| Array `setSort` | `aVal`, `bVal` assigned without declarations | Strict/module execution may throw; sloppy script may leak globals | Needs isolated strict-mode parity test. |
| Element `siblings()` default | `target` instead of local `t` | ReferenceError unless global target exists | Existing source finding; default path coverage should remain explicit. |
| `sancha` data mode | `variables`, `ii`, `i` undeclared in paths | Global leakage or ReferenceError depending on path/execution mode | Existing test catches a data-mode ReferenceError; exact global-injection variants pending. |
| `watch` callback | `this.watched` where callback this is not the Element | Callback may throw; observer callback calls `args.then()` without validation | Existing mutation test captures TypeError. |

## isEmpty and keepOn are not ordinary truthiness helpers

`ActiveQuery.isEmpty(value, exceptions=[])`:
- Empty set by default: `null`, `"0"`, `"0.0"`, `false`, `undefined`, `""`.
- Each member included in the second argument is removed from that empty set (it is an exception).
- String and number values are additionally compared after `toString().trim()`.
- A non-empty Array is recursively inspected; if any member is empty, the Array is classified empty.
- An empty Array returns false.
- A non-Array second argument returns undefined rather than false.

`ActiveQuery.keepOn(value)`:
- Returns the original value only if `value.length == 0` and `window.debug` is falsy.
- Otherwise returns undefined.
- Several collection methods use it as a guard, so the behavior changes if application code sets `window.debug`.

## Runtime truth-table requirements still open

Run in isolated ES-module browser pages without ambient globals:
1. Primitive and boxed String; null, undefined, booleans, numbers.
2. Empty/non-empty Array, nested Arrays, sparse Arrays, arrays containing each isEmpty sentinel.
3. Same-realm and cross-realm Set/Map.
4. Plain object, null-prototype object, class instance, Date, cross-realm object, null and undefined.
5. Function declaration/expression, arrow, async function, bound/native function, class, and object with custom `toString`.
6. NodeList/HTMLCollection/Element/DocumentFragment.
7. Define and remove globals `x`, `isArray`, `isArraySet`, `isNodeList`, `isObject`, `isObjectMap`; assert whether behavior changes.
8. Run setSort in module strict semantics and confirm any undeclared assignment error.

## Safety classification

Do not use these methods as validators or authorization checks: `isArrayLike`, `isObjectLike`, `isNodeList`, `isNaNL`, `isSet`, `isArgument`, `isJSON`, `isFunction`, `isClass`, `isObjectLiteral`. Prefer native type checks and explicit schema validation.

References: [type predicates and guards](type-predicates-and-guards.md), [API signature reference](api-signature-reference.md), [source findings](../testing/source-findings.md), [runtime validation matrix](../testing/runtime-validation-matrix.md).

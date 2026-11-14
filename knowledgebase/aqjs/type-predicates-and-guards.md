# AQJS Type Predicates, Empty-Value Semantics and Guards

Source: `ActiveQuery.js` SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.
Source range: approximately lines 184–315.
Status: source-derived contracts; suspicious predicates require isolated runtime tests.

## Type predicate inventory

| Method | Source behavior | Caution |
|---|---|---|
| `isArray(a)` | Truthy and `Array.isArray(a)` | Straightforward |
| `isNaA(a)` | Negation of truthy array check | Returns true for falsy values |
| `isArraySet(a)` | Truthy and `a instanceof Set` | Realm-sensitive |
| `isNaAS(a)` | Negation of Set check | Returns true for falsy values |
| `isObjectMap(a)` | Truthy and `a instanceof Map` | Realm-sensitive |
| `isNaOM(a)` | Negation of Map check | Naming is unconventional |
| `isArrayLike(a)` | Calls `isArray(a)`, `isArraySet(a)`, `isNodeList(a)` without qualifying them | Likely ReferenceError in clean scope |
| `isNaAL(a)` | Negates the same unqualified calls | Likely ReferenceError |
| `isString(a)` | Primitive string or boxed String | Works for both common forms |
| `isNaS(a)` | `typeof a !== "string" || !(a instanceof String)` | Appears true for primitive and boxed strings; likely broken |
| `isObject(a)` | Truthy and `a.constructor === Object` | Not cross-realm safe; null is false |
| `isNaO(a)` | Negates the object check | Returns true for falsy values |
| `isObjectLiteral(a)` | Calls `Object.getOwnPropertyNames(a)`, then checks type/constructor and excluded property names | Reads properties before null guard; may throw on null/undefined; not a robust plain-object test |
| `isNaM(a)` | Negates `a instanceof Map` | Overlaps `isNaOM` |
| `isObjectLike(a)` | Calls unqualified `isObject(a)` and `isObjectMap()` without passing a | Likely ReferenceError / incorrect argument |
| `isNaOL(a)` | Negates the same unqualified calls | Likely ReferenceError |
| `isFunction(a)` | Checks `a.toString()` against `/function|()=>/` | Heuristic, not a reliable callable check |
| `isNaF(a)` | Negates same string-pattern check | Inherits heuristic weakness |
| `isClass(a)` | Checks whether stringified value includes `class` | Heuristic |
| `isNaC(a)` | Negates same class string check | Heuristic |
| `isNodeList(a)` | Checks a string representation regex but references `x.toString()`, not a | Likely ReferenceError unless global x exists |
| `isNaNL(a)` | Negates same check and references x | Likely broken |
| `isSet(a)` | True for a non-empty Array whose string form does not match empty/null/undefined | Despite its name, this is not a JavaScript Set check |
| `isArgument(a)` | Rejects whitespace-only string and values whose string representation contains `undefined` | Not a general argument validator |
| `isJSON(a)` | Accepts typeof number/object/array/string/boolean after simple empty/undefined check | Does not parse JSON; null may pass because typeof null is object |

## Empty-value semantics

`ActiveQuery.isEmpty(value, exceptions=[])` creates an empty-value set containing:

- `null`
- `"0"`
- `"0.0"`
- `false`
- `undefined`
- `""`

Any values present in the second argument are removed from that set, making them exceptions to the empty classification.

For string and number inputs, the method also compares the trimmed string representation against the empty-value set. Consequently numeric zero is considered empty by default.

For non-empty arrays, it recursively inspects each member and returns true as soon as any member is empty. An empty array itself returns false in the inspected implementation.

This is application-specific emptiness semantics, not JavaScript truthiness and not a conventional emptiness predicate. Do not use it as a generic validation rule without tests and an explicit contract.

## keepOn guard

`ActiveQuery.keepOn(value)` returns the input only when `value.length === 0` and `window.debug` is falsy. Otherwise it returns undefined.

Several collection methods use this as an early-return guard. The name does not explain that empty collections are preserved/returned, and behavior changes when a global `window.debug` flag is truthy.

## Dynamic plugin import

`getPlugin(name)` performs `await import(name)` when the argument is a string; otherwise it returns the instance. This is a dynamic module-loading surface. Do not pass untrusted user-controlled module specifiers. Restrict allowed modules at the application boundary.

## Lifecycle event helper

`on(name, callback)` supports only the fixed names:
- `ready` → document `DOMContentLoaded`
- `init` → window `load`
- `run` → window `pageshow`
- `offline` → window `offline`
- `online` → window `online`
- `close` → window `beforeunload`

Unknown names are ignored. The method returns the AQ instance.

## Validation matrix still required

Test primitive and boxed values, null/undefined, cross-realm objects, empty/non-empty/nested arrays, NodeList/HTMLCollection, Set/Map, functions, classes, and the effect of defining a global `x` or `isArray` name. Tests should run in an ES module page with no accidental global bindings.

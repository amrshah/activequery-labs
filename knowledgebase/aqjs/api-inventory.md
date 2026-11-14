# AQJS API Inventory — Source Examination

Source: [ActiveQuery.js](https://github.com/ActiveQuery/JS/blob/main/ActiveQuery.js), SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`, 1,152 lines.
Status: initial method inventory. Not a completed behavioral API reference.

## Named export and class methods

### Static methods

| Method | Source-observed role | Return/side-effect notes |
|---|---|---|
| `DOM(x)` | Document-wide selector helper | `null`, Element or NodeList based on match count |
| `nestedDOM(a)` | Context-aware descendant selector helper | Returns original context, Element, NodeList or plain array depending on context and matches |
| `extend(...a)` | Defines custom elements or adds property descriptors to prototypes | Can mutate global/native prototypes |
| `isEmpty(a,b=[])` | Checks values/arrays against configurable empty-value set | Returns boolean in ordinary valid-array path; invalid second arg returns undefined |
| `exit()` | Returns `this` | No other effect in body |
| `keepOn(a)` | Returns input when its length is zero and `window.debug` is falsy | Otherwise returns undefined |

### Constructor and instance methods

| Method | Source-observed role | Notes requiring care |
|---|---|---|
| `constructor(a=null)` | Initializes helper references, event listener and optional alias | See runtime model; global/prototype mutations |
| `defer(a)` | Copies iterable, pops last value, multiplies by 1000, passes remaining callbacks to `setTimeout` | Actual callback shape is suspicious; verify intended use and runtime behavior |
| `isArray(a)` / `isNaA(a)` | Positive/negative array checks | `isNaA` is negation |
| `isArraySet(a)` / `isNaAS(a)` | Set checks | Negative counterpart |
| `isObjectMap(a)` / `isNaOM(a)` | Map checks | Naming is unconventional |
| `isArrayLike(a)` / `isNaAL(a)` | Array-like check and negation | Calls identifiers `isArray`, `isArraySet`, `isNodeList` without qualifying them as instance methods; inspect runtime/global resolution |
| `isString(a)` / `isNaS(a)` | String checks | Negative method expression is not a straightforward logical negation of positive method |
| `isObject(a)` / `isNaO(a)` | Plain-object-like check using constructor equality | Cross-realm and null edge cases require tests |
| `isObjectLiteral(a)` | Inspects own property names and constructor | Reads properties before null guard; edge cases require tests |
| `isNaM(a)` | Negates `instanceof Map` | Naming suggests map negation |
| `isObjectLike(a)` / `isNaOL(a)` | Object/Map check and negation | Body calls `isObjectMap()` without passing `a`; likely defect or missing context, must test |
| `isFunction(a)` / `isNaF(a)` | String-pattern checks on `toString()` | Regex heuristic, not a robust callable test |
| `isClass(a)` / `isNaC(a)` | Checks whether stringified value includes `class` | Heuristic; arrow/functions and minified forms may differ |
| `isNodeList(a)` / `isNaNL(a)` | Tests string representation for HTML/NodeList labels | Source references `x.toString()` rather than parameter `a`; likely defect, verify |
| `isSet(a)` | Tests an array-like value against a regex | Name does not mean JavaScript Set; inspect implementation carefully |
| `isArgument(a)` | Checks string representation against empty/undefined pattern | Not a type validator |
| `isJSON(a)` | Checks emptiness and typeof against a pattern | Does not parse JSON; name is misleading if interpreted as parser/validator |
| `on(name,callback)` | Lifecycle/network/page event registration | See runtime model |

## Prototype extension targets

The source invokes `ActiveQuery.extend` for these targets:

| Target | Added API family |
|---|---|
| `array` | `i`, `then`, `getIndex`, `getCount`, `setSort`, `setItem`, `has`, `getIndexs` |
| `element` | DOM attributes/styles/classes/children/siblings/adjacent insertion/HTML/text/value helpers; `then`, `fax`, `on`; later `sancha`, `sift`, `watch` |
| `document` | `on` |
| `window` | `on` |
| `function` | `then` |
| `nodelist` | Collection variants of attributes/styles/classes/value/event helpers and stubs |
| `number` | `trim` |
| `object` | `setValues`, `hasValues`, plus no-op/stub methods for selected element-style APIs |
| `string` | `trim` |

### Array methods

- `i(a='')`: returns `this[a]` unless its guard returns the array itself.
- `then(callback)`: invokes callback with the array when callback is a function.
- `getIndex(key, operator, value)`: supports `==` and `=`; the latter assigns in the predicate rather than compares. This is a source-observed behavior and should be treated as a likely bug, not silently rewritten in documentation.
- `getCount(key, op, val)`: supports `==`, `===`, `*`, and a default branch. The default branch splits `val` using `op[1]`; semantics are unclear and need tests.
- `setSort(...args)`: parses path strings/arrays and sorts the array in place using a comparator. Comparator references `aVal` and `bVal` without declarations, creating potential global leakage in non-strict execution or a ReferenceError in strict/module contexts.
- `setItem(a,b)`: guard is `if(!!a || !!b) return this`; if both arguments are falsy, calls `splice(a,0,b)`. This is counterintuitive and needs validation.
- `has(key,val)`: strict equality lookup.
- `getIndexs(key,val)`: returns the first matching index, otherwise false.

### Element methods (source-level behavior)

| Method | Signature | Observed behavior |
|---|---|---|
| `parent` | getter | Returns parentNode, except when parent node name is HTML, then returns element itself |
| `name` | getter | Returns `nodeName` |
| `setAttributes` | `(pairs)` | Iterates pairs as name/value pairs; stops when a value is falsy |
| `setAttributeName` | `(names)` | Sets each attribute to empty string |
| `removeAttributes` | `(names)` | Removes each named attribute |
| `setStyles` | `(declarations)` | Parses each string by colon and assigns `this.style[property]` |
| `getStyles` | `(properties)` | Returns array of truthy inline/computed style values; trailing true requests inline style |
| `removeStyles` | `(properties)` | Calls `style.removeProperty` for each |
| `setClasses` | `(names)` | Adds each class |
| `getClasses` | `(optionalNames)` | Returns boolean all-present check when names supplied, otherwise split class string |
| `removeClasses` | `(names)` | Removes trimmed class names |
| `toggleClasses` | `(name)` | Toggles one class |
| `i` | no meaningful argument | Returns element itself |
| `setChild` | `(elementOrArray)` | Appends one or multiple nodes |
| `siblings` | `(direction)` | `next`, `prev`, or all siblings; default branch references `target` not locally declared |
| `setAdjacent` | `(position,element)` | Maps aliases to insertAdjacentElement positions |
| `setHtml` | `(html,outer=false)` | Sets innerHTML or outerHTML; guard rejects falsy HTML |
| `getHtml` | `(needle,outer=false)` | Returns markup or substring-presence boolean |
| `setContent` | `(elementOrArray)` | Clears innerHTML then appends nodes |
| `setText` | `(text)` | Sets textContent only when argument truthy |
| `getText` | `(needle)` | Returns textContent or substring-presence boolean |
| `setValue` | `(value)` | Sets value when supported and truthy; otherwise clears value |
| `getValue` | `(needle,mode=false)` | Guarded substring checks; fallback/return behavior needs careful tests |
| `then` | `(callback)` | Calls callback with element |
| `fax` | no parameters | Returns element when it is not a FORM; form behavior is incomplete in inspected body |
| `on` | `(event,callback)` | Adds event listener when types are valid |

### NodeList methods and deliberate stubs

The NodeList extension includes implementations for attributes, styles, classes, `i`, `siblings`, `setValue`, `on`, and `then`. Several methods are stubs that return `this` or undefined, including `getStyles`, `getClasses`, `setChild`, `setAdjacent`, `setHtml`, `getHtml`, `setContent`, `setText`, `getText`, `getValue`, and `fax`.

Do not assume API parity between Element and NodeList.

## Later DOM extensions

- `sancha(args)` is attached to Element. It supports a static template mode and a data-driven placeholder replacement mode. It uses `insertAdjacentHTML` or `innerHTML`, and interpolates data into HTML strings. Treat untrusted input as an XSS risk until safe escaping is established. The implementation also references undeclared identifiers such as `variables`, `ii` and `i` in relevant paths; test before use.
- `sift(selector)` is attached to Element and binds `onkeyup` to filter matching descendants by text or a `sift` attribute. Its guard and behavior need tests; it sets the handler property rather than using addEventListener.
- `watch(args)` is attached to Element and uses MutationObserver (or a bundled fallback). The callback calls `args.then()`; missing callback handling and observer lifecycle/disconnect behavior need tests. The fallback is substantial and must be examined separately.

## Critical API documentation rule

This inventory intentionally records suspicious source behavior rather than smoothing it over. Before publishing a method as recommended, add:
1. exact line anchors;
2. normal-case tests;
3. empty/falsy/invalid-input tests;
4. single element vs collection tests where relevant;
5. strict-mode/module tests for undeclared identifiers;
6. browser support observations.

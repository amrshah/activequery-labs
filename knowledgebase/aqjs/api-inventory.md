# AQJS API Inventory — Source Examination

Source: [ActiveQuery.js](https://github.com/ActiveQuery/JS/blob/main/ActiveQuery.js), SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`, 1,152 lines.
Status: structural method inventory completed and AST-count validated; behavioral contracts and edge-case coverage remain partial.

## AST inventory baseline

The pinned AQJS source is parsed with Acorn in CI. The generated AST catalog records **35 class methods**, **76 prototype-extension methods across 9 targets**, **11 event-listener call sites**, **1 dynamic import**, and **4 global/prototype write sites**. The minified build matches the source on export names, class method names/kinds/static flags, extension targets and extension method names/descriptor kinds. These are structural parity checks, not proof that every method body is semantically identical; selected behavior is additionally compared in Playwright.

## Named export and class methods

### Static methods

| Method | Source-observed role | Return/side-effect notes |
|---|---|---|
| `DOM(x)` | Document-wide selector helper | `null`, Element or NodeList based on match count |
| `nestedDOM(a)` | Context-aware descendant selector helper | Element/Document return original context, Element or NodeList by match count; NodeList returns original collection, Element or plain Array; Array and HTMLCollection contexts are returned unchanged |
| `extend(...a)` | Defines custom elements or adds property descriptors to prototypes | Can mutate global/native prototypes |
| `isEmpty(a,b=[])` | Checks values/arrays against configurable empty-value set | Returns boolean in ordinary valid-array path; invalid second arg returns undefined |
| `exit()` | Returns `this` | No other effect in body |
| `keepOn(a)` | Returns input when its length is zero and `window.debug` is falsy | Otherwise returns undefined |

### Constructor and instance methods

| Method | Source-observed role | Notes requiring care |
|---|---|---|
| `constructor(a=null)` | Initializes helper references, event listener and optional alias | See runtime model; global/prototype mutations |
| `defer(a)` | Copies iterable, pops last value, multiplies by 1000, passes remaining array to `setTimeout` | In Chromium/Firefox the array is coerced to a string; it does not synchronously throw, but the supplied arrow-function callback is evaluated as an expression and not invoked. See JS-016 |
| `getPlugin(name)` | Dynamically imports the string module specifier with `import(name)` | Do not pass untrusted user-controlled module specifiers; restrict allowed modules at the application boundary |
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
- `then(callback)`: invokes callback with the array when callback is a function. This makes Arrays thenable to Promise-resolution machinery; returning an Array from an async boundary can trigger assimilation and hang if the resolver receives the same Array. Wrap or copy Arrays before returning them across promise-based boundaries.
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
| `setStyles` | `(declarations)` | For each declaration, removes only the first literal space, splits on every `:`, then assigns only `split[1]` to `this.style[split[0]]`; later colon-separated segments are discarded. A URL value such as `url(https://example.com/image.png)` is truncated to `url(https` before CSSOM normalization (observed as `url("https")` in Chromium and Firefox). |
| `getStyles` | `(properties)` | Returns array of truthy inline/computed style values; trailing true requests inline style |
| `removeStyles` | `(properties)` | Calls `style.removeProperty` for each |
| `setClasses` | `(names)` | Adds each class |
| `getClasses` | `(optionalNames)` | Returns boolean all-present check when names supplied, otherwise split class string |
| `removeClasses` | `(names)` | Removes trimmed class names |
| `toggleClasses` | `(name)` | Toggles one class |
| `i` | no meaningful argument | Returns element itself |
| `setChild` | `(elementOrArray)` | Appends one or multiple nodes |
| `siblings` | `(direction)` | Element `next`/`prev` work; Element default branch references undeclared `target`; NodeList implementation double-indexes the first Element and throws for normal paths |
| `setAdjacent` | `(position,element)` | Maps aliases to insertAdjacentElement positions, but the guard returns early when either normal argument is truthy; ordinary calls are skipped |
| `setHtml` | `(html,outer=false)` | Intended to set innerHTML or outerHTML, but the guard returns early when HTML is truthy; normal non-empty HTML writes are skipped |
| `getHtml` | `(needle,outer=false)` | Returns markup or substring-presence boolean |
| `setContent` | `(elementOrArray)` | Clears innerHTML then appends nodes |
| `setText` | `(text)` | Sets textContent only when argument truthy |
| `getText` | `(needle)` | Returns textContent or substring-presence boolean |
| `setValue` | `(value)` | Sets value when supported and truthy; otherwise clears value |
| `getValue` | `(needle,mode=false)` | With a truthy needle and mode false, returns whether the value contains it; with mode true, returns `Boolean(indexOf(needle))` (false at index 0, true when absent); with no truthy needle, returns the Element itself |
| `then` | `(callback)` | Calls callback with element |
| `fax` | no parameters | Returns element when it is not a FORM; form behavior is incomplete in inspected body |
| `on` | `(event,callback)` | Adds event listener when types are valid |

### NodeList methods and deliberate stubs

The NodeList extension includes implementations for attributes, styles, classes, `i`, `siblings`, `setValue`, `on`, and `then`. Its `siblings` implementation is not a reliable equivalent of the Element version. The String extension replaces the native `String.prototype.trim` implementation while retaining the existing native descriptor flags (writable/configurable true, enumerable false); its whitespace semantics differ from native trim. Several methods are stubs that return `this` or undefined, including `getStyles`, `getClasses`, `setChild`, `setAdjacent`, `setHtml`, `getHtml`, `setContent`, `setText`, `getText`, `getValue`, and `fax`.

Do not assume API parity between Element and NodeList.

## Later DOM extensions

- `sancha(args)` is attached to Element. It supports a static template mode and a data-driven placeholder replacement mode. It uses `insertAdjacentHTML` or `innerHTML`, and interpolates data into HTML strings. Treat untrusted input as an XSS risk until safe escaping is established. The implementation also references undeclared identifiers such as `variables`, `ii` and `i` in relevant paths; test before use.
- `sift(selector)` is attached to Element and binds `onkeyup` to filter matching descendants by text or a `sift` attribute. Its guard and behavior need tests; it sets the handler property rather than using addEventListener.
- `watch(args)` is attached to Element and uses MutationObserver (or a bundled fallback). The callback calls `args.then()`; missing callback handling and observer lifecycle/disconnect behavior need tests. The fallback is substantial and must be examined separately.

## Contract closure tracking

See the [API signature and return contract reference](api-signature-reference.md) for exact receiver/signature/return summaries, and the [predicate truth table](predicate-truth-table.md), [Element/NodeList edge-case audit](nodelist-edge-case-audit.md), and [source/minified parity audit](source-minified-parity-audit.md) for deeper source review.

The [AQJS API contract closure matrix](api-contract-closure-matrix.md) tracks remaining method-level contracts, edge-case tests, unsafe classifications and semantic source/minified parity work. Use it alongside this inventory; do not interpret structural AST parity as full behavioral equivalence.

## Critical API documentation rule

This inventory intentionally records suspicious source behavior rather than smoothing it over. Before publishing a method as recommended, add:
1. exact line anchors;
2. normal-case tests;
3. empty/falsy/invalid-input tests;
4. single element vs collection tests where relevant;
5. strict-mode/module tests for undeclared identifiers;
6. browser support observations.

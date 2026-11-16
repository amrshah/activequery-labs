# AQJS API Signature and Return Contract Reference

Source: `ActiveQuery.js` blob SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0` (1,152 lines).
Companion minified artifact: `ActiveQuery.min.js` blob SHA `594d778cd5fefe2caa039a7904343e385b77a50c`.
This reference records source-observed signatures and return shapes. It is not a claim that every path has runtime coverage.

## Class API

| Receiver / method | Exact signature | Return contract | Side effects / caveats |
|---|---|---|---|
| Constructor | `new ActiveQuery(a = null)` | New instance | Initializes `initlog`; binds static helpers to instance; registers readystatechange listener; a matching string alias writes to `window`, `Element.prototype`, `NodeList.prototype` and `Object.prototype`. |
| Static `DOM` | `DOM(x)` | `null` for 0 matches; Element for 1; NodeList for 2+ | Uses document-wide `querySelectorAll`; invalid selector throws native selector error. |
| Static `nestedDOM` | `nestedDOM(a)` | Polymorphic: context, Element, NodeList or Array | Invalid selector/context returns original `this`; Element/Document returns context on no matches, one Element or NodeList; NodeList path flattens descendant matches and returns original NodeList, one Element or Array; HTMLCollection and Array contexts are returned unchanged under the current guard. |
| Static `extend` | `extend(...a)` | Returns `this` | Defines custom elements or prototype descriptors. Mutates native/global prototypes. Several branches assume required arguments exist and can throw. |
| Static `isEmpty` | `isEmpty(a, b = [])` | Boolean for Array `b`; undefined if `b` is not an Array | Recursively treats configured empty values inside non-empty arrays as empty; see type-predicates-and-guards.md. |
| Static `exit` | `exit()` | Returns its receiver (`this`) | No other body effect. |
| Static `keepOn` | `keepOn(a)` | Returns `a` only if `a.length == 0` and `window.debug` is falsy; otherwise undefined | Guard helper; assumes a readable `length`. |
| Instance `defer` | `defer(a)` | Native timer handle | Copies iterable, pops last member as seconds, multiplies by 1000, passes remaining Array as `setTimeout` callback argument. Browser coercion does not turn its members into an invoked callback. |
| Instance `getPlugin` | `async getPlugin(n)` | Promise resolving to imported module namespace for string input; otherwise resolves to instance | Uses dynamic `import(n)`; import rejection propagates. Do not accept untrusted module specifiers. |
| Instance predicates | `isX(a)` / `isNaX(a)` | Mostly Boolean, but several throw or are semantically misleading | Exact predicate list and failure conditions are in type-predicates-and-guards.md. |
| Instance lifecycle `on` | `on(a = null, b = null)` | Always returns AQ instance | Registers only six fixed names; unknown names are ignored; no listener-removal API is returned. Offline/online/close mapping, unknown-event ignore and receiver identity passed in source/minified parity in run #417. |

## Array.prototype extensions

All methods are installed through `ActiveQuery.extend('array', ...)`.

| Method | Exact signature | Return contract | Side effects / caveats |
|---|---|---|---|
| `i` | `i(a = '')` | Element at property key `a`, or original Array on guard path | Calls missing `ActiveQuery.isNaN`; ordinary calls may throw before indexing. |
| `then` | `then(a)` | Callback result if `a` is a function; otherwise undefined | Makes every Array a thenable. Promise assimilation hazard. |
| `getIndex` | `getIndex(a, b, c)` | Index from `findIndex`, or undefined for unsupported operator | `==` compares loosely; `=` assigns `c` to each visited object's `a` property. |
| `getCount` | `getCount(key, op, val)` | Number | Supports `==`, `===`, `*`; default branch splits `val` using `op[1]` and compares/includes. Missing properties or non-string values may throw in the substring branches. |
| `setSort` | `setSort(...a)` | Same Array reference after in-place sort | Nested path sorting; comparator assigns undeclared `aVal` and `bVal`, a strict-module failure risk. |
| `setItem` | `setItem(a, b)` | Same Array reference | Calls `splice(a, 0, b)` only when both `a` and `b` are falsy; otherwise returns unchanged Array. |
| `has` | `has(key, val)` | Boolean | Strict equality on `this[i][key]`; assumes members permit property access. |
| `getIndexs` | `getIndexs(key, val)` | First matching index, otherwise `false` | Exact public spelling is plural `Indexs`. Strict equality. |

## Element.prototype extensions

| Method / property | Exact signature | Return contract | Side effects / caveats |
|---|---|---|---|
| `parent` | getter | Parent Element, except returns self when parent node is HTML | Root-level behavior is intentionally nonstandard. |
| `name` | getter | `nodeName` string | Read-only accessor. |
| `setAttributes` | `setAttributes(a)` | Same Element | Consumes alternating name/value pairs; stops at first falsy value. |
| `setAttributeName` | `setAttributeName(a)` | Same Element | Sets each listed attribute to empty string. |
| `removeAttributes` | `removeAttributes(a)` | Same Element | Removes each listed attribute. |
| `setStyles` | `setStyles(a)` | Same Element | Splits each declaration at colon and assigns first property/value pieces. |
| `getStyles` | `getStyles(a)` | Array of truthy style values, or same Element if no argument | Last array member equal to true selects inline styles; otherwise computed styles. Missing/empty values are omitted, so result positions are not keyed. |
| `removeStyles` | `removeStyles(a)` | Same Element | Calls `style.removeProperty` for each supplied name. |
| `setClasses` | `setClasses(a)` | Same Element | Adds each supplied token. |
| `getClasses` | `getClasses(a)` | Boolean when non-empty names supplied; otherwise Array of class tokens | Boolean means every supplied token is present. |
| `removeClasses` | `removeClasses(a)` | Same Element | Trims each supplied token before removal. |
| `toggleClasses` | `toggleClasses(a)` | Same Element | Toggles one token. |
| `i` | `i()` | Same Element | Identity helper. |
| `setChild` | `setChild(a)` | Same Element | Appends one Node or each member of an Array; DocumentFragment children are moved into the receiver and the fragment is emptied. Native DOM exceptions propagate; an invalid member partway through an Array throws after earlier members have already been appended. DocumentFragment and partial-failure behavior passed in Chromium/Firefox and source/minified parity in run #383. |
| `siblings` | `siblings(a)` | Next/previous Element for named direction; intended Array otherwise | Next/prev and default ReferenceError passed in source/minified parity in run #399; default branch references undeclared `target`, so treat as defective. |
| `setAdjacent` | `setAdjacent(a, b)` | Same Element | Normal truthy position/Element arguments hit early return; no insertion. |
| `setHtml` | `setHtml(a, b = false)` | Same Element on truthy HTML; assignment result on falsy HTML | Truthy normal HTML input is ignored; source/minified parity passed in run #399. Falsy path assigns innerHTML/outerHTML and returns the assignment result rather than the Element; null converts to an empty string, and outerHTML assignment can detach the host. These falsy/outerHTML branches passed source/minified parity in run #413. Unsafe HTML sink. |
| `getHtml` | `getHtml(a, b = false)` | Markup string, or Boolean substring test | Truthy needle tests inner/outer markup; no needle returns innerHTML. |
| `setContent` | `setContent(a)` | Same Element | Always clears innerHTML first, then appends one Node or each Array member. An empty Array clears the host; a DocumentFragment is consumed; invalid strings/members throw native TypeError after clearing and may leave earlier array members appended. These replacement and partial-failure contracts passed in Chromium/Firefox with source/minified parity in run #395. |
| `setText` | `setText(a)` | Same Element | Writes only for truthy input; cannot set empty string through this method. Empty-string no-op and receiver identity passed in source/minified parity in run #399. |
| `getText` | `getText(a)` | Text string, or Boolean substring test | Truthy needle returns containment Boolean. |
| `setValue` | `setValue(a)` | Same Element | If element has a value property and input is truthy, assigns it; otherwise assigns empty string, including on elements without value property (creates/sets property). Text input, checkbox `.value`, select, textarea, falsy clearing and receiver identity passed in Chromium/Firefox; source/minified parity passed in run #383. This does not toggle checkbox `.checked`. |
| `getValue` | `getValue(a, b = false)` | Same Element when no truthy needle; otherwise Boolean | Default tests substring; mode true returns `Boolean(indexOf)`, false at index 0 and true when absent. Default/mode/no-argument cases passed in source/minified parity in run #399. |
| `then` | `then(a)` | Callback result if callable; otherwise undefined | Callback receives Element. |
| `fax` | `fax()` | Same Element when not FORM; undefined for FORM | Form path has no completed implementation. |
| `on` | `on(a, b)` | Same Element | Adds native listener only when event is string and callback function; invalid inputs still return Element. |

## NodeList.prototype extensions

| Method / property | Exact signature | Return contract | Side effects / caveats |
|---|---|---|---|
| `parent`, `name` | getters | Same NodeList | Not equivalent to Element accessors. |
| `setAttributes`, `setAttributeName`, `removeAttributes` | `(a)` | Same NodeList | Loops over members; setAttributes stops per element at first falsy value. |
| `setStyles`, `removeStyles` | `(a)` | Same NodeList | Loops declarations/properties over all members. |
| `getStyles` | `getStyles()` | undefined | Stub. |
| `setClasses`, `removeClasses`, `toggleClasses` | `(a)` | Same NodeList | Mutates each member. |
| `getClasses` | `getClasses()` | Same NodeList | Stub, not a collection of class lists. |
| `i` | `i(a = '')` | Indexed member or same NodeList | Uses global `isNaN`; empty NodeList guard returns same collection. |
| `setChild`, `setAdjacent`, `setHtml`, `getHtml`, `setContent`, `setText`, `getText`, `getValue`, `fax` | no effective arguments | Same NodeList for most stubs | No-op stubs; do not infer bulk equivalents. |
| `siblings` | `siblings(a)` | Intended next sibling or Array | Indexes first Element again as `t[0]`; normal non-empty NodeList path is defective. |
| `setValue` | `setValue(a)` | Same NodeList | Sets/clears value on each member with a value property; generic elements without value are ignored; empty collection returns itself. Input, checkbox .value, select, textarea, falsy clearing and empty-list identity passed in Chromium/Firefox, with source/minified parity in run #392. This does not toggle checkbox .checked. |
| `then` | `then(a)` | Callback result if callable; otherwise undefined | Callback receives NodeList. |
| `on` | `on(a, b)` | Same NodeList for valid inputs; undefined on invalid/empty guard path | Adds listener to each member. Unlike Element.on, invalid inputs can return undefined. |

## Other prototype extensions

| Target / method | Signature | Return contract / behavior |
|---|---|---|
| Document / Window `on` | `on(a, b)` | Always returns receiver; registers only for string event and function callback. |
| Function `then` | `then(a)` | Calls callback with function receiver and returns callback result; otherwise undefined. |
| Object `setValues` | `setValues(a, b, c = false)` | Calls missing static `ActiveQuery.isNaO` before evaluating key/value guards; currently throws TypeError on invocation. Unsafe. |
| Object `hasValues` | `hasValues(a)` | Calls missing static `ActiveQuery.isNaO` before evaluating key guard; currently throws TypeError on invocation. Unsafe. |
| String / Number `trim` | `trim(charlist = null)` | Returns custom-trimmed string for matching primitive receiver; custom whitespace includes U+200B and excludes U+FEFF. String.prototype.trim is replaced. |

## Usage rule

A source-observed return shape is not a recommendation. Methods marked defective, stubbed, unsafe or pending remain excluded from recommended usage until runtime tests and source/minified comparison close the relevant contract.

References: [API inventory](api-inventory.md), [behavior matrix](behavior-matrix.md), [contract closure matrix](api-contract-closure-matrix.md), [type predicates and guards](type-predicates-and-guards.md), [runtime validation matrix](../testing/runtime-validation-matrix.md).


### Defect behavior verified across source/minified builds

Run [#397](https://github.com/amrshah/activequery-labs/actions/runs/43820906840) confirms matching outcomes for `Array.setSort` (ReferenceError in strict module code), `Array.i` (TypeError from missing `ActiveQuery.isNaN`), `Object.setValues` / `hasValues` (TypeError), and selected `isNaS` / `isNaF` predicate cases. This documents existing behavior; it does not imply these APIs are correct or recommended.


### Array helper edge cases verified across source/minified builds

Run [#408](https://github.com/amrshah/activequery-labs/actions/runs/43823338803) confirms matching behavior for `Array.getIndex` with the `=` operator (the implementation assigns the tested property and returns index 0) and `Array.setItem` with ordinary truthy index/value arguments (the array remains unchanged and the receiver is returned). These are recorded as observed implementation defects, not desired API behavior.


### Element text/HTML falsy branches verified across source/minified builds

Run [#413](https://github.com/amrshah/activequery-labs/actions/runs/43824000685) confirms `setText` ignores `""`, `0`, `false` and `null`, retaining existing text and returning the element. `setHtml` takes the opposite branch for falsy values: it assigns the value to `innerHTML` and returns the assigned value; `null` becomes empty markup. With the outerHTML flag, assigning an empty string removes the host element and returns the empty string.


### Array.getCount fallback behavior verified across source/minified builds

Run [#416](https://github.com/amrshah/activequery-labs/actions/runs/43824307566) confirms an unrecognised operator such as `>` enters the delimiter fallback branch rather than performing numeric comparison. The fallback counts exact first-token matches or string values containing the supplied search value; a no-match returns zero. The `*` substring branch throws `TypeError` when the target property is non-string and has no `.includes` method.


### Lifecycle event mapping verified across source/minified builds

Run [#417](https://github.com/amrshah/activequery-labs/actions/runs/43824492132) confirms instance lifecycle mapping for `offline`, `online` and `close`, ignores unknown event names, and preserves receiver identity across AQJS source and minified distributions. Repeated construction and unusual timing remain open.

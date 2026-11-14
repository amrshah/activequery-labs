# AQJS Prototype Behavior Matrix

Source revision: `ActiveQuery.js` SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.
Evidence: source-confirmed behavior; selected contracts are browser-tested in Chromium and Firefox, with broader API coverage still pending.

## Element vs NodeList API parity

| API | Element implementation | NodeList implementation | Notes |
|---|---|---|---|
| `parent` | Returns parentNode except HTML parent returns self | Returns collection itself | Not equivalent |
| `name` | Returns nodeName | Returns collection itself | Not equivalent |
| `setAttributes` | Processes name/value pairs; stops on falsy value | Applies pairs to each element; stops per element at falsy value | Both have early-stop behavior |
| `setAttributeName` | Sets empty attributes | Applies to each node | Similar intent |
| `removeAttributes` | Removes named attributes | Removes names from all nodes | Similar intent |
| `setStyles` | Parses strings and assigns style property | Applies each declaration to every node | Parsing and assignment need CSS property tests |
| `getStyles` | Returns array of truthy inline/computed values | Returns undefined | Collection stub |
| `removeStyles` | Removes named inline properties | Removes from every node | Similar intent |
| `setClasses` | Adds names | Adds names to each node | Similar intent |
| `getClasses` | Returns class list or all-present boolean | Returns collection itself | Collection stub |
| `removeClasses` | Removes trimmed names | Removes names from each node | Similar intent |
| `toggleClasses` | Toggles one class | Toggles one class on every node | Similar intent |
| `i` | Returns self | Returns indexed member if guard passes | Not equivalent |
| `setChild` | Appends one node or array | No-op returning collection | Collection stub |
| `siblings` | `next`/`prev` work; default/all-siblings branch references undeclared `target` and throws | NodeList implementation indexes the first Element again (`t[0]`), so `next`/default paths throw | Not equivalent; only Element next/prev are straightforward |
| `setAdjacent` | Attempts insertion by alias, but guard blocks truthy arguments | No-op | Not currently usable as a normal setter |
| `setHtml` | Attempts inner/outer HTML assignment, but guard blocks truthy input | No-op | Not currently usable as a normal setter |
| `getHtml` | Returns HTML or substring boolean | No-op returning collection | Collection stub |
| `setContent` | Clears then appends nodes | No-op | Collection stub |
| `setText` | Sets textContent only for truthy input | No-op | Collection stub |
| `getText` | Returns textContent or substring boolean | No-op | Collection stub |
| `setValue` | Sets truthy value; clears on falsy input | Sets/clears value across controls | Similar but falsy values collapse to empty |
| `getValue` | Returns substring boolean for truthy needle; returns element when omitted | Returns collection itself | Not a conventional getter |
| `then` | Calls callback with Element | Calls callback with NodeList | Callback helper; Array also receives a `then` method, making Arrays thenables and creating Promise-assimilation hazards |
| `fax` | Incomplete form-specific behavior | No-op | Do not rely on it |
| `on` | Adds listener to Element | Loops and adds listener to each node | Similar intent |

## Array extensions

| Method | Source lines | Contract and cautions |
|---|---:|---|
| `i(a='')` | 320–323 | Intended index helper; references `ActiveQuery.isNaN`, which was not found as a static member. |
| `then(callback)` | 324–325 | Invokes callback with array if callable. This makes Arrays thenables; wrap/copy them before returning across Promise-based boundaries to avoid resolver assimilation. |
| `getIndex(key,op,value)` | 326–337 | `==` searches by loose equality; `=` branch assigns value inside predicate instead of comparing. |
| `getCount(key,op,value)` | 338–372 | Counts by loose equality, strict equality, substring operator `*`, or a default branch whose semantics need validation. |
| `setSort(...args)` | 373–407 | In-place sort by nested key paths; comparator assigns undeclared `aVal` and `bVal`. |
| `setItem(index,value)` | 409–413 | Guard returns for truthy arguments, so ordinary calls skip insertion. |
| `has(key,value)` | 414–419 | Strict equality existence check. |
| `getIndexs(key,value)` | 420–425 | Returns first matching index or false; exact spelling is `getIndexs`. |

## Object extensions

| Method | Source lines | Contract and cautions |
|---|---:|---|
| `setValues(key,value,c=false)` | 872–877 | Calls `ActiveQuery.isNaO(this)` as though it were static; the inspected class defines it as an instance method, so the call throws TypeError. |
| `hasValues(key)` | 878–881 | Calls missing static `ActiveQuery.isNaO(this)` and throws TypeError before property lookup. |

## String and Number extensions

Both targets receive a method named `trim(charlist=null)` (Number lines 817–869; String implementation around 886–917). The implementation converts the receiver to a string and performs custom trimming against a whitespace list. The String extension replaces the native method body through `Object.defineProperties`; because the existing native property is configurable and writable, omitted descriptor flags retain their existing values (writable/configurable true, enumerable false). The replacement excludes U+FEFF and includes U+200B, differing from native ECMAScript trimming.

## Event registration surfaces

- `ActiveQuery.prototype.on(name,callback)` maps the framework lifecycle names `ready`, `init`, `run`, `offline`, `online`, `close` to browser events.
- `Element.prototype.on(event,callback)`, `Document.prototype.on` and `Window.prototype.on` add a native event listener and return the target.
- `NodeList.prototype.on(event,callback)` loops through the collection and adds listeners.

The overloaded name `on` has different accepted event vocabularies depending on the receiver. Do not confuse the framework lifecycle names with arbitrary DOM event names.

## Usage recommendation

Until runtime validation is complete, treat only the simplest source-confirmed and tested operations as candidates for use. Avoid methods marked as stubs, suspicious or likely broken. Native DOM APIs are preferable when they provide a clearer and safer contract.

# AQJS Runtime and Extension Model

Evidence status: source-confirmed for statements directly described below; runtime behavior remains unverified unless a test record says otherwise.
Source: [ActiveQuery.js](https://github.com/ActiveQuery/JS/blob/main/ActiveQuery.js), pinned SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.

## Module and export

The source declares a named export:

```js
export const ActiveQuery = Object.freeze(class { /* ... */ });
```

It is an ES module. The source does not declare a default export. A consuming page must load it as a module or bundle it through a compatible toolchain. The source header identifies ES2020 compatibility in the README, but compatibility must be checked against actual syntax and target runtimes.

## Constructor and instance state

The constructor accepts `a = null` and initializes `this.initlog = []`. It copies references to these static functions onto the instance:

- `DOM`
- `nestedDOM`
- `extend`
- `isEmpty`
- `exit`
- `keepOn`

The source assigns `this.extend` twice; this is redundant but observable source structure.

The constructor registers a `readystatechange` listener on `document`. When the target's `readyState` equals `complete`, it iterates `initlog` and invokes entries whose type is `function`.

**Important unresolved contract:** the inspected constructor does not expose a dedicated public method for adding callbacks to `initlog` in the constructor block. Determine intended population path and behavior with further source/runtime investigation before relying on this mechanism.

## Optional global/prototype aliasing

If the constructor argument matches the source condition `/[a-z$]/`, the constructor:
- assigns `window[a] = ActiveQuery.DOM`;
- assigns `Element.prototype[a + a] = ActiveQuery.nestedDOM`;
- assigns `NodeList.prototype[a + a] = ActiveQuery.nestedDOM`;
- assigns `Object.prototype[a + a] = ActiveQuery.nestedDOM`.

This is a global side effect. It can overwrite an existing window property and changes native prototype surfaces. The regex condition is permissive: it tests whether the string contains at least one lowercase ASCII letter or dollar sign; it is not a strict identifier validator. Do not enable it casually in a production portal or shared page.

## Static selector functions

### `ActiveQuery.DOM(selector)`

Implementation uses `document.querySelectorAll(selector)` and branches on result count:
- zero matches: returns `null`;
- one match: returns the Element;
- multiple matches: returns the NodeList.

This variable return type is a significant API design constraint. Callers must handle null, Element and NodeList rather than assuming a collection.

### `ActiveQuery.nestedDOM(selector)`

The implementation first validates that the argument is a non-empty string and that `this` is an Element, Document, NodeList or HTMLCollection; otherwise it returns `this`.

For Element/Document-like contexts with `querySelectorAll`, it queries descendants and returns the original context when there are no matches, a single Element for one match, or a NodeList for multiple matches.

For NodeList or Array contexts, it loops through each item, queries descendants, flattens matches into a plain array, and returns the original collection if no matches, one Element if one match, or the plain array if multiple matches.

Do not treat its collection result as always a NodeList. Its no-match behavior also differs from `DOM()`.

## Static extension mechanism

`ActiveQuery.extend(...args)` dispatches on the first argument when it is a string. Observed built-in targets include:
- `dom` and `htmltag` for custom element registration paths;
- `element`, `nodelist`, `object`, `window`, `array`, `string`, `number`, `function`, `navigator`, `document`;
- `ActiveQ` for `ActiveQuery.prototype`.

Most prototype branches use `Object.defineProperties` and expect an object descriptor map. This means descriptors, enumerability, writability and configurability are determined by supplied descriptors, not by assignment semantics.

The default branch accepts a constructor/function and descriptor object, then defines descriptors on that constructor's prototype.

## Instance lifecycle helper

`on(name, callback)` accepts a string and function. Recognized names and browser events:
- `ready` → `DOMContentLoaded`
- `init` → `load`
- `run` → `pageshow`
- `offline` → `offline`
- `online` → `online`
- `close` → `beforeunload`

Unrecognized names are ignored; the method returns the instance. This method is distinct from the prototype-added `on(eventName, callback)` methods for Element, Document, Window and NodeList.

## Architecture cautions

- AQJS augments built-in prototypes; assess collisions and cross-library interactions.
- `Object.prototype` augmentation has unusually broad impact because nearly all ordinary objects inherit from it.
- Selector helpers have polymorphic return types.
- Some methods are intentionally no-op stubs on collection types; see the API matrix.
- Do not infer modern framework abstractions such as reactivity, virtual DOM or component lifecycle from the product philosophy alone. Document only behavior present in source and tested.

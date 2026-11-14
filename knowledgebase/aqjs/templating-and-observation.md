# AQJS Templating, Filtering and Mutation Observation

Source: `ActiveQuery.js` SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.
Status: source inspection complete at a high level; behavior and security tests pending.

## Element.sancha(args)

The source adds `sancha` to Element.prototype.

### Static mode

When `args.static` is truthy:
- if no `args.template` is supplied, current `innerHTML` is used;
- with `args.swap`, the target's `innerHTML` is replaced;
- otherwise the template is appended using `insertAdjacentHTML('beforeend', ...)`;
- the element is returned.

### Data mode

The method reads a template, finds placeholder-like expressions, iterates `args.data`, builds a mapping from placeholder names to properties on each data item, substitutes values into HTML strings and either replaces or appends the resulting HTML. An optional `args.variable` callback is invoked inside the data loop; an optional `args.then` callback is invoked after rendering.

### Risks and caveats

- Uses `insertAdjacentHTML` and `innerHTML`, so untrusted data can become an XSS vector unless correctly escaped.
- References undeclared `variables`, `ii` and `i` in parts of the implementation. Since the library is an ES module, assigning to undeclared `ii`/`i` throws ReferenceError in data mode before rendering. Static mode returns before this loop and can work.
- The placeholder parsing and replacement regular expressions have narrower syntax than a full template engine.
- `args.then` is called without checking it is a function in the shown path.
- The no-data path inserts the literal text "No Data found".
- The method mutates `args` by assigning fields such as `template`, `list`, `mapping` and `vap`.

Do not recommend `sancha` for untrusted or production data until escaping, identifier scope, callback validation and edge cases are verified.

## Element.sift(selector)

The source adds `sift` to Element.prototype. Intended behavior appears to be a keyboard filter:
- bind a keyup handler to the current element;
- read input value or text content;
- select descendants matching the supplied selector;
- compare each descendant's `sift` attribute or text content;
- toggle the `hide` class based on the match;
- treat `*` as show all.

However, the method begins with `if (!!a) return this;`. A normal non-empty selector therefore returns before installing the handler. The falsy path proceeds to querySelectorAll with an empty/invalid selector. See JS-011.

## Element.watch(args)

The source adds `watch` to Element.prototype and uses MutationObserver. It:
- chooses `args.element || this` as the observed target;
- creates an observer callback that iterates mutations;
- assigns `this.watched = mutation.target` inside the callback;
- calls `args.then()`;
- builds observer options from `subtree`, `attribute`, `children`, `values` and `filter`.

### Risks and caveats

- The callback invokes `args.then()` without validating it exists or is callable.
- The shown method returns the result of `observer.observe`, which is normally undefined, not the observer instance.
- The method does not expose a clear disconnect handle in the shown API.
- The callback uses `this` inside a normal function passed to `mutations.forEach`. In strict module code the inner callback's `this` is undefined, so `this.watched = ...` throws TypeError before `args.then()` is called.
- The fallback implementation is large and must be examined separately.
- The fallback guard reads `MutationObserver` as a bare identifier before assigning `window.MutationObserver`; if the global is absent, the check itself may throw.

## Safe implementation guidance

Use native template APIs or a vetted rendering layer for untrusted data. Use native event listeners for filtering. Use native MutationObserver directly when you need observer lifecycle control, unless AQJS behavior has been verified and provides a tested advantage.

Do not patch upstream AQJS. If a safe wrapper or workaround is created in ActiveQuery Labs, label it as a Labs helper and document the difference.

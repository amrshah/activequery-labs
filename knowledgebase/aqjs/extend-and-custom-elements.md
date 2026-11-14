# AQJS Extension Mechanism and Custom Element Registration

Source: `ActiveQuery.js` SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`, approximately lines 113–181.
Status: source inspection; browser compatibility and edge cases pending.

## ActiveQuery.extend(...args)

The static method dispatches on the first argument when it is a string. Recognized target names:
- `dom`
- `htmltag`
- `element`
- `nodelist`
- `object`
- `window`
- `array`
- `string`
- `number`
- `function`
- `navigator`
- `document`
- `ActiveQ`

For prototype targets, the second argument must have `constructor === Object`; the method then calls `Object.defineProperties(target.prototype, descriptorMap)`.

The default branch accepts a function/constructor in argument 1 and a descriptor object in argument 2, then applies the descriptors to that constructor's prototype.

### Descriptor semantics

The extension maps use property descriptors such as:
- `{ value: function (...) { ... } }`
- `{ get: function () { ... } }`

Because the descriptors generally omit `enumerable`, `writable` and `configurable`, the ECMAScript defaults are false. Methods added this way are normally non-enumerable, non-writable and non-configurable.

This does not remove the global side effect: the properties still become part of shared native prototypes. It only affects their descriptor flags.

### Guard and collision risks

- Several branches access `a[1].constructor` without validating that `a[1]` exists.
- The `dom` and `htmltag` branches call `a[2].toString()` without a null/undefined guard.
- Existing non-configurable prototype properties may make `Object.defineProperties` throw.
- The method does not consistently validate descriptor shapes.
- The `ActiveQ` target spelling is exact and differs from the exported class name `ActiveQuery`.

## Custom element registration

### `extend("dom", name, constructor, extendsTag?)`

The source:
- checks whether the constructor's string representation contains `class`;
- validates the name using `/^[a-z][a-z-]*[a-z]$/`;
- inspects `constructor.__proto__.name`;
- registers an autonomous custom element when the constructor prototype name matches `HTMLElement`;
- registers a customized built-in when the prototype name matches the `HTML...Element` pattern and the `extendsTag` argument is lowercase letters.

Cautions:
- The name regex does not require a hyphen, although the browser Custom Elements specification requires a hyphen in valid custom element names. A name can pass the AQ regex and still be rejected by `customElements.define`.
- The regex excludes digits and several valid name characters.
- Constructor type and argument presence are not validated robustly.
- Customized built-in elements have browser support differences; test target engines.

### `extend("htmltag", name, constructor, extendsTag)`

The source checks:
- `name` is a string;
- constructor string contains `class`;
- `extendsTag` is a string;

then calls `customElements.define(name, constructor, { extends: extendsTag })`.

It does not perform the same name regex validation as the `dom` branch, and it does not validate that the constructor extends the correct built-in class.

## Recommended use

Treat `extend` as a low-level global extension mechanism, not a safe dependency-injection API. Prefer module-scoped helpers and native custom-element registration when possible. If using AQJS registration:
1. validate custom element names against the browser specification;
2. validate the class inheritance chain;
3. test in Chromium, Firefox and WebKit;
4. test duplicate registration and invalid arguments;
5. document global prototype mutations and collisions;
6. avoid the default constructor alias side effect described in `aqjs-runtime-model.md`.

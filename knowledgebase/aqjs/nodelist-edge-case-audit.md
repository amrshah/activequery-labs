# AQJS Element and NodeList Edge-Case Audit

Source: `ActiveQuery.js` blob SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.
Status: source-level audit completed for the extension families below. Existing runtime tests cover selected cases only; this page does not claim exhaustive browser validation.

## Collection contract: NodeList is not an Element batch facade

| Method | Element behavior | NodeList behavior | Agent guidance |
|---|---|---|---|
| `parent` / `name` | Parent/nodeName | Returns collection itself | Do not use as equivalent metadata accessors. |
| Attributes | Mutates one Element | Loops members | NodeList `setAttributes` stops independently on first falsy value per member. |
| Styles | Set/read/remove on one Element | Set/remove loop; `getStyles` is an empty function | Never expect collection style readback. |
| Classes | Set/get/remove/toggle on one Element | Set/remove/toggle loop; `getClasses` returns collection unchanged | No aggregate membership query exists. |
| `i` | Identity | Index helper with `isNaN` and empty-collection guard | NodeList numeric index path differs; no explicit bounds validation. |
| `setChild` | Appends Node(s) | Returns NodeList unchanged | Stub; no append occurs. |
| `siblings` | next/prev works; default references undeclared `target` | Double-indexes first member | Both default paths are defective; NodeList next path evaluates `this[0][0]`. |
| `setAdjacent` | Normal args short-circuit before insertion | Returns collection unchanged | No NodeList equivalent. |
| HTML/content/text | Element setHtml truthy guard blocks normal writes; getHtml works; setContent appends; setText/getText work | setHtml/getHtml/setContent/setText/getText are stubs | Avoid treating same-named collection APIs as bulk implementations. |
| Value | setValue writes truthy value or clears; getValue has unusual Boolean modes | setValue loops; getValue is stub | NodeList getValue cannot read member values. |
| `then` | Callback receives Element | Callback receives NodeList | Callback result returned; absent/non-function callback gives undefined. |
| `on` | Valid listener adds and always returns Element | Valid listener loops; invalid/empty guard returns undefined | Return shape differs. |
| `fax` | Non-FORM returns Element; FORM returns undefined | Stub returns collection | Neither provides useful form submission behavior. |

## Confirmed stub inventory

The following NodeList methods have empty/no-op bodies in the pinned source:
- `getStyles()` → undefined.
- `getClasses()` → NodeList itself.
- `setChild()`, `setAdjacent()`, `setHtml()`, `getHtml()`, `setContent()`, `setText()`, `getText()`, `getValue()`, `fax()` → NodeList itself.

These return values are not evidence of successful work. A chaining-looking return of `this` must not be mistaken for a completed mutation or query.

## High-risk edge paths

1. **Empty NodeList guards:** many methods call `ActiveQuery.keepOn(this)`; an empty collection returns early. Whether that means same collection or undefined depends on the individual method's return statement.
2. **NodeList siblings:** implementation sets `t = this[0]`, then accesses `t[0]`; an Element is not indexable as a collection. The default branch also uses parent traversal from this invalid value. Treat all paths as unsupported until isolated tests confirm exact thrown errors.
3. **NodeList on:** empty collections and invalid arguments return undefined due early return; valid listener registration returns the NodeList.
4. **NodeList i:** uses global `isNaN`, not the missing `ActiveQuery.isNaN` reference used by Array.i. It may return same collection for non-numeric values and may return undefined for out-of-range numeric indices.
5. **Element setValue:** falsy values clear the value rather than being assigned. This prevents using the method to set numeric zero or boolean false as distinct values.
6. **Element getValue:** mode false is substring containment; mode true is `Boolean(indexOf)`, not a conventional value getter. It is false when match begins at offset zero and true when the needle is absent.
7. **Element setHtml / setAdjacent:** ordinary truthy arguments return early. The HTML method's falsy path can write an empty/falsy value; it is not a usable normal setter.

## Safer implementation guidance

- Use native `querySelectorAll` and explicit loops for collection mutation.
- Use native `Element.matches`, `classList`, `getAttribute`, `textContent`, `innerHTML` only where trusted/sanitized, and `value` directly.
- Prefer explicit return values from application-owned helpers; do not rely on AQJS chainability where stubs return `this`.
- Never use `innerHTML` with untrusted content. Prefer `textContent` or DOM node construction.
- Treat unsupported methods as unsupported; do not patch upstream AQJS in the knowledgebase exercise.

## Runtime status

Latest confirmed suite: run [#395](https://github.com/amrshah/activequery-labs/actions/runs/43820353410), 132 authored tests / 264 browser executions (263 passed, one Firefox mobile-emulation skip). Element setChild and setValue now include DocumentFragment, partial-failure and native form-control coverage. NodeList setValue now covers input, checkbox .value, select, textarea, generic-element exclusion and empty-collection identity, with source/minified parity. Exhaustive NodeList stub argument coverage and Element i remain incomplete.

References: [API signature reference](api-signature-reference.md), [prototype behavior matrix](behavior-matrix.md), [runtime validation matrix](../testing/runtime-validation-matrix.md), [API contract closure matrix](api-contract-closure-matrix.md).

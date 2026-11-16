# AQCSS / AQJS Display Utility Bridge

## Scope

AQCSS and AQJS do not expose a dedicated integration API. They share the DOM: AQCSS matches classes and attributes; AQJS can mutate those same class and attribute values. CSS then recalculates style using the normal browser cascade.

This page records one tested representative interaction. It does not claim every AQCSS utility has been tested through every AQJS mutator.

## Dynamic class bridge

AQJS Element methods:
- `setClasses(["hide"])` adds the class and returns the Element receiver.
- `setClasses(["show"])` adds another class and returns the receiver.
- `removeClasses(["show"])` removes only that class and returns the receiver.
- `removeClasses(["hide"])` removes the remaining class and returns the receiver.

AQCSS display rules in the pinned stylesheet:
- `.hide` and `[hide]` set `display:none!important`.
- `.show` and `[show]` set `display:block!important`.
- The show declaration occurs after the hide declaration. When both classes match the same element, their specificity and importance are equal, so the later show rule wins.
- Removing show exposes the still-present hide rule again.

A key caution: `.show` means force `display:block`; it does not restore the element's previous display mode. In the tested fixture, an otherwise unclassed `div` starts at `inline-block` under the AQCSS baseline, becomes `none` under hide, becomes `block` when show is added, returns to `none` when show is removed, and returns to `inline-block` only when hide is removed.

## Runtime evidence

The direct and source/minified parity tests passed in [browser workflow #428](https://github.com/amrshah/activequery-labs/actions/runs/43826836114), Chromium and Firefox:
1. initial computed display: `inline-block`;
2. after `setClasses(["hide"])`: `none`;
3. after `setClasses(["show"])`: `block`;
4. after `removeClasses(["show"])`: `none`;
5. after `removeClasses(["hide"])`: `inline-block`;
6. all four mutators return the same Element receiver.

## Other integration boundaries

- AQJS `DOM` / `nestedDOM` query the DOM; they do not have special knowledge of AQCSS utilities.
- AQJS `setStyles` writes ordinary inline style declarations. An AQCSS utility using `!important` can still win over a normal inline declaration.
- AQCSS responsive utilities are media-query driven; no AQJS call is needed when the viewport changes.
- AQCSS pseudo-classes such as `:hover`, `:focus` and `:disabled` respond to browser state. AQJS event listeners do not themselves change those pseudo-class states; they can add/remove ordinary classes when an application needs a class-driven state.
- Attribute-based utilities can be activated by AQJS attribute helpers, but this page does not claim a full attribute-utility test matrix.

## Evidence boundaries

The tested display bridge is one end-to-end example, not exhaustive integration proof. Keep the broader AQCSS cascade maps and AQJS method contract matrix as the authority for individual selector and API behavior.


## Last validated

The integration behavior described here was included in the latest knowledgebase-validation run [#429](https://github.com/amrshah/activequery-labs/actions/runs/43827183631), which passed 297 browser cases with one documented Firefox mobile-emulation skip.

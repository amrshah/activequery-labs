# AQJS Element.watch — Observer Contract Audit

Source: ActiveQuery.js v25.6.0, pinned SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`, lines 1045–1142.

## Observed contract

The Element prototype method accepts an optional object and derives:

| Input key | MutationObserver option |
|---|---|
| `element` | observation target, falling back to the receiver |
| `subtree` | `subtree` |
| `attribute` | `attributes` |
| `children` | `childList` |
| `values` | `characterData` |
| `filter` | `attributeFilter` |
| `then` | invoked for each mutation, but callback context is broken |

The method constructs a MutationObserver, calls `observe(target, config)`, and returns that call's result. The standard MutationObserver.observe() method returns undefined, so callers do not receive the observer instance and cannot disconnect it through the return value.

## Verified failure modes

- Calling `watch()` with no options leaves subtree, attributes, childList and characterData false. Native MutationObserver rejects an observe call with no observation type enabled, raising TypeError.
- The callback uses an unbound Array.forEach callback and writes `this.watched`. In the module's strict execution context, this is undefined; the callback throws TypeError before invoking the supplied `then` callback. Existing browser tests reproduce this.
- NodeList.watch is a no-op stub returning the NodeList receiver.

## Validation in progress

A new Playwright fixture stubs MutationObserver to capture the target and option object without relying on timing. It also checks the default invalid-options path and NodeList stub, and compares source/minified builds. Results will be recorded after CI completes.

## Integration guidance

Do not rely on Element.watch as a usable event subscription abstraction until the callback binding, observer lifecycle/disconnect access and option defaults are corrected upstream. If observation is required, use the native MutationObserver directly and retain the instance so it can be disconnected.

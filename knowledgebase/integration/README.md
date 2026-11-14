# AQCSS + AQJS Integration Notes

Status: initial source-led guidance; runtime integration tests pending.

## Loading the framework

AQCSS is a stylesheet and AQJS is an ES module. Keep their source and license notices separate. Prefer version-pinned assets for reproducible examples rather than floating `@main` URLs in production.

Example structure (the exact URLs/packaging should be pinned to a verified release or commit):

```html
<link rel="stylesheet" href="path/to/ActiveQuery.css">
<script type="module">
  import { ActiveQuery } from "./path/to/ActiveQuery.js";
  const aq = new ActiveQuery();
  // use only APIs documented and tested in the knowledgebase
</script>
```

The AQJS source is an ES module with a named `ActiveQuery` export. Do not use a classic non-module script tag for this import pattern.

## Recommended engineering posture

- Start with semantic HTML and native browser behavior.
- Use AQCSS selectors only after confirming their source rule and breakpoint behavior.
- Use AQJS only where its actual implementation provides a tested benefit.
- Avoid the constructor's optional global alias unless a project has explicitly accepted the prototype/global mutation.
- Prefer Element-level APIs only after confirming their guards and return values.
- Do not assume NodeList methods are equivalent to Element methods; the source contains no-op stubs.
- Escape or safely construct user-provided data before using `sancha`, which writes HTML strings.
- Keep custom CSS scoped and clearly separated from AQCSS.
- Keep app-specific JavaScript separate from AQJS itself.

## Progressive enhancement

The framework README describes progressive/event-driven behavior, but each feature's actual enhancement path must be established from code and tests. A robust implementation should retain meaningful semantic HTML when JavaScript fails or is unavailable.

## Dark mode note

The inspected AQCSS root contains theme-related custom properties and a canvas default of white. The existence of tokens makes theme customization plausible, but the source inspection so far has not established a built-in dark-mode switch or `prefers-color-scheme` implementation. Dark mode is deliberately deferred until the selector/token catalogue and runtime behavior are fully understood.

## Runtime test cases required

1. Load AQCSS with semantic HTML and confirm baseline styles.
2. Load AQJS as a module and instantiate `ActiveQuery`.
3. Exercise `DOM` with zero, one and multiple matches.
4. Exercise `nestedDOM` with Element, Document and NodeList contexts.
5. Exercise Element methods and compare them with NodeList equivalents.
6. Exercise lifecycle events at different script-loading points.
7. Confirm no unintended global alias/prototype changes when constructor has no argument.
8. Check console errors and computed styles at each breakpoint.
9. Verify keyboard focus, touch pointer behavior and short landscape viewport behavior.
10. Record browser, version, viewport, exact steps and expected/actual results.

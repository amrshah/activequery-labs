# ActiveQuery Principles vs Inspected Implementation

Snapshot: 2026-11-14.
Sources: upstream AQCSS/AQJS README files, full inspected primary source files, and the author-published framework overview.

This document does not declare the framework defective. It identifies claims that need a concrete implementation/specification link before an agent can treat them as engineering guarantees.

## 1. Scope discipline vs global prototype mutation

**Public framework claim:** AQI describes local-scope discipline, reduced global scope bloat and security integrity.

**Inspected AQJS behavior:**
- `ActiveQuery.extend` augments Element, NodeList, Array, String, Number, Object, Function, Document, Window and Navigator prototypes.
- The constructor defaults its argument to null and tests `/[a-z$]/.test(a)`; null coerces to `"null"` and matches.
- Consequently `new ActiveQuery()` writes `window.null` and writes property `"0"` onto Element, NodeList and Object prototypes.
- The Object.prototype assignment uses ordinary assignment, making the added property enumerable.

**Assessment:** The default constructor has a broad global side effect that is in tension with the stated local-scope/security principle. Prototype augmentation may be an intentional design choice, but it needs a clear rationale, opt-in contract and collision/isolation strategy. The default-null aliasing appears especially suspect.

## 2. Native built-in override vs environment harmony

AQJS replaces the native `String.prototype.trim` implementation during module evaluation using `Object.defineProperties`. Because the native property already exists and is configurable/writable, omitted descriptor flags preserve its native writable/configurable true and enumerable false values. This remains a global semantic override that can conflict with other libraries, but it does not freeze the descriptor. See JS-033.

## 3. AQI batching and event delegation claims vs AQJS source

**Public AQJS README claim:** AQI efficiently batches BOM/DOM updates and delegates events.

**Primary source search results in `ActiveQuery.js`:**
- `addEventListener` occurs in lifecycle, Element, Document, Window and NodeList helpers.
- NodeList `on` loops through the collection and attaches a listener to each member.
- No occurrences were found for `requestAnimationFrame`, `cancelAnimationFrame`, `queueMicrotask`, `dispatchEvent`, `removeEventListener`, `delegate`, `closest(`, `batch`, `queue` or `requestIdleCallback`.
- The only timer references are `setTimeout` in `defer` and the MutationObserver fallback.
- The source contains a MutationObserver implementation, but no visible general-purpose DOM update scheduler or event delegation engine.

**Assessment:** The inspected AQJS file does not substantiate the advertised batching/delegation behavior. AQI may be a separate conceptual/runtime layer, but its source/specification was not located in this research. Treat these claims as unverified until the actual AQI implementation is provided.

## 4. Event-driven AQCSS vs stylesheet behavior

AQCSS provides CSS-state selectors, hover/focus styles, pointer/hover media queries and custom-property-driven appearance. These are declarative CSS capabilities.

The stylesheet itself does not execute events, schedule behavior or mutate the DOM. Event-driven behavior would require browser-native state changes, AQJS or another script layer.

**Assessment:** "Event-driven" is an ecosystem-level description, not a literal claim that the CSS file itself contains an event runtime.

## 5. Progressive enhancement and context-first execution

The public framework description emphasizes context-first execution and progressive enhancement. AQCSS contains responsive and input-capability media rules; AQJS adds browser event and DOM helpers. These are relevant primitives, but the inspected sources do not by themselves define a complete AQPE decision model, fallback protocol or context negotiation contract.

**Assessment:** The principle is plausible but not yet a fully specified implementation contract.

## 6. Dependency-free claim vs bundled third-party code

The AQCSS and AQJS READMEs describe dependency-free use. Their source/license notices nevertheless identify bundled third-party components:
- AQCSS: W3CSS and Normalize.css.
- AQJS: Array.sortBy and is-json.

**Assessment:** Interpret "dependency-free" as no external runtime package/import requirement, not as "contains no third-party code." Attribution and license obligations still apply.

## 7. Coverage badge

Both READMEs display a 100% coverage badge. Targeted checks of likely package/test/CI paths and code searches for common test frameworks did not surface a test suite or CI workflow in the inspected repositories.

**Assessment:** The badge is not independently substantiated by the evidence gathered. This does not prove tests do not exist elsewhere in the repositories; a complete tree/CI inspection is still required.

## 8. Blocking questions for full mastery

1. Is AQI a separate runtime, a design philosophy, or both?
2. Where is the AQI batching/delegation implementation and its test suite?
3. Is prototype augmentation intended to be mandatory, opt-in or legacy compatibility behavior?
4. Why does the default constructor alias null and mutate Object.prototype?
5. How does AQPE formalize context selection and fallback behavior?
6. What exact contract does AQS provide for transaction/event continuity?
7. Which claims are intended as architectural principles versus implemented guarantees?

Until these are answered or explicitly scoped out by authoritative documentation, full ActiveQuery ecosystem mastery remains blocked. AQCSS/AQJS source mastery can be assessed separately from unimplemented/unavailable ecosystem layers.

# AQJS Third-Party Code Provenance

Snapshot: 2026-11-16.
The AQJS README and source header identify Array.sortBy v1.2.2 (MIT) and is-json v2.0.1 (ISC) as third-party components. Exact upstream sources were inspected.

## Array.sortBy v1.2.2

- Upstream repository: https://github.com/eneko/Array.sortBy
- File: `Source/array-sortby.js`
- Blob SHA: `1b2e2750eb83fec3b6ae8d974e2ddcb6f9596a23`
- Header identifies version 1.2.2 and MIT-style license.

The AQJS `setSort(...args)` implementation is clearly adapted from the Array.sortBy algorithm:
- parses nested key paths from arrays or dotted strings;
- interprets leading plus/minus signs;
- resolves nested property paths;
- sorts the array in place using a comparator.

Differences in AQJS:
- the method is exposed as `setSort`, not `sortBy`;
- key path storage is local to the method;
- the upstream MooTools `Array.implement` / `Array.each` / `path.each` helpers are replaced with native loops;
- the comparator still assigns `aVal` and `bVal` without declarations.

This explains the undeclared comparator variables in JS-002: the issue appears inherited from the adapted third-party algorithm, not merely an accidental one-off typo. Because AQJS is an ES module (strict mode), those undeclared assignments throw ReferenceError when the comparator runs rather than silently creating globals. Preserve the third-party attribution if redistributing this code.

## is-json v2.0.1

- Upstream repository: https://github.com/joaquimserafim/is-json
- File: `index.js` at tag `v2.0.1`
- Blob SHA: `2a09a3aad9e1f4ae87b67ab8879532e640f81549`
- Package metadata identifies version 2.0.1 and ISC license.

The upstream implementation:
- requires a string (unless `pass_object` is true for plain objects);
- checks JSON object/array string shapes;
- includes a `strict` helper that attempts `JSON.parse`;
- rejects null and numeric values in the normal path.

The inspected AQJS `isJSON(a)` method is located at source line 257 and does **not** match this implementation:
- it performs no `JSON.parse`;
- it does not validate JSON syntax;
- it accepts values by `typeof` pattern;
- it returns true for `null` because `typeof null === "object"`;
- it returns false for an empty Array because `String([])` is empty and matches the initial empty-string regex, but returns true for a non-empty Array such as `[1]`;
- these outcomes and selected scalar/object cases passed in Chromium/Firefox and source/minified parity in run [#425](https://github.com/amrshah/activequery-labs/actions/runs/43825926932).

No `JSON.parse` call or recognizable is-json v2.0.1 implementation was found in the inspected `ActiveQuery.js` or `ActiveQuery.min.js` files.

**Assessment:** The third-party notice is present, but the referenced is-json implementation was not located in the inspected primary source files. The notice may refer to another bundled/older artifact or be stale. Do not remove the notice; seek upstream clarification and inspect the full repository tree before making a definitive attribution claim.

## Provenance and license policy

- Preserve the upstream notices in AQJS.
- Keep Array.sortBy MIT and is-json ISC notices distinct from AQJS OSL-3.0.
- Do not assume every similarly named method is copied from a dependency.
- Record exact upstream file/version/hash when a derivative implementation is identified.

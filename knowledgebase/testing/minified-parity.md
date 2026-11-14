# AQCSS/AQJS Source and Minified Distribution Parity

Snapshot: 2026-11-15.

## Pinned distribution artifacts

| Asset | Blob SHA | Size |
|---|---|---:|
| AQCSS source | `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62` | 118,361 chars |
| AQCSS minified | `bdda032d530661c32d9a9351a4ae95219347f081` | 108,833 chars |
| AQJS source | `b8ec9e5be8668d048eea3385cd9012dfddb69cf0` | 44,399 chars |
| AQJS minified | `594d778cd5fefe2caa039a7904343e385b77a50c` | 23,373 chars |

Both minified artifacts identify v25.6.0 in their copyright headers.

## AQCSS static comparison

A brace-aware lexical comparison of the source and minified stylesheet found:
- 1,417 rule blocks in each;
- 1,409 unique selector/context keys in each;
- no missing rule keys after normalizing whitespace around selector commas/combinators;
- declaration differences reduced to four media-query formatting differences after normalization of selector/declaration whitespace.

This suggests the minified CSS preserves the source rules. It is not a standards-compliant AST comparison or browser proof. The Playwright/PostCSS parity test now performs a more rigorous AST comparison in CI.

## AQJS distribution comparison

The minified JavaScript retains the named `ActiveQuery` export and the same top-level class structure/third-party notices. The Playwright parity tests compare core DOM selection/Element class helpers, native String.trim replacement descriptor flags, default-constructor prototype side effects, and selected edge contracts in both source and minified builds. The selected edge set includes Array.getIndex assignment behavior, Array.setItem truthy no-op behavior, Array-context nestedDOM passthrough, NodeList getHtml/getClasses return-this stubs, NodeList getStyles undefined return, Element.setText falsy no-op, and isArrayLike ReferenceError.

This is stronger than a core smoke test but remains a representative sample, not a full semantic equivalence proof. The AST catalog confirms matching exports, class method names, extension targets and extension method names; browser tests verify selected behavior. Every public method, all input classes, and all runtime error paths are not yet compared.

## CI pinning

The validation workflow checks out repository HEAD commits that contain the pinned files, then verifies each file's Git blob SHA before testing. The source and minified files are copied into the local test fixture only; upstream files remain untouched.

Run #244 passed the current 74-test suite, including AQCSS PostCSS AST parity and the selected AQJS source/minified edge-case parity tests. [Workflow evidence](https://github.com/amrshah/activequery-labs/actions/runs/43637027434). Full API semantic equivalence remains unproven.

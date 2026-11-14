# AQCSS/AQJS Source and Minified Distribution Parity

Snapshot: 2026-11-14.

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

The minified JavaScript retains the named `ActiveQuery` export and the same top-level class structure/third-party notices. The Playwright parity test compares core DOM selection and Element class helper behavior between source and minified builds.

That is only a representative smoke test, not a full semantic equivalence proof. Constructor side effects, every prototype method, edge cases and runtime errors still need parity testing.

## CI pinning

The validation workflow checks out repository HEAD commits that contain the pinned files, then verifies each file's Git blob SHA before testing. The source and minified files are copied into the local test fixture only; upstream files remain untouched.

The workflow is committed, but its actual run result must be retrieved and inspected before calling parity validated.

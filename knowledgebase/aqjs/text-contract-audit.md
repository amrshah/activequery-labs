# AQJS Element.setText and getText Contract Audit

Source: ActiveQuery.js v25.6.0, pinned SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`, lines 615–622.

## Observed behavior

- `setText(value)` writes `textContent` only when value is truthy. It returns the receiver in every case.
- Falsy values (including `0`, `false`, `null` and the empty string) leave existing content unchanged; they do not clear it.
- `getText()` returns the complete textContent string.
- `getText(query)` returns whether textContent contains the query using String.indexOf. It is a case-sensitive substring test, not a text-node query or normalized search.

## Integration note

Use native `textContent = ""` when the requirement is to clear content. Do not use `setText("")` as a clearing operation.

## Validation

The Playwright fixture checks truthy writes, falsy no-op behavior, receiver identity, whole-text retrieval, substring match and missing substring. It compares the pinned source and minified builds. CI run [#476](https://github.com/amrshah/activequery-labs/actions/runs/43844107916) passed 353 browser cases with one documented Firefox mobile-emulation skip.
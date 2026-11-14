# AQCSS Third-Party Component Provenance

Snapshot: 2026-11-14.

The AQCSS README and license notice identify W3CSS and Normalize.css as third-party components. The exact upstream source files were retrieved for comparison:

| Component | Upstream source | Version evidence | Blob SHA | Size |
|---|---|---|---|---:|
| W3CSS | [JaniRefsnes/w3css w3.css](https://github.com/JaniRefsnes/w3css/blob/master/w3.css) | File header: W3.CSS 4.10, February 2018 | `adba7084b1c49f34b7b2c4a60e15ce5193d314a3` | 23,291 chars |
| Normalize.css | [necolas/normalize.css 8.0.1](https://github.com/necolas/normalize.css/blob/8.0.1/normalize.css) | Tag/ref 8.0.1 | `192eb9ce43389039996bc2e9344c5bb14b730d72` | 6,138 chars |

## License evidence

- W3CSS source repository provides an MIT License, copyright Jani Refsnes.
- Normalize.css 8.0.1 provides an MIT License, copyright Nicolas Gallagher and Jonathan Neal.
- AQCSS source and README separately identify these third-party components and require notices to be retained.

## Initial source comparison

A brace-aware lexical comparison was run between the AQCSS stylesheet and each third-party stylesheet:
- AQCSS: 1,417 rule blocks.
- W3CSS 4.10: 362 rule blocks; 8 rules matched exactly after selector/declaration normalization.
- Normalize.css 8.0.1: 34 rule blocks; 4 rules matched exactly after selector/declaration normalization.

This low exact-match count does **not** prove that only 8/4 rules were derived from those libraries. Rules may have been adapted, renamed, merged, reordered or partially rewritten. The comparison is a first-pass source fingerprint, not a complete provenance attribution.

## Provenance policy

- Treat the upstream AQCSS README/license notices as authoritative evidence that third-party code is included.
- Do not assume generic selectors are AQ-specific or W3CSS-specific without a rule-level match.
- Do not claim every AQCSS class is original to ActiveQuery.
- A complete provenance map requires AST/rule-level comparison and review of the relevant license/notice files.
- Preserve both third-party notices whenever redistribution includes their code.

# Upstream Source Traceability Index

Pinned source: AQCSS SHA `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62`; AQJS SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.

## AQJS source anchors

| Concern | Source lines |
|---|---:|
| Named export and class declaration | 37 |
| Constructor and initialization | 38–55 |
| Static DOM selector | 57–67 |
| Static nested selector | 69–110 |
| Static extension mechanism | 113–181 |
| Instance defer | 107 (method appears before static helpers in source order) |
| Type predicates | 184–259 |
| Static isEmpty | 261–274 |
| Lifecycle event helper | 291–315 |
| Array prototype extensions | 319–426 |
| Element prototype extensions | 428–641; Element `siblings` at 557 |
| NodeList `siblings` implementation | 776–791 |
| Element/Document/Window event helpers | 642–661 |
| NodeList core prototype extensions | 663–815; no-op stubs also at 999, 1037 and 1145 |
| Number prototype trim | 816–869 |
| Object prototype methods | 870–884; no-op stubs also at 1001, 1041 and 1149 |
| String prototype trim | 885–939 |
| Element sancha templating | 940–1005 |
| Element sift filter | 1006–1044 |
| Element watch / MutationObserver fallback | 1045–1152 |

These are navigational line ranges for the pinned revision. Recalculate them when the blob SHA changes.

## AQCSS source anchors

| Concern | Source lines |
|---|---:|
| Root typography/dimension/theme variables | 40–80 |
| Base document reset and semantic element styling | 81–279 |
| Text and typography utilities | 280–337 and 471–503 |
| Border utilities | 338–352 |
| Swatch background/text/border families | 354–388 |
| Background-image helpers | 391–411 |
| Fleek filters, overlay and dropdown | 414–470 |
| Base spacing utilities | 504–579 |
| Facet sizing | 580–709 |
| Base affix positioning | 710–727 |
| Base flexon utilities | 728–812 |
| Tablet `aq-t-` family | 813–1136 |
| Desktop `aq-d-` family | 1137–1460 |
| Large-screen `aq-s-` family | 1461–1784 |
| Pointer/viewport visibility and landscape behavior | 1785–1808 |

## Verified selector examples with exact anchors

- `.aq-text--center`: line 311.
- `.aq-border`: line 338.
- `.aq-swatch--primary`: line 355.
- `.aq-fleek--dropdown-click`: line 439.
- `.aq-facet--third`: line 586; repeated in responsive blocks.
- `.aq-flexon--row-gap-xlarge`: line 810.
- `--aq-paragraph-size` declaration/use: lines 50, 288 and 455.
- Large-screen uppercase `aq-S-text--fs-2/fs-3`: lines 1477–1478.
- Base border token use: lines 338–346; hover alpha fallback: lines 239–240.
- Tablet media query: line 813.
- Desktop media query: line 1137.
- Large-screen media query: line 1461.
- Touch capability query: line 1785.
- Mobile width hide query: line 1786.
- Tablet width hide query: line 1787.
- Short landscape query: line 1788.
- Fine pointer/hover query: line 1805.

## Anchor discipline

This index is a map, not a substitute for reading the complete declaration or method. When citing a specific API or selector in another knowledgebase page, use the smallest accurate line range in the pinned upstream source. If the GitHub UI line anchors are used, link to `#Lx-Ly` on the exact pinned commit, not the moving main branch.

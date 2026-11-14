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
| Element prototype extensions | 428–641 |
| Element/Document/Window event helpers | 642–661 |
| NodeList prototype extensions | 663–870 |
| Number prototype trim | 871–917 |
| Object prototype methods | 919–939 |
| Element sancha templating | 940–1003 |
| Element sift filter | 1004–1044 |
| Element watch / MutationObserver fallback | 1045–1152 |

These are navigational line ranges for the pinned revision. Recalculate them when the blob SHA changes.

## AQCSS source anchors

| Concern | Source lines |
|---|---:|
| Root typography/dimension/theme variables | 37–80 |
| Base document reset and semantic element styling | 81–279 |
| Text and typography utilities | 280–353 |
| Border utilities | 354–366 |
| Swatch background/text/border families | 367 onward (inspect full block) |
| Fleek filters, overlay and dropdown | 400–450 |
| Base spacing and facet sizing | 451–640 |
| Base and responsive flex/position utilities | 641–812 |
| Tablet `aq-t-` family | 813–1136 |
| Desktop `aq-d-` family | 1137–1460 |
| Large-screen `aq-s-` family | 1461–1784 |
| Pointer/viewport visibility and landscape behavior | 1785–1808 |

## Verified selector examples with exact anchors

- `.aq-text--center`: line 311.
- `.aq-border`: line 355.
- `.aq-swatch--primary`: line 367 (verify full exact line when editing this index).
- `.aq-fleek--dropdown-click`: line 439.
- `.aq-facet--third`: line 586; repeated in responsive blocks.
- `.aq-flexon--row-gap-xlarge`: line 809.
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

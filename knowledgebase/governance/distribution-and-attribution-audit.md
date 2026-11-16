# ActiveQuery Licensing, Provenance and Portal Distribution Audit

**Review state: documented, not legally cleared for public framework-asset hosting.** This is an engineering compliance map, not legal advice or a binding interpretation of OSL-3.0.

## Pinned upstream materials examined

The pinned source-fetch script records and verifies these upstream blobs before staging them for browser tests:

| Material | Upstream repository | Pinned file blob |
|---|---|---|
| AQCSS source | ActiveQuery/CSS | `c03546ecd1a41d26cbbfa8f1e31d38731f77cf62` |
| AQCSS minified source | ActiveQuery/CSS | `bdda032d530661c32d9a9351a4ae95219347f081` |
| AQCSS license and notices | ActiveQuery/CSS | `95913ab0528af615935ad360fe4ab42feb09ed3d` |
| AQJS source | ActiveQuery/JS | `b8ec9e5be8668d048eea3385cd9012dfddb69cf0` |
| AQJS minified source | ActiveQuery/JS | `594d778cd5fefe2caa039a7904343e385b77a50c` |
| AQJS license and notices | ActiveQuery/JS | `28eb6b57f17f9af993123b943fa6eae63be43ac2` |

Both upstream project README files identify their software as OSL-3.0. The pinned license files were inspected directly; do not rely only on README badges or repository-level descriptions.

## OSL-3.0 provisions that affect a hosted learning portal

The following is a plain-language issue map. It is not a legal opinion.

1. **Section 5 — External Deployment.** The license defines external deployment broadly to include use, distribution or communication that lets someone other than the licensee use the original or derivative work, including an application intended for use over a network. It says external deployment must be treated as a distribution under section 1(c).
2. **Section 1(c) — Distribution condition.** Copies of the original work or derivative works that are distributed or communicated must be licensed under OSL-3.0. Do not assume that placing a framework script behind a public web page avoids the external-deployment condition.
3. **Section 3 — Source code.** A machine-readable copy of the preferred source form and modification documentation must accompany each distributed copy, or be made conveniently available through a repository while the licensor continues distribution.
4. **Section 6 — Attribution.** Source code of derivative works must retain original copyright, patent and trademark notices, licensing notices and attribution text. A derivative must carry a prominent notice informing recipients that it has been modified.
5. **Section 4 — Marks.** The license does not grant a right to use the licensor's or contributors' names or trademarks to endorse or promote a derived product without prior permission. Descriptive identification and endorsement are not the same thing; keep the portal's independent-project disclaimer and do not imply upstream sponsorship.
6. **Section 9 — Acceptance.** The license requires reasonable efforts to obtain recipients' express assent when distributing copies of the original or derivative work. The appropriate mechanism for a public browser-based learning portal needs legal review.

The exact license text controls. These points identify deployment obligations to resolve; they do not conclude whether every part of the portal is a derivative work or how the license applies to a particular architecture.

## Third-party code and notices

The pinned upstream license files identify these bundled components:

| Upstream project | Component | Notice/license stated by upstream |
|---|---|---|
| AQCSS | w3CSS | MIT |
| AQCSS | Normalize.css (spelled “Normalise CSS” in the notice) | MIT |
| AQJS | Array.sortBy 1.2.2 | MIT |
| AQJS | isJSON 2.0.1 | ISC |

The upstream license files include the corresponding copyright and license text. Preserve those notices whenever the relevant upstream files are redistributed. The ActiveQuery Governance Contribution Policy says dependencies included and distributed with ActiveQuery must be OSL-3.0-compatible and are subject to its compliance review. The public materials examined do not independently establish the outcome of that maintainers' review for each bundled dependency; do not infer approval solely from their presence in the notice file.

## DCO and governance distinction

The ActiveQuery Governance DCO describes a contributor attestation and the Contribution Policy requires a Signed-off-by statement on contributions to ActiveQuery projects. This is an upstream contribution process, not automatically a requirement for every independent commit in this Labs repository. If submitting work to an upstream ActiveQuery repository, follow its current DCO and contribution policy.

The Ethical Source Policy separately expresses an expectation that commercial users who profit from the work support its source/community. Treat that as a stated governance/community expectation, not as a substitute for reading the operative OSL-3.0 text.

## Current repository and deployment facts

- `tools/fetch-pinned-sources.mjs` fetches pinned AQCSS/AQJS files **and their license files**, verifies blob hashes, and stages them in both `vendor/` and `rebuild/vendor/`.
- `.gitignore` excludes both vendor directories. The fetched framework files are generated working assets, not committed repository files.
- The browser-test workflow runs the source-fetch script before tests, so the clean-room playground can load the pinned files in CI.
- The GitHub Pages workflow currently uploads the repository root but does **not** run the source-fetch script. Consequently, the new `rebuild/` playground's local/CI asset staging does not imply those framework files are present on the public Pages artifact. Do not describe the deployed playground as fully functional until this is addressed and validated.
- If a future Pages workflow stages and serves the framework files, that is the point to complete the external-deployment, source-availability, attribution, notice and assent review before publishing.

## Deployment decision checklist

Before publicly enabling framework assets in the portal:

- [ ] Obtain legal review of OSL-3.0 Sections 1(c), 3, 4, 5, 6 and 9 for the exact static-site/browser-playground architecture.
- [ ] Confirm whether serving unmodified upstream files, modified files, or generated examples changes the applicable obligations.
- [ ] Keep AQCSS/AQJS source and minified assets separately identifiable; retain original notices and link the exact pinned source and license files.
- [ ] Provide convenient machine-readable source and modification documentation if required by the final legal interpretation.
- [ ] Preserve third-party MIT/ISC notices for all redistributed bundled code.
- [ ] Keep the site-authored MIT license clearly scoped to original Labs material; do not imply it relicenses upstream or third-party materials.
- [ ] Keep the independent-project/no-endorsement statement and avoid unlicensed use of upstream marks.
- [ ] Determine and implement an appropriate recipient-assent mechanism if required.
- [ ] Recheck upstream license, governance and source revisions before each public framework-asset release.

**Current decision:** continue clean-room portal design, documentation and tests. Keep public framework-asset deployment gated until the checklist has been reviewed and the Pages asset pipeline is deliberately designed.

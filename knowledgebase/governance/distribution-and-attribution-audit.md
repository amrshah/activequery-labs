# ActiveQuery Licensing, Provenance and Portal Distribution Audit

**Review state: engineering compliance requirements mapped; public asset release must satisfy the license conditions below.** OSL-3.0 grants public distribution and external-deployment rights subject to its conditions; this audit does not assume separate permission from upstream maintainers is required. This is an engineering compliance map, not legal advice or a binding interpretation of every portal component.

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
6. **Section 9 — Acceptance.** The license requires reasonable efforts to obtain recipients' express assent when distributing copies of the original or derivative work. Implement a clear, affirmative acceptance step before the playground fetches upstream assets, and link the exact license texts next to the control. This is a reasonable engineering measure for assent; whether a particular mechanism is legally sufficient in every jurisdiction is outside this engineering audit.

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

- `tools/fetch-pinned-sources.mjs` fetches the pinned AQCSS/AQJS source files, minified files and their license/notice files; it verifies the expected Git blob hashes before staging them.
- The generated `vendor/` and `rebuild/vendor/` directories are gitignored. CI generates the assets from the pinned upstream repositories; the upstream files are not edited or committed as Labs-authored code.
- The browser-test workflow fetches the pinned assets before running tests.
- The GitHub Pages workflow now uploads `rebuild/` as the artifact root, runs the pinned-source fetch, and fails validation unless the four framework source/distribution files and both license files exist in `rebuild/vendor/`.
- The clean-room portal links to the exact source and license files and gates browser-side framework asset loading behind an affirmative OSL-3.0 assent action. The iframe remains sandboxed with `allow-scripts` only and does not enable `allow-same-origin`.
- Pages pull-request validation for commit `3121f351a756c71c0203a71512e6ddad44fbdf52` completed successfully in workflow [#533](https://github.com/amrshah/activequery-labs/actions/runs/43845146125): required-file validation, pinned-source hash verification, distributable-file checks, Pages setup and artifact upload all passed. The deploy job was correctly skipped for the pull-request event.
- Browser validation for the same revision completed in workflow [#480](https://github.com/amrshah/activequery-labs/actions/runs/43845146200): 351 passed, 1 documented skip.
- These workflow results prove PR packaging and browser validation. They do not, by themselves, prove that the post-merge Pages deployment completed or that the public site has been independently smoke-tested. Record that separately after checking the deployment environment.

## Deployment implementation checklist

- [x] CI fetches the exact pinned machine-readable AQCSS/AQJS source files and corresponding license/third-party notice files.
- [x] CI verifies pinned blob hashes and fails if distributable source or notice files are missing.
- [x] The Pages artifact root is `rebuild/`, and the Pages workflow uploads the staged source and notice files with the portal.
- [x] The affirmative OSL-3.0 assent control is implemented and browser-tested before framework assets are fetched.
- [x] Original upstream framework files remain separately identifiable and unmodified; any future modification must add a prominent modification notice and publish the corresponding modified source under OSL-3.0.
- [x] The portal links the exact pinned source and license files and retains the independent-project/no-endorsement statement.
- [x] The site-authored MIT notice is scoped to original Labs material and does not purport to relicense upstream or third-party materials.
- [x] Third-party MIT/ISC notices are retained in the corresponding upstream license files.
- [ ] Confirm the post-merge GitHub Pages deployment succeeded and smoke-test the public root and preview asset loading.
- [ ] Recheck upstream license, governance and source revisions before each material public framework-asset release.
- [ ] If the derivative-work boundary or a material change to the distribution model is disputed, consider qualified legal advice; separate counsel approval is not itself a condition stated by OSL-3.0.

**Current implementation direction:** the engineering release path is implemented and its pull-request packaging/browser validation passed. The remaining release verification is to confirm the post-merge Pages deployment and test the actual public site. OSL-3.0 grants distribution and external-deployment rights subject to its conditions; this audit does not treat separate upstream permission or mandatory lawyer signoff as a prerequisite.

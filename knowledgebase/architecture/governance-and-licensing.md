# ActiveQuery Governance and Licensing Notes

Sources rechecked on 2026-11-15 against Governance main commit `ab369232ac801cfbf769d9838c07d4ea8846dfd5`:
- [ActiveQuery/Governance README](https://github.com/ActiveQuery/Governance/blob/main/README.md)
- [Ethical Source Policy](https://github.com/ActiveQuery/Governance/blob/main/ETHICAL_SOURCE_POLICY.md)
- [Code of Conduct Policy](https://github.com/ActiveQuery/Governance/blob/main/CODE_OF_CONDUCT_POLICY.md)
- [Developer Certificate of Origin](https://github.com/ActiveQuery/Governance/blob/main/DCO.md)
- [Governance LICENSE](https://github.com/ActiveQuery/Governance/blob/main/LICENSE)

## Governance documents

The Governance README identifies the ActiveQuery Compliance Framework v21.1 and links:
- LICENSE
- Ethical Source Policy
- Code of Conduct Policy
- Developer Certificate of Origin (DCO)

The Ethical Source Policy describes seven principles: benefit the commons, open development, welcoming/fair governance, accessibility, safety, privacy and support for maintainers/community.

The Code of Conduct defines expected respectful participation, unacceptable conduct, scope and enforcement.

The DCO adapts Developer Certificate of Origin 1.1. The Contribution Policy requires a `Signed-off-by` statement in each commit message; it says the compliance team reviews each contribution and may reject commits without it. The DCO also states that the project and contribution are public and that the contribution record, including personal information submitted with the sign-off, is maintained indefinitely and may be redistributed consistently with the project/license. This is relevant when contributing upstream; the community Labs repository's own contribution process should be kept distinct. The policy also states ActiveQuery uses CalVer `YY.MINOR.MICRO`, so v25.6.0 denotes the 2025 release-year series.

The Ethical Source Policy lists seven principles: benefit the commons, open development, welcoming/fair governance, accessibility, safety, privacy and support for maintainers/community. It says commercial users are expected to contribute back and support the community in tangible ways; treat this as a stated ethical/community expectation, distinct from the legal license grant.

OSL-3.0 section 4 also expressly excludes a license to the Licensor's names and trademarks, and restricts using those names or contributor names to endorse or promote derivative products without prior permission. Software code licensing and brand/trademark permission are separate.

## OSL-3.0 implications

The inspected Governance LICENSE contains the Open Software License 3.0 text. The license includes:
- source-code and derivative-work terms, including a requirement to provide machine-readable source with distributed copies (the licensor may satisfy its own obligation through a reasonably accessible repository);
- an external-deployment definition covering use, distribution or communication where others may use the Original Work or Derivative Works, including applications made available over a network;
- an express condition that any such External Deployment be treated as a distribution under section 1(c);
- attribution rights requiring copyright, patent, trademark, licensing and attribution notices to be retained in derivative source, plus a prominent notice that the Original Work was modified;
- OSL-3.0 licensing requirements for distributed copies of the Original Work or Derivative Works.

This has practical implications when bundling, modifying, redistributing or deploying upstream AQCSS/AQJS as part of a public portal. Do not assume that putting site-authored code under MIT changes the upstream license, or that network use is automatically outside OSL terms.

**This is not a legal opinion.** Before redistributing modified upstream code or structuring a commercial hosted service around it, review the actual license text and obtain qualified legal advice on the intended deployment model.

## Third-party components

The exact W3CSS 4.10 and Normalize.css 8.0.1 sources and MIT licenses have been retrieved and fingerprinted. AQJS also identifies Array.sortBy 1.2.2 (MIT) and is-json 2.0.1 (ISC); the first is clearly adapted in `setSort`, while the second implementation was not located in the inspected primary source. See `aqjs/third-party-provenance.md`. Only a small number of rules matched exactly in an initial lexical comparison; modified/renamed/merged code remains possible, so rule-level provenance is not fully resolved. See `third-party-provenance.md`.

AQCSS README/source identifies W3CSS and Normalize.css. AQJS source identifies Array.sortBy and is-json. Their respective notices and license texts must remain associated with any redistributed bundle. See the upstream license/notice files and verify the exact versions used.

## Naming and repository conventions

The Governance `CONVENTIONS.md` v25.6 defines PascalCase branding and file/folder names, Dromedary/camelCase JavaScript objects, PascalCase JavaScript classes, kebab-case CSS classes/variables, and a BEM-inspired `aq-` namespace with `--` modifiers. It describes an `AQStream` directory split into Quarks (core components) and Lepton (plugins). These are conventions and conceptual repository organization, not proof of a shared executable runtime. See `conventions.md`.

## Portal engineering policy

- Keep site-authored code and upstream code in separate directories and clearly label provenance.
- Preserve full upstream notices whenever upstream assets are copied.
- Do not relabel AQCSS/AQJS source as MIT.
- Do not modify upstream source to suit portal design.
- Prefer linking/loading upstream releases or commit-pinned assets where appropriate, but assess license and deployment obligations for the chosen model.
- Record all third-party dependencies and versions.

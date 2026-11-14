# ActiveQuery Governance and Licensing Notes

Sources inspected on 2026-11-14:
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

The DCO adapts Developer Certificate of Origin 1.1. It requires contributors to certify that they authored the contribution or have the rights to submit it under the indicated license. The policy says ActiveQuery repositories use a DCO process through a contribution policy; inspect each target repository's actual contribution instructions before submitting changes.

## OSL-3.0 implications

The inspected Governance LICENSE contains the Open Software License 3.0 text. The license includes:
- source-code and derivative-work terms;
- an external-deployment definition that treats network availability to others as distribution under section 1(c);
- an obligation to retain attribution/copyright/license notices in derivative source;
- a condition that distributed copies of the original work or derivative works be licensed under OSL-3.0.

This has practical implications when bundling, modifying, redistributing or deploying upstream AQCSS/AQJS as part of a public portal. Do not assume that putting site-authored code under MIT changes the upstream license, or that network use is automatically outside OSL terms.

**This is not a legal opinion.** Before redistributing modified upstream code or structuring a commercial hosted service around it, review the actual license text and obtain qualified legal advice on the intended deployment model.

## Third-party components

AQCSS README/source identifies W3CSS and Normalize.css. AQJS source identifies Array.sortBy and is-json. Their respective notices and license texts must remain associated with any redistributed bundle. See the upstream license/notice files and verify the exact versions used.

## Portal engineering policy

- Keep site-authored code and upstream code in separate directories and clearly label provenance.
- Preserve full upstream notices whenever upstream assets are copied.
- Do not relabel AQCSS/AQJS source as MIT.
- Do not modify upstream source to suit portal design.
- Prefer linking/loading upstream releases or commit-pinned assets where appropriate, but assess license and deployment obligations for the chosen model.
- Record all third-party dependencies and versions.

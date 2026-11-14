# ActiveQuery Naming, Versioning and Repository Conventions

Source: [ActiveQuery/Governance CONVENTIONS.md](https://github.com/ActiveQuery/Governance/blob/main/CONVENTIONS.md), version 25.6.
Related: [Contribution Policy](https://github.com/ActiveQuery/Governance/blob/main/CONTRIBUTION_POLICY.md), [DCO](https://github.com/ActiveQuery/Governance/blob/main/DCO.md).

## Action vocabulary

The conventions define:
- **Effective** — demonstrated merit and preferred.
- **Reflect** — deviation may be reasonable with a good reason; mitigate wider conflicts and remain consistent.
- **Ineffective** — not preferred and generally to be avoided.

This is the governance vocabulary for discussing deviations, not a runtime framework feature.

## Branding and case rules

| Surface | Convention |
|---|---|
| ActiveQuery brand | Pascal Case |
| URLs / filesystem fallback for brand paths | Lisp/kebab case |
| Files and folders | Pascal Case |
| Legal/information document names | SCREAMING_SNAKE_CASE |
| JavaScript objects/functions | Dromedary/camelCase |
| JavaScript classes | PascalCase |
| CSS classes and variables | Lisp/kebab-case |

## AQCSS naming model

The conventions describe AQCSS as BEM-inspired:
- `aq-` prefix for the namespace;
- components/subcomponents joined with hyphens;
- modifiers introduced by double hyphens `--`.

Examples:
- `aq-text--size`
- `aq-swatch-text--canvas`
- `aq-flexon--column-wrap-reverse`

This naming model helps identify intended component families, but the presence of a name in the convention guide does not prove that every example exists or works in the stylesheet. Check the actual selector catalogue and browser behavior.

## CalVer

ActiveQuery specifies `YY.MINOR.MICRO`:
- `YY`: year of release;
- `MINOR`: critical functionality/breaking release sequence, starting at 1;
- `MICRO`: bug-fix/patch sequence.

The published `25.6.0` version therefore identifies the 2025 release-year series. The version number does not itself indicate maintenance recency; see `source-freshness.md`.

## Repository structure

The conventions describe an `AQStream` directory organized into:
- **Quarks** — core components and component groups;
- **Lepton** — core plugins and plugin groups.

A separate marketplace structure contains custom plugins. This is a repository-organization convention and conceptual architecture cue; it is not proof that the AQCSS/AQJS repositories currently implement a shared runtime loader for Quarks and Lepton.

## DCO and contributions

The DCO is adapted from Linux Foundation DCO 1.1. The Contribution Policy requires a `Signed-off-by` statement on each commit message and states that missing sign-off can result in rejection.

The contribution policy also requires license-compatibility checks for included dependencies. Review the actual target repository's contribution instructions before submitting upstream changes.

## Research cautions

- Naming conventions are not API contracts.
- The conceptual AQStream directory structure is not an executable protocol specification.
- CalVer release year is not proof of current maintenance.
- Brand/trademark rules and software copyright license terms are distinct.

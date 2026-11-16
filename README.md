# ActiveQuery Labs

Independent documentation, examples and browser experiments for the ActiveQuery ecosystem.

**Live site:** https://amrshah.github.io/activequery-labs/

> This is an independent community project. It is not the official ActiveQuery website and is not affiliated with or endorsed by the upstream maintainers.

## Purpose

The goal is to make ActiveQuery easier to explore through practical, source-led documentation and reproducible browser examples. Upstream repositories remain authoritative for implementation details, releases and licensing.

## Current sections

- **AQCSS guide** — orientation, source links and a practical evaluation checklist.
- **AQJS guide** — upstream overview and a learning/adoption path.
- **Ecosystem guide** — navigation to upstream governance and terminology.
- **Components** — working AQCSS-composed patterns for actions, cards, tabs, forms, data tables, disclosure, alerts, toast notifications, dialogs and pagination; AQJS powers DOM selection, event binding and mutations in interactive examples.
- **Live playground** — edit HTML, CSS and JavaScript with an isolated side-by-side preview and starter snippets.
- **AI agent skills** — seven reusable source-first skills for framework research, AQCSS, AQJS, responsive design, components, documentation and integration.
- **Source inspection tool** — dependency-free CLI for generating lexical selector and API-candidate inventories from local upstream files.
- **Examples** — standalone full-page demonstrations of AQCSS responsive facets/flexon, spacing, typography and theme utilities, plus AQJS-driven interactions: operations and analytics dashboards, a responsive dashboard experiment, a SaaS landing page and a restaurant ordering PWA-style interface, all demonstrating AQCSS composition and selected AQJS interactions.

## AI agent resources

- [ActiveQuery AI Knowledgebase](knowledgebase/README.md) — canonical framework, AQCSS and AQJS reference, source traceability, known findings and mastery criteria.
- [Mastery gate](knowledgebase/mastery-gate.md) — current status is **NOT PASSED**; the reference and browser validation work are in progress.
- [Browser test plan](knowledgebase/testing/browser-test-plan.md) — pinned-source Playwright coverage; results must be confirmed from CI before being called passed.

## AI agent resources

- [Skills index](skills/README.md)
- [Agent instructions](agent-reference/AGENTS.md)
- [Machine-readable framework index](agent-reference/activequery-index.json)
- [Source research baseline](docs/RESEARCH-BASELINE.md)

## Development

This is a static HTML/CSS/JavaScript site. No build step is required.

Open `index.html` locally or serve the repository root with any static file server. GitHub Actions validates the required files and deploys the root directory to GitHub Pages when changes are pushed to `main`.

## Documentation standards

1. Link to upstream sources for technical claims.
2. Distinguish upstream descriptions from independently tested observations.
3. Do not invent API names, utility classes or compatibility guarantees.
4. Record the source version and test conditions for runnable examples.
5. Preserve all upstream and third-party license/attribution notices when redistributing source assets.

## Upstream

- [ActiveQuery CSS](https://github.com/ActiveQuery/CSS)
- [ActiveQuery JS](https://github.com/ActiveQuery/JS)
- [ActiveQuery Governance](https://github.com/ActiveQuery/Governance)

## License and attribution

The site-authored content and code in this repository are provided under the MIT License unless otherwise stated. This does **not** relicense upstream ActiveQuery code, bundled third-party libraries, names or trademarks. Consult each upstream repository and included license/notice file before copying or redistributing those materials. See [LICENSE-NOTICE.md](LICENSE-NOTICE.md).

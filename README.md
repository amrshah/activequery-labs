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
- **Components** — reusable button, card, tabs, accordion and alert patterns, clearly identified as community-built examples.\n- **Live playground** — edit HTML, CSS and JavaScript with an isolated side-by-side preview and starter snippets.\n- **AI agent skills** — source-first skills for AQCSS, AQJS and component engineering.\n- **Examples** — responsive dashboard experiments and a growing gallery.

## AI agent resources\n\n- [Skills index](skills/README.md)\n- [Agent instructions](agent-reference/AGENTS.md)\n- [Machine-readable framework index](agent-reference/activequery-index.json)\n- [Source research baseline](docs/RESEARCH-BASELINE.md)\n\n## Development

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

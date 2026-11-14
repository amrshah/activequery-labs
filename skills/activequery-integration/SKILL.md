---
name: activequery-integration
description: Use when integrating AQCSS and AQJS into an existing website or application.
---
# ActiveQuery Integration Skill

- Inspect both upstream projects and their current licenses/notices before integrating.
- Pin known releases or immutable commits where possible; avoid relying on moving branches in production.
- Load AQCSS and AQJS independently; use only what the application needs.
- AQJS source inspected by the portal exports a named `ActiveQuery` class. Verify the exact import path and module loading behavior in the target environment.
- Test integration with the existing framework, bundler, CSP, routing and lifecycle.
- Watch for AQJS constructor side effects, especially optional global/prototype extensions.
- Keep custom components isolated and avoid global CSS collisions.
- Document installation, initialization, teardown, browser support and upgrade procedure.

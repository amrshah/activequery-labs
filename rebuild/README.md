# Clean-room ActiveQuery portal

This portal is a separate rebuild exercise authored from the ActiveQuery knowledgebase. The existing portal implementation was not used as a design or code reference.

## Run locally

1. Install the repository's pinned development dependencies with `npm install`.
2. Fetch the exact upstream source revisions into ignored local asset directories:

   ```sh
   npm run sources:fetch
   ```

3. Start the static server:

   ```sh
   node server.mjs
   ```

4. Open `http://127.0.0.1:4173/rebuild/index.html`.

The fetch script verifies Git blob hashes before copying upstream CSS/JS and their license files into `vendor/` and `rebuild/vendor/`. These fetched assets are not committed to this repository.

## Preview isolation

The live example runs in an iframe with `sandbox="allow-scripts"` only. It does not receive `allow-same-origin`, form submission, popup or top-navigation permissions. The parent sends source text and a sample-click command using `postMessage`; it does not read the preview document. The cross-origin boundary is preserved in both Chromium and Firefox.

## Evidence basis

The example uses only documented, source-grounded behavior:

- AQCSS flex display and direction: `knowledgebase/aqcss/flex-cascade-map.md`.
- AQCSS spacing and sizing limitations: `knowledgebase/aqcss/spacing-cascade-map.md`, `knowledgebase/aqcss/sizing-cascade-map.md`.
- AQJS selector, event and class helpers: `knowledgebase/aqjs/api-signature-reference.md`, `knowledgebase/aqjs/api-contract-closure-matrix.md`.
- Known limitations are shown rather than silently normalized.

## Release status and licensing

**Not approved for public deployment yet.** AQCSS and AQJS are OSL-3.0 works. The governance notes explain that external deployment is treated as distribution and may trigger source, license and notice obligations. The page links to upstream projects and explicitly states its independent status, but the final public distribution model still requires the documented licensing review. The Pages deployment workflow must not publish this rebuild until that review is complete.

The clean-room branch is intended for CI validation and technical review. No upstream source files are included in the commit. The portal and four end-to-end checks passed in the latest full suite [#392](https://github.com/amrshah/activequery-labs/actions/runs/43819572529): 257 passing browser cases across 129 authored tests, with one documented Firefox mobile-emulation skip.

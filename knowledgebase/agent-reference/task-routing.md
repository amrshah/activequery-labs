# ActiveQuery Knowledgebase Task Routing

Read `knowledgebase/README.md` first. Then use this routing table to load only the relevant references. Do not reread full upstream files for questions already answered here.

| Task | Read first | Then consult |
|---|---|---|
| Understand the overall framework | `architecture/framework-overview.md` | `architecture/tea-istm-concepts.md`, `architecture/principle-implementation-review.md`, `architecture/conventions.md` |
| Style a component with AQCSS | `aqcss/selector-families.md` | `aqcss/implementation-recipes.md`, `aqcss/cross-family-cascade-audit.md`, `aqcss/base-controls.md`, `aqcss/layout-utilities.md`, `aqcss/theme-effects.md`, class/rule indexes |
| Understand responsive behavior | `aqcss/tokens-and-responsive.md` | `aqcss/layout-utilities.md`, `testing/source-findings.md` |
| Change colors or implement themes | `aqcss/tokens-and-responsive.md` | `aqcss/theme-effects.md`, custom-property index; remember dark mode is not established upstream |
| Use AQJS selectors | `architecture/aqjs-runtime-model.md` | `aqjs/api-inventory.md`, browser tests |
| Use Element/NodeList helpers | `aqjs/api-signature-reference.md` | `aqjs/nodelist-edge-case-audit.md`, `aqjs/behavior-matrix.md`, `aqjs/api-contract-closure-matrix.md` |
| Check AQJS predicate behavior | `aqjs/predicate-truth-table.md` | `aqjs/type-predicates-and-guards.md`, `testing/runtime-validation-matrix.md` |
| Compare AQJS source and minified builds | `aqjs/source-minified-parity-audit.md` | `testing/minified-parity.md`, `aqjs/api-contract-closure-matrix.md` |
| Use type checks / validation | `aqjs/type-predicates-and-guards.md` | `aqjs/api-inventory.md`, browser tests |
| Use templating/filtering/observation | `aqjs/templating-and-observation.md` | `testing/source-findings.md`; prefer native APIs when AQJS behavior is suspect |
| Extend prototypes or register custom elements | `aqjs/extend-and-custom-elements.md` | `architecture/aqjs-runtime-model.md`, governance notes |
| Investigate a bug or surprising behavior | `testing/source-findings.md` | exact source line via `source-traceability/index.md`, then reproduce in browser |
| Validate combined AQCSS utilities | `aqcss/cross-family-cascade-audit.md` | `testing/aqcss-composition-test-plan.md`, `testing/browser-test-plan.md`, relevant family maps |
| Integrate AQCSS and AQJS | `integration/README.md` | relevant domain references and browser tests |
| Check licenses, DCO or brand usage | `architecture/governance-and-licensing.md` | `architecture/conventions.md`, upstream license files |
| Update to a new upstream version | `source-freshness.md` | `source-baseline.md`, regenerate both AST catalogs, compare source/minified builds, update all references |
| Build the new Labs portal | First pass Gate A–D in `mastery-gate.md` | component and integration skills; do not use the existing portal as the design blueprint |

## Evidence discipline

- **Source-confirmed** does not mean runtime-verified.
- **Runtime-verified** requires a retained test and browser/version/viewport details.
- **Derived** claims must show their reasoning.
- **Unverified** claims must not become implementation guarantees.

If a page does not answer the question, inspect only the relevant upstream symbol/rule, add the result to the knowledgebase and update the machine-readable index if needed.

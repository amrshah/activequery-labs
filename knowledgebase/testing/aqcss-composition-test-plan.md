# AQCSS Focused Composition Test Plan

Source: AQCSS v25.6.0, pinned SHA c03546ecd1a41d26cbbfa8f1e31d38731f77cf62.
Status: AQX-001–019 implemented and browser-validated in Chromium and Firefox. Latest full PR-19 suite [#501](https://github.com/amrshah/activequery-labs/actions/runs/43859496522) passed 365 browser cases with one documented skip. Run [#365](https://github.com/amrshah/activequery-labs/actions/runs/43647892108) passed AQX-001–008 and AQX-010–019 in Chromium and Firefox; run [#392](https://github.com/amrshah/activequery-labs/actions/runs/43819572529) adds dedicated CSSOM/computed-style coverage for the base vs responsive flex stretch selectors; runs #394 and #401 verify responsive wrap-reverse spelling and right-bottom importance behavior; run #403 verifies the mobile middle compound selector and responsive aliases. AQX-009 real scroll-container behavior passed in Chromium and Firefox in [run #501](https://github.com/amrshah/activequery-labs/actions/runs/43859496522); the fixture asserts the element remains pinned after scrolling past its natural sticky threshold.

## Existing coverage — avoid blind duplication

The current suite documents tests for base border token and hover relative-color alpha, facet sizing and third-width anomaly, base flex behavior and selected aliases, the escaped base flex stretch selectors versus unescaped responsive selectors, responsive row-wrap-reverse token mismatch, right-bottom vs middle importance cascade, mobile middle alias compound selector, invalid xlarge row gap, spacing aliases, responsive breakpoints and malformed hide helpers, focus outline, disabled descendants, tooltip/dropdown hover behavior, reduced motion and short-landscape CSSOM divergence.

See [browser-test-plan.md](browser-test-plan.md) and [runtime-validation-matrix.md](runtime-validation-matrix.md). Isolated family tests do not prove all cross-family combinations.

## Priority 1 — cross-family assertions

| ID | Fixture/classes | Assertions |
|---|---|---|
| AQX-001 | aq-border + aq-border--no | computed border width/style/color |
| AQX-002 | aq-border + aq-swatch-border--primary | border width/style and computed color |
| AQX-003 | aq-border--no + aq-swatch-border--primary | border remains absent |
| AQX-004 | aq-facet--full + aq-facet--w-auto | width and height separately |
| AQX-005 | aq-facet--full-screen + aq-facet--w-auto | width and height separately |
| AQX-006 | aq--margin-all + aq--margin-left | all four computed margin sides |
| AQX-007 | aq--padding-all + aq--padding-left | all four computed padding sides |
| AQX-008 | aq-affix--fixed + aq-affix--top | position and top |
| AQX-009 | aq-affix--sticky + aq-affix--top | position/top computed cascade plus real scroll-container movement; passed in Chromium and Firefox in run #501 |
| AQX-010 | aq-flexon + aq-flexon--column + aq-flexon--center-top | display, flex-direction, align-items, justify-content |
| AQX-011 | base swatch + hover swatch | background/color before and during hover |
| AQX-012 | grayscale + invert | computed filter string; replacement rather than composition |
| AQX-013 | opacity-max versus hide | opacity/display and layout participation |
| AQX-014 | img + aq-facet--wide-screen | width, max-width and bounding rect |

## Priority 2 — responsive conflicts

| ID | Viewport | Fixture | Assertions |
|---|---:|---|---|
| AQX-015 | 599 / 600 | aq--padding-all-small + aq-t--padding-all | base then tablet value |
| AQX-016 | 992 / 993 | aq-t--margin-all + aq-d--margin-all-large | desktop utility becomes eligible |
| AQX-017 | 1439 / 1440 | tablet, desktop and screen spacing classes | cumulative media eligibility and source-order winner |
| AQX-018 | 992 / 993 | base flex row + desktop flex column | responsive flow overrides base |
| AQX-019 | 1439 / 1440 | typography family tokens | screen family activation and uppercase/lowercase mismatch |

## Test construction requirements

- Isolate the target property and avoid unrelated browser defaults.
- Record computed longhands as well as shorthand properties.
- For dimensions, record computed style and getBoundingClientRect(); percentage width depends on containing block and box sizing.
- For image tests, preserve a known intrinsic ratio and explicitly set fixture container dimensions.
- For sticky tests, create a scroll container with enough content and assert before/after scroll; computed position alone is insufficient.
- Use a real pointer move for hover and a separate keyboard-focus assertion.
- Run Chromium and Firefox; add WebKit only when harness/browser installation supports it.
- Do not change upstream AQCSS or weaken assertions to make tests pass. Record actual behavior.

## Suggested implementation order

1. AQX-001–007: implemented and passed in run #365.
2. AQX-008–010: implemented and passed; AQX-009 real-scroll fixture passed in run #501.
3. AQX-011–014: implemented and passed in run #365.
4. AQX-015–019: implemented and passed in run #365.

Implement as one deliberate test PR/batch when runtime validation is scheduled. Documentation-only updates should continue to use [skip ci].

## Acceptance

A test is accepted only when it asserts actual computed properties/geometry, has a meaningful fixture, records browser/version/viewport, is linked from the runtime validation matrix, and does not conceal upstream defects. AQX-001–019 are now browser-verified in Chromium and Firefox, including real AQX-009 sticky movement in run #501.

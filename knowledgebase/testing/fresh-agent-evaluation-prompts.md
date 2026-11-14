# Fresh-Agent Knowledgebase Evaluation — Candidate Prompt Pack

Status: **prepared; not yet administered**.

## Instructions for the evaluator

1. Start a genuinely fresh agent/session with no prior conversation context about ActiveQuery.
2. Give the candidate only the prompts below and access to the `knowledgebase/` directory. Explicitly prohibit opening upstream source files, generated source catalogs, or the current portal implementation.
3. Require concise answers with knowledgebase file references for every implementation claim.
4. Do not reveal the answer key before the candidate submits all answers.
5. Score each question 0 or 1 using the separate answer key. Record unsupported claims and critical errors.

**Pass threshold:** at least 22/24, with zero critical errors. A high score does not replace the separate implementation exercise.

## Candidate instructions

Answer each question from the knowledgebase alone. Distinguish verified browser behavior from source-derived observations and unresolved hypotheses. If the knowledgebase does not support a claim, say so rather than guessing. Cite the relevant knowledgebase file(s) and section(s).

## AQCSS — 1–14

1. Explain the `aq-t-`, `aq-d-`, and `aq-s-` responsive prefixes, their minimum-width thresholds, and whether the media ranges are cumulative or exclusive.
2. What is the verified behavior of the mobile, tablet, and desktop hide-range helpers in Chromium and Firefox? Explain the source defect responsible.
3. Describe the responsive 1rem directional margin/padding right-helper defect. Which sides receive the value, and what is missing?
4. What is the actual width of `aq-facet--third`? Contrast it with the expected one-third width and identify the consequence.
5. Does `aq-facet--rest` calculate remaining space? State exactly what it does.
6. Which AQCSS flex classes reliably establish `display:flex`, and why is applying only a flex modifier insufficient?
7. Give an example of a base alignment alias that requires a compound selector or a second class. Do not infer that similarly named aliases work independently.
8. Summarize the documented flex grow/stretch and shrink alias defects. Explain why the intended grow utility cannot match.
9. Explain how `aq-affix--fixed` or `aq-affix--sticky` composes with `aq-affix--top`. Which declaration wins for `position`, and what does the top helper contribute?
10. What is wrong with the default paragraph-size token, and what behavior did browser testing observe?
11. Explain the large-screen typography case mismatch. Give examples of class spellings that do and do not match.
12. What accessibility limitations are documented for focus outlines and disabled styling? Distinguish a CSS appearance helper from native disabled semantics.
13. Are tooltip and dropdown helpers keyboard/click accessible by default? Describe the verified hover/focus/click behavior.
14. Does AQCSS provide a reduced-motion override for the input animation? State the tested transition behavior.

## AQJS — 15–24

15. Explain the default secondary border swatch issue. Why can `.aq-border` fail to produce a border until the custom property is supplied in the expected format?
16. When `aq-facet--wide-screen` is applied to an image, what global image constraint can cap its actual rendered width? Distinguish declared width from layout geometry.
17. Describe the polymorphic return behavior of `AQ.DOM(selector)` for zero, one, and multiple matches.
18. How does `AQ.nestedDOM` behave for an Element context with no descendant matches? Contrast that with a NodeList context.
19. Describe `Element.setValue` for truthy and falsy values, including what happens on a generic Element without a native `value` property.
20. Which NodeList content methods are documented no-op stubs? What does `NodeList.on` return for valid, invalid, and empty-collection cases?
21. Explain the `Array.getIndex` `"="` branch and `Array.setSort` strict-module failure. Do not describe either as a safe conventional sorting/search API.
22. Why does `Array.then` make Promise assimilation hazardous? What test limitation is documented?
23. Explain `getPlugin` behavior for string and non-string inputs, rejection propagation, and the security implication of accepting untrusted module specifiers.
24. Identify the documented `isNaS` and `isNaF` predicate defects. Give one false-positive or misleading case for each.

## Submission format

For each numbered item provide:
- Answer (2–5 sentences).
- Knowledgebase evidence (file path and section).
- Confidence: verified / source-derived / unresolved.

Do not browse upstream source or infer unrecorded behavior.

# ActiveQuery Framework — Conceptual Architecture Map

Evidence status: **upstream-positioning summary**, not a verified implementation specification.

Primary public reference: [ActiveQuery Framework overview by Syed Kazmi](https://pk.tskmomentum.com/the-frameworks/activequery-framework-the-software-architecture-of-sovereign-momentum). The page describes ActiveQuery as both an execution philosophy and a set of independent libraries. It emphasizes event-driven, progressive and intelligence-led execution, integration with existing environments, modular adoption, native execution and simplicity.

The Governance README also lists AQCSS, AQJS, AQI, AQPE, AQS, AQKISS and AQOSS as parts of the ActiveQuery ecosystem.

## Conceptual layers described publicly

| Name | Public description | Implementation evidence in this research | Current status |
|---|---|---|---|
| ActiveQuery Framework | Overall philosophy plus independent native libraries | Public framework overview and governance README | Conceptual architecture documented; detailed formal specification pending |
| AQS — ActiveQuery Stream | Described as the core execution current/shared continuity layer | Framework overview names AQDB, AQPHP, AQPY, AQML, AQJS and AQCSS as elements | Architecture narrative only; protocol, contracts and executable integration not yet verified |
| AQI — ActiveQuery Intelligence | Described as behavioural layer; public page references TEA (Transaction > Event > Agent), scope discipline, decision handling and event batching | No AQI source repository or implementation was identified in the inspected AQCSS/AQJS repositories | Unverified implementation; require authoritative technical docs/source |
| AQPE — ActiveQuery Progressive Enhancement | Described as context-first, adaptive and progressive enhancement | AQCSS/AQJS provide concrete browser libraries, but the full AQPE behavior contract is not established | Philosophy documented; implementation contract pending |
| AQKISS | Operational principle for simplicity and native execution; page references ISTM | No concrete standalone library implementation identified in inspected repositories | Principle-level only |
| AQCSS | CSS library, responsive utility system and style layer | Public repository and full main stylesheet inspected | Concrete implementation under deep study |
| AQJS | JavaScript library that augments native browser APIs and DOM | Public repository and full main source inspected | Concrete implementation under deep study |
| AQDB | Described as data-in-motion / hybrid integration | No implementation source inspected | Not verified |
| AQPHP | Described as backend execution layer | No implementation source inspected | Not verified |
| AQPY | Described as decision/workflow engine | No implementation source inspected | Not verified |
| AQML | Described as structured ML execution | No implementation source inspected | Not verified |
| AQOSS / Governance | Open-source/compliance policy family | Governance repository README, policy, DCO and license inspected | Governance source reviewed at a high level |

## Important distinction: philosophy vs executable behavior

The public framework page explicitly says the philosophy can be adopted without using the libraries, and libraries can be used without adopting the full philosophy. This distinction must remain central to the knowledgebase:

- A framework principle is not automatically an AQJS method or AQCSS selector.
- A conceptual architecture element is not evidence of a working protocol, runtime or repository.
- A feature claim such as event batching, local scope or real-time adaptation must be traced to source and tests before it is described as implemented.
- AQCSS and AQJS are independently usable libraries; do not assume they require the full ecosystem.

## AQI claims requiring technical substantiation

The public page describes AQI as a behavioural layer and references:
- TEA sequence: Transaction → Event → Agent;
- local-scope discipline;
- real-time decision handling;
- event batching;
- environment-aligned integration.

These are research leads, not confirmed AQI implementation facts. The AQJS source contains event registration and DOM mutation observation, but that alone does not establish the full AQI model or TEA semantics.

## Research plan for the wider framework

1. Obtain authoritative technical specifications or repositories for AQI, AQS, AQPE and AQKISS.
2. Map protocols, event schemas, execution contracts, state boundaries and trust/security boundaries.
3. Identify which concepts are implemented inside AQJS/AQCSS versus separate systems.
4. Trace every claimed mechanism to executable source.
5. Test interoperability with independently implemented consumers.
6. Keep unsupported architecture claims labelled as conceptual or unverified.

The framework mastery gate must cover both the conceptual architecture and the concrete AQCSS/AQJS implementations. This page does not constitute a mastery declaration.

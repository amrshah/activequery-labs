# TEA and ISTM — Conceptual Framework Notes

Evidence status: **author-published conceptual specification**, not executable AQI/AQS API documentation.

Primary references:
- [TEA Framework](https://pk.tskmomentum.com/the-frameworks/tea-framework-the-architectural-approach-for-systemic-momentum)
- [ActiveQuery Framework overview](https://pk.tskmomentum.com/the-frameworks/activequery-framework-the-software-architecture-of-sovereign-momentum)
- [The Invisible COO / TEA snapshot](https://pk.tskmomentum.com/the-expert-perspective/the-invisible-coo-ai-the-quiet-engine-of-next-gen-ops)

## TEA core

TEA is presented as Transaction → Event → Agent.

The author-published TEA page describes a foundational transaction between exactly two agents and five laws:

1. **Rule of Two** — each transaction involves exactly two agents.
2. **Trigger Principle** — agents do not cause events directly; transactions are the trigger.
3. **Impact Echo** — an event changes the state of both participating agents.
4. **Transactional Clarity** — events should be traceable to their originating transaction.
5. **Reality Anchored** — meaningful system change is grounded in exchange.

This yields a traceability model:

`Agent A + Agent B → Transaction → Event → State change for A and B`

This notation is a conceptual summary, not an upstream API schema or wire protocol.

## TEA rotational lenses

The public TEA page also defines three analytical perspectives:
- **TEA (System Lens):** structure and architecture.
- **ATE (Process Lens):** movement, triggers, motivations and behavioral flow.
- **EAT (Outcome Lens):** consequences and forensic event analysis.

These are described as ways to rotate the same system analysis, not separate software modules.

## TEA chains and collective behavior

A TEA chain is described as a repeated sequence:

`T → E → A → T → E → A → ...`

The public description says the model should scale from a micro-action such as an API call to larger organizational patterns. Collective TEA describes emergent behavior from accumulated transactions and feedback across agents.

## Relationship to ActiveQuery Intelligence (AQI)

The ActiveQuery framework overview positions AQI as the behavioural layer and states that it mirrors TEA logic. This suggests TEA is a conceptual operating model for AQI.

However, the inspected AQJS source does not implement a formal TEA transaction schema, agent registry, event envelope, state-transition protocol or distributed event bus. AQJS event listeners and MutationObserver support are not sufficient evidence of a complete AQI implementation.

## ISTM protocol

The ActiveQuery framework page expands ISTM as:
- **I — Intelligence**
- **S — Systems**
- **T — Transformation**
- **M — Momentum**

The public page describes this as an operational sequence: understand the relevant signals, structure the systems, transform behavior and sustain momentum. The "Invisible COO" article describes similar layers in operational terms.

This is an author-published strategic framework. A machine-readable ISTM process, API, event model or executable runtime was not found in the inspected AQCSS/AQJS sources.

## Questions still open

- What is the canonical data model for an Agent?
- What constitutes a Transaction, and how are the two participating agents identified?
- Is an Event immutable, append-only, versioned or replayable?
- How is event causality represented and validated?
- How are duplicate, delayed, out-of-order and failed events handled?
- What are the trust boundaries and authorization rules?
- Does AQI execute TEA, or is TEA an analytical/design lens?
- How does AQS transport, persist, order and distribute transactions/events?
- How do AQDB, AQPHP, AQPY and AQML participate in the same model?

These are blocking questions for full framework mastery. Do not invent schemas or claim AQI/AQS implementation behavior until authoritative technical specifications or executable source are available.

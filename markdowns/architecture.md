---
title: Architecture
description: This references your existing svg for the stack, and also embeds a new mermaid diagram for “Unified AIEM Architecture” (from the doc). 【259:0†TC_Engine_Website_Rebranding_Copy_r0.docx†L124-L155】【259:1†TC_Engine_Website_Rebranding_Copy_r1.docx†L ￼ ￼deterministic release decision flow.
---

## The Architecture

AIEM is powered by the Export Control Graph Stack™.

```mermaid
flowchart TD

    subgraph Regulatory Layer
        A[ExRegs™] --> B[ExClass™]
    end

    subgraph Enforcement Layer
        B --> C[ExAuth™]
        C --> D[ExRestrict™]
        D --> E[ExPolicy™]
    end

    E --> F[Deterministic Release Decision]
    F --> G[Audit & Governance]
```

Export decisions become computed outcomes, not human interpretation.

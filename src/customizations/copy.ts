export const homeCopy = {
  badge: "Built for teams shipping AI, software, and advanced technology across borders.",
  heroTitle: "AI Export Management Engine",
  heroSubtitle: "From regulation to deterministic enforcement.",
  heroLead:
    "TC Engine transforms export regulations into computable graph systems — each structured, auditable, and enforceable in real operational workflows.",
  ctas: {
    primary: {
      label: "Request technical brief",
      hint: "Send us your email so we can share the technical brief.",
    },
    secondary: {
      label: "Schedule AIEM deep dive",
      hint: "Open a scheduling link (Calendly, etc.).",
    },
  },
  problemShift: {
    title: "The problem shift",
    intro:
      "Export control has moved from shipping hardware to governing models, code, weights, and technical data.",
    bullets: [
      "AI models become export-controlled items.",
      "Model weights are treated as technical data.",
      "Fine-tuning crosses jurisdiction boundaries.",
      "Training data and inference prompts are scrutinized.",
      "Controlled code and ML pipelines must be protected.",
      "Compliance must happen pre-release — not post-audit.",
    ],
  },
  solution: {
    title: "The solution: AIEM",
    body: [
      "AI Export Management (AIEM) is the operational compliance layer that sits between law and engineering workflows.",
      "It enables deterministic classification, auditable reasoning, and automated enforcement before export.",
    ],
  },
  whatWeBuild: {
    title: "What we build",
    cards: [
      {
        title: "ExRegs",
        body:
          "Structured regulations: ITAR/EAR clauses converted into machine-readable graph rules with provenance and versioning.",
      },
      {
        title: "ExClass",
        body:
          "Deterministic classification: convert product + model attributes into export classifications with traceable evidence.",
      },
      {
        title: "ExAuth",
        body:
          "Authorization engine: enforce license decisions and usage constraints in CI/CD, inference gateways, and release workflows.",
      },
      {
        title: "AIEM Graph Stack",
        body:
          "A unified export-control graph linking rules → classification → enforcement → audit artifacts.",
      },
    ],
  },
} as const;

export const productCopy = {
  title: "What our product does",
  intro:
    "TC Engine provides an AI Export Management (AIEM) platform that makes export compliance computable, enforceable, and auditable.",
  sections: [
    {
      title: "ExRegs — structured regulations",
      bullets: [
        "Breaks ITAR/EAR into normalized graph clauses and obligations.",
        "Maintains version control, lineage, and citation to original legal text.",
        "Provides an API for rule retrieval and decision trace generation.",
      ],
    },
    {
      title: "ExClass — deterministic classification",
      bullets: [
        "Accepts attributes about software/AI models, deployment, training data, and end-use.",
        "Returns a classification + the trace of which regulatory nodes triggered.",
        "Produces machine-readable artifacts you can attach to a ticket, build, or shipment.",
      ],
    },
    {
      title: "ExAuth — authorization enforcement",
      bullets: [
        "Evaluates whether an export is allowed (or requires a license), and under what constraints.",
        "Supports policy enforcement hooks across pipelines and gateways.",
        "Outputs enforcement decisions with audit-ready evidence.",
      ],
    },
  ],
  architectureNote:
    "The goal is not a dashboard. It’s an execution layer: rules → decisions → enforcement → audit artifacts.",
} as const;

export const pricingCopy = {
  title: "Consulting pricing",
  intro:
    "Most teams start with a short block to validate classification logic and an enforcement path. If you need deeper design or implementation, use the sprint.",
  plans: [
    {
      id: "TEN_HOURS",
      title: "10-hour block",
      priceLabel: "$2,500",
      subtitle: "Get fast answers and high-leverage guidance.",
      bullets: [
        "Architectural review of your AI export workflow",
        "Export classification strategy and evidence design",
        "Policy enforcement outline for CI/CD, inference, and releases",
        "Audit trace approach: what to log, how to cite, how to store",
      ],
    },
    {
      id: "FORTY_HOURS",
      title: "40-hour consulting sprint",
      priceLabel: "$9,000",
      subtitle: "Deeper design + integration planning (and optional implementation support).",
      bullets: [
        "End-to-end AIEM blueprint tailored to your stack",
        "Module design: ExRegs / ExClass / ExAuth mapping to your needs",
        "Integration plan: repos, services, CI/CD, model gateways",
        "Proof-of-implementation plan with measurable milestones",
      ],
    },
  ],
  howItWorks: {
    title: "How the engagement works",
    bullets: [
      "You’ll receive a short intake form (scope, jurisdictions, product model).",
      "We schedule working sessions and deliver written artifacts.",
      "We can optionally extend into implementation in your environment.",
    ],
  },
  finePrint:
    "These are consulting engagements. If you need formal legal counsel, we can work alongside your trade-compliance or legal team.",
} as const;

export const logsCopy = {
  title: "Daily logs",
  intro:
    "A lightweight feed of our CEO’s LinkedIn posts. Add embed URLs in one place — no UI logic pollution.",
  note:
    "To change what appears here, edit src/customizations/linkedin.ts (or set LINKEDIN_EMBED_URLS).",
} as const;

export const aboutCopy = {
  title: "About",
  intro:
    "TC Engine builds compliance infrastructure for the AI era. We focus on turning export regulations into enforceable engineering systems — not PDFs and checklists.",
  bullets: [
    "We treat export control as a graph system: structured, queryable, and versioned.",
    "We build deterministic decision engines with audit-ready evidence.",
    "We integrate enforcement into real workflows: CI/CD, inference, release, and access controls.",
  ],
  closing:
    "If your compliance process slows down engineering — or puts you at risk — AIEM is the missing execution layer.",
} as const;

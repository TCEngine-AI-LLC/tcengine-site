# AIEM Manifesto

> **AI Export Modernization (AIEM)** transforms export controls into **national military-industrial IP defense infrastructure** for the era of intangible exports: software, technical data, and AI-enabled engineering environments.

---

## The Problem: Built for a Different Era

U.S. export control regimes were designed in the mid-to-late 1970s for a world of physical goods, cage codes, and discrete shipments. Defense Industrial Base (DIB) export control capabilities reflect this legacy, focusing on the human and physical domains (policies, processes, procedures, and training for humans and tangible goods access/transfers).

---

## Risk Shift: From Tangibles to Intangibles

With the proliferation of networked computing, our non-proliferation risks have shifted to **intangibles** — i.e., software and information. The **“Known Unknowns”** are at the heart of the modern ITAR Consent Agreement and are pervasive across the DIB.

![Known Unknowns](/md-images/known-unknowns.png "Known Unknowns")

---

## National Export Controls Assessment

When companies enter an ITAR Consent Agreement (civil penalty), the violations and circumstances surrounding the compliance failures are described in the **Proposed Charging Letter (PCL)**. The PCLs are full of ITAR Export Controlled Information (ECI) identification, location, access, transfer, and retransfer control failures.

As a nation, we lack the intangible export control capabilities required to secure and share our **national military-industrial IP**.

![ECF – National Export Controls Assessment](/md-images/ecf-national-export-controls-assessment.png "ECF – National Export Controls Assessment")

---

## Why Network-Centric Security Doesn’t Work for ITAR

The intangible export control failures are tied to our legacy approach to network-centric security (i.e., NIST SP 800-171r2). When the wrong user makes it into the wrong group or, more likely, the wrong data makes it into the wrong location, the standing permissions/trust becomes a standing violation—especially when access logs are not available to prove who actually accessed the ECI.

![NCS ExCon Failures](/md-images/ncs-excon-failures.png "Network-Centric Security Export Control Failures")

Group and role explosion at scale leads to violation explosion at scale.

![NCS ECI Violations at Scale](/md-images/ncs-eci-violations-at-scale.png "NCS ECI Violations at Scale")

More than a decade later, ITAR ECI on open file shares remains the top data governance risk to the DIB.

![FLIR Consent Agreement PCL](/md-images/flir-consent-agreement-pcl.png "FLIR Consent Agreement PCL")

---

## National Military-Industrial IP Challenges

Regardless of what label you give it—ECI or CUI—the information of concern is our **national military-industrial IP**.

![ECI Definition](/md-images/eci-definition.png "ECI Definition")

The national military-industrial IP challenges we face cannot be addressed through decades-old approaches to export controls and network-centric security. Our big data problems can’t be solved with decades-old tooling and human clicks.

![Mountains of Data](/md-images/mountains-of-data.png "Mountains of Data")

---

## The Solution: AI-Enabled Zero Trust

The first Known Unknown—**data identification**—is also why “data” is the weakest pillar in Zero Trust. If one doesn’t know what the data is, one cannot adequately control the data’s location, access, transfer, or retransfer.

![ZT Capabilities and the Data Pillar](/md-images/zt-capabilities-data-pillar.png "Zero Trust Capabilities and the Data Pillar")

AI addresses this issue. AI was born of big data to process big data. When AI is operationalized for data classification and authorization, the data pillar “goes green,” along with other critical Zero Trust capabilities.

![AI for Zero Trust](/md-images/ai-for-zero-trust.png "AI for Zero Trust")

Operationally, AI—and the classification and authorization information it delivers—drives all data location, access, transfer, and retransfer control capabilities.

![AI ZT Driver](/md-images/ai-zt-driver.png "AI as a Zero Trust Driver")

Data classification has a direct impact on authorization (e.g., ABAC). Authorization can only be as fine-grained as data classification.

- Coarse-grained data classification = coarse-grained security controls  
- Coarse-grained data classification does not enable compliant release under Export Authorization (ExAuth)

![Safeguarding vs. Compliant Release](/md-images/safeguarding-vs-compliant-release.png "Safeguarding vs. Compliant Release")

AI enables Zero Trust for ECI by delivering the fine-grained data classification required for authorization.

---

## The Solution: Zero Trust-Enabled AI

“Data Seek,” or the time users spend looking for data, is a top driver of AI adoption. Multiple studies place the average number of apps an employee must access to perform their daily work at **11–12**, and average employee Data Seek time at **15%**. When applied across thousands of employees, Data Seek cost is considerable—providing a target for ROI and AI budget justification.

When data is ingested into AI, the data becomes globally searchable and chatable. One of the primary business benefits of AI is also an organization’s greatest data governance risk.

![Global Search & Chat Benefits & Risks](/md-images/global-search-chat-benefits-risks.png "Global Search & Chat Benefits & Risks")

To address this risk, classification and authorization must be built into the data-centric architecture—Zero Trust must be enabled in the human-agent-data transactions.

---

## Zero Trust for Export Controlled Information (#zt4eci)

Export regulations (e.g., ITAR and EAR) govern the location, access, transfer, and retransfer of Export Controlled Information (ECI) (i.e., national military-industrial IP).

Nation states, and trans-state actors such as the EU, control proliferation of military and dual-use Hardware, Equipment, Materials, Software, and Information (HEMSI) through Export Regulations (ExRegs), such as the International Traffic in Arms Regulations (ITAR) and Export Administration Regulation (EAR). The regulations define what is controlled, how it is controlled, and under what circumstances exports are authorized.

Export Authorizations (ExAuths) come in a few different forms:

1. **Implicit ExAuths encoded in regulations** (exemptions and exceptions)  
2. **Explicit approvals** (licenses or agreements) when exemptions/exceptions do not apply

![ExAuth Determination Process](/md-images/exauth-determination-process.png "ExAuth Determination Process")

The ExAuth decision process compares transaction attributes to authorization attributes. Historically, a human determines a match.

![ExAuth Matching](/md-images/exauth-matching.png "ExAuth Matching")

If any of the transaction attributes does not match an authorization—or are altogether missing—the transaction must be blocked.

![ExAuth Blocking](/md-images/exauth-blocking.png "ExAuth Blocking")

Inadequate Export Classification (ExClass) is the biggest Zero Trust for ECI blocker. Thus, the focus on what AI can do for Zero Trust (i.e., fine-grained data classification) in the previous section.

![ExClass ZT4ECI Blocker](/md-images/exclass-zt4eci-blocker.png "ExClass ZT4ECI Blocker")

The objective of Zero Trust for ECI is to enable automated, data-level ExAuth (i.e., compliant release).

![ZT4ECI Compliant Release](/md-images/zt4eci-compliant-release.png "ZT4ECI Compliant Release")

This is accomplished by deploying the NIST SP 800-207 principles to ECI. The below manifestation of the architecture reflects a XACML-centric approach, but the same principles translate to OPA/REGO.

![ZT4ECI Example Architecture – XACML Manifestation](/md-images/zt4eci-xacml-architecture.png "ZT4ECI Example Architecture – XACML Manifestation")

This approach addresses the Network-Centric Security failures by replacing trust with authorization.

![The ZT Difference](/md-images/the-zt-difference.png "The ZT Difference")

In the access control context, Zero Trust for ECI manifests as Attribute-Based Access Controls (ABAC), where data classification and user identity attributes must match ExAuth attributes.

![ABAC](/md-images/abac.png "Attribute-Based Access Controls (ABAC)")

---

## From Public Advocacy to Operational Reality

My public comments supporting the American AI Export Program argue for a shift from export restriction to compliant release, especially for trusted allies.

That argument only holds if we can answer a harder question:

**How do we technically enforce export authorizations once AI and data are in motion?**

The answer is not policy alone.

**It is architecture.**

---

## The Core Insight: Export Authorization as Executable Policy

Modern AI systems already rely on:

- Identity-aware access control  
- Attribute-based authorization  
- Continuous telemetry and logging  

Export governance can—and should—operate the same way.

Instead of treating export authorizations as static documents, the AIEM Lab would model them as machine-readable authorization objects that:

- Bind who may access AI assets  
- Constrain what they may do  
- Limit where and how AI may be used  
- Adapt to contextual changes in real time  

This enables both safeguarding and compliant release of export controlled software and information.

---

## Sovereign, Cloud-Agnostic Governance for National Military-Industrial IP

AI export modernization cannot depend on any single cloud provider, platform vendor, or proprietary compliance stack.

If export authorizations become executable policy, then those policies must be:

- Cloud-agnostic  
- Infrastructure-as-Code (IaC) deployable  
- Portable across environments  
- Interoperable across allied national systems  

Otherwise, U.S. export enforcement becomes platform-dependent rather than sovereign.

---

## The Strategic Risk

Today, defense AI development occurs across:

- Commercial hyperscalers  
- GovCloud environments  
- Classified enclaves  
- Contractor-owned platforms  
- Allied sovereign clouds  

Without portability:

- Export enforcement fragments across environments  
- Compliance logic is duplicated and inconsistently implemented  
- Military-industrial IP classification schemas diverge  
- Allies cannot reliably interoperate  

That is not modernization — it is digital balkanization.

---

## The AI Export Modernization (AIEM) Lab

### Mission

To design, prototype, and validate software-defined export control mechanisms for AI, focused on intangible transfers and allied collaboration.

### Scope

The AIEM Lab would focus on:

- AI models and software exports  
- Technical data and training pipelines  
- Cross-border AI collaboration with allies  

---

## Infrastructure-as-Code for Export Governance

The AIEM Lab should prototype export governance controls as:

- Declarative policy artifacts  
- Version-controlled authorization objects  
- Deployable enforcement modules  
- Environment-neutral policy engines  

Export authorizations must be:

- Expressible as structured, machine-readable policy  
- Deployable across AWS, Azure, GCP, on-prem, and sovereign allied clouds  
- Testable in isolated AI testbeds before operational release  

Export governance should be deployed the same way modern infrastructure is deployed — **as code**.

This ensures:

- Repeatability  
- Auditability  
- Traceability  
- Secure rollback  
- Continuous improvement  

---

## Initial Technical Focus Areas

1. **Regulation-to-Code**
   - ITAR  
   - EAR  

2. **Classification**
   - Export Classification of Hardware, Equipment, Materials, Software, and Information (HEMSI) (e.g., eBOM, mBOM, sBOM, Files)  
   - Standard Export Controlled Information (ECI) metadata model (required for interoperability)

3. **Machine-Readable Export Authorizations**
   - Structured representations of licenses, exemptions, and agreements  
   - Compatible with policy engines and enforcement points  

4. **Policy Enforcement at Runtime**
   - Attribute-Based Access Control (ABAC) for AI assets  
   - Continuous authorization rather than one-time approval  

5. **Compliant Release Architecture**
   - Controls embedded at access, execution, and update layers  
   - Enforcement persists beyond initial export  

6. **Auditability and Oversight**
   - Immutable logs of AI access and use  
   - Evidence-based compliance for regulators
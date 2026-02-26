export const intakeFormCopy = {
  requiredNote: "Fields marked with * are required.",
} as const;

export const intakeFormOptions = {
  industry: [
    "Defense Prime",
    "Mid-Tier Defense Manufacturer",
    "Space Systems",
    "Autonomous Systems / AI",
    "Advanced Manufacturing",
    "Dual-Use Technology",
    "Government Organization",
    "Other",
  ],

  employeeCount: ["< 100", "100 – 1,000", "1,000 – 10,000", "10,000+"],

  jurisdictions: ["ITAR", "EAR", "CUI", "FOCI", "Allied Export Regimes", "Unknown / Not Yet Assessed"],

  regulatoryEvents: [
    "ITAR Consent Agreement",
    "Voluntary Self Disclosure",
    "External Audit Findings",
    "Customer Compliance Escalation",
    "None",
  ],

  eciResides: [
    "Network File Shares",
    "SharePoint / M365",
    "PLM / Engineering Systems",
    "Git / Software Repositories",
    "Cloud Object Storage",
    "AI Training Data / Models",
    "Email Systems",
    "Mixed / Unknown",
  ],

  eciIdentification: [
    "Fine-grained classification",
    "Coarse labeling only",
    "No systematic identification",
    "Unknown",
  ],

  accessControlModel: [
    "Role-Based Access Control (RBAC)",
    "Attribute-Based Access Control (ABAC)",
    "Hybrid RBAC/ABAC",
    "Manual Approval Processes",
    "Unknown",
  ],

  yesPartNoUnknown: ["Yes", "Partially", "No", "Unknown"],

  authManagementMethod: [
    "Spreadsheet Tracking",
    "PDF / SharePoint Repository",
    "Enterprise Compliance Tool",
    "Workflow System Integration",
    "Mixed Approach",
    "Unknown",
  ],

  initiatives: [
    "Zero Trust Implementation (NIST SP 800-207)",
    "Enterprise AI Deployment",
    "Internal AI Model Development",
    "Cross-Border Engineering Collaboration",
    "None",
  ],

  exportGovernanceAi: ["Yes", "In Progress", "No", "Not Considered"],

  primaryInfrastructure: [
    "AWS",
    "Azure",
    "GCP",
    "GovCloud",
    "On-Premises",
    "Hybrid Environment",
    "Classified Environment",
  ],

  internationalCollaboration: [
    "Trusted Allied Programs",
    "Multi-Jurisdiction Collaboration",
    "Limited International Collaboration",
    "None",
  ],

  desiredOutcomes: [
    "Reduce Consent Agreement Risk",
    "Enable Compliant Release",
    "Modernize Export Classification",
    "Implement Zero Trust for ECI (#zt4eci)",
    "Enable Secure AI Deployment",
    "Executive Modernization Strategy",
    "Architecture Baseline Assessment",
    "Other",
  ],

  yourRole: [
    "Executive Leadership",
    "General Counsel / Legal",
    "Export Compliance Officer",
    "CISO / Security Leadership",
    "CIO / IT Leadership",
    "Engineering Leadership",
    "Program Management",
    "Other",
  ],

  executiveSponsorship: ["Confirmed", "In Progress", "Not Yet Established", "Unknown"],

  exportControlsView: [
    "Compliance Function",
    "Security Function",
    "Engineering Function",
    "Enterprise Infrastructure Function",
    "Not Defined",
  ],
} as const;
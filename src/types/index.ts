/**
 * AI Revenue Integrity Platform - Comprehensive Canonical Types
 */

export type UserRole =
  | "cdi_specialist"
  | "medical_coder"
  | "coding_auditor"
  | "appeals_specialist"
  | "prior_auth_specialist"
  | "vp_revenue_cycle"
  | "compliance_officer"
  | "system_admin";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  organization: string;
  facility: string;
}

export type OrganizationTier = "Tier 1: Physician Practice" | "Tier 2: Hospital" | "Tier 3: Health System" | "Tier 4: RCM Partner";

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  dob: string;
  gender: "M" | "F" | "Other";
  primaryInsurance: string;
  policyNumber: string;
  groupNumber: string;
  payerType: "Medicare Fee-for-Service" | "Medicare Advantage" | "Commercial" | "Medicaid" | "Managed Care";
  guarantor: string;
}

export interface ClinicalDocument {
  id: string;
  encounterId: string;
  type: "H&P" | "Progress Note" | "Operative Report" | "Discharge Summary" | "Consultation" | "Radiology Report" | "Lab Panel";
  author: string;
  timestamp: string;
  content: string;
  signed: boolean;
}

export interface Diagnosis {
  code: string;
  description: string;
  type: "Principal" | "Secondary" | "Admitting";
  poa: "Y" | "N" | "U" | "W" | "1"; // Present on Admission
  ccMccStatus?: "MCC" | "CC" | "Non-CC";
  hccCategory?: string;
  evidenceSnippets?: string[];
}

export interface Procedure {
  code: string;
  codeType: "CPT" | "ICD-10-PCS" | "HCPCS";
  description: string;
  date: string;
  modifiers?: string[];
  units: number;
  charges: number;
  surgeon: string;
}

export interface Encounter {
  id: string;
  patientId: string;
  facility: string;
  admissionDate: string;
  dischargeDate?: string;
  encounterType: "Inpatient" | "Outpatient" | "Emergency" | "Ambulatory Surgery";
  attendingPhysician: string;
  status: "Active Inpatient" | "Discharged" | "Pre-Bill Review" | "Claim Generated" | "Adjudicated";
  diagnoses: Diagnosis[];
  procedures: Procedure[];
  documents: ClinicalDocument[];
  totalCharges: number;
  expectedReimbursement: number;
  assignedDrg?: {
    code: string;
    description: string;
    weight: number;
    basePayment: number;
  };
  authStatus?: "Required - Pending" | "Approved" | "Action Needed" | "Exempt" | "Denied";
  claimStatus?: "Draft" | "Scrubbed Clean" | "Flagged" | "Submitted (837)" | "Paid (835)" | "Denied (835)";
}

export interface DocumentationFinding {
  id: string;
  encounterId: string;
  patientName: string;
  category: "Acuity & Specificity" | "Clinical Indicators" | "CC/MCC Capture" | "Laterality & Linkage" | "Unresolved Contradiction";
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  description: string;
  evidence: string[];
  suggestedCode?: string;
  confidence: number;
  potentialFinancialImpact: number;
  status: "Open" | "Query Sent" | "Provider Clarified" | "Dismissed" | "Accepted";
  recommendedAction: string;
  riskLevel: string;
  queryDraft?: {
    topic: string;
    statement: string;
    sentDate?: string;
    providerResponse?: string;
  };
}

export interface CodingFinding {
  id: string;
  encounterId: string;
  patientName: string;
  code: string;
  codeType: "CPT" | "ICD-10-CM" | "ICD-10-PCS" | "HCPCS" | "Modifier";
  description: string;
  issueType: "NCCI Edit / Unbundling" | "Lack of Specificity" | "Missing Modifier" | "Unsupported Diagnosis" | "DRG Sequencing" | "Medical Necessity";
  severity: "Critical" | "High" | "Medium" | "Low";
  reason: string;
  evidence: string;
  expectedCode: string;
  financialImpact: number;
  confidence: number;
  status: "Pending Review" | "Accepted" | "Overridden" | "Resolved";
  reviewerAction: string;
}

export interface PriorAuthorizationCase {
  id: string;
  patientId: string;
  patientName: string;
  encounterId: string;
  payer: string;
  procedureCode: string;
  procedureName: string;
  scheduledDate: string;
  status: "Action Required" | "Prerequisites Complete" | "Submitted 278" | "Approved" | "Denied" | "Expiring Soon";
  urgency: "Urgent (24h)" | "Standard Elective (3-5d)";
  payerPolicyName: string;
  readinessScore: number;
  financialExposure: number;
  prerequisites: {
    title: string;
    status: "Met" | "Missing" | "Partial";
    evidence?: string;
    sourceDocument?: string;
  }[];
  authReferenceNumber?: string;
  expirationDate?: string;
}

export interface DenialItem {
  id: string;
  claimId: string;
  encounterId: string;
  patientName: string;
  payer: string;
  serviceDescription: string;
  billedAmount: number;
  deniedAmount: number;
  remittanceDate: string;
  carcCode: string; // Claim Adjustment Reason Code
  carcDescription: string;
  rarcCode: string; // Remittance Advice Remark Code
  rarcDescription: string;
  rootCause: "Medical Necessity" | "Prior Authorization Failure" | "Coding Discrepancy" | "Missing Specificity" | "Timely Filing" | "Coordination of Benefits";
  preventability: "High (Pre-service preventable)" | "Medium" | "Low";
  recoverabilityScore: number; // 0 - 100
  appealStatus: "Pending Analysis" | "Appeal Drafted" | "Appeal Submitted" | "Overturned / Paid" | "Upheld";
  filingDeadline: string;
  appealPackage?: AppealPackage;
}

export interface AppealPackage {
  id: string;
  claimId: string;
  denialId: string;
  patientName: string;
  payer: string;
  billedAmount: number;
  appealLevel: "Level 1 Redetermination" | "Level 2 Reconsideration" | "Level 3 ALJ Hearing";
  createdDate: string;
  submissionDeadline: string;
  legalMedicalArgument: string;
  citedPolicies: string[];
  requiredAttachments: string[];
  status: "Draft" | "Ready for Signature" | "Submitted" | "Favorable Decision";
  signedBy?: string;
}

export interface DischargeSummaryFinding {
  id: string;
  encounterId: string;
  patientName: string;
  dischargeDate: string;
  admissionDiagnosis: string;
  dischargePrincipalDiagnosis: string;
  reconciliationStatus: "Action Required" | "Reconciled" | "Clean";
  discrepancies: {
    category: "Principal Diagnosis Inconsistency" | "Omitted CC/MCC Secondary Diagnosis" | "Incomplete Hospital Course" | "Unresolved Complication";
    issue: string;
    clinicalEvidence: string;
    remediation: string;
    revenueImpact: number;
    confidence: number;
  }[];
  totalRevenueOpportunity: number;
}

export interface ClaimScrubResult {
  claimId: string;
  encounterId: string;
  patientName: string;
  payer: string;
  claimType: "837P Professional" | "837I Institutional";
  totalBilled: number;
  cleanClaimScore: number; // 0 - 100
  passedChecks: number;
  totalChecks: number;
  errors: {
    ruleId: string;
    category: "Eligibility" | "NCCI Edit" | "Prior Auth" | "Medical Necessity" | "Modifier Validation" | "Demographics";
    severity: "Hard Stop (Rejection)" | "Warning (Leakage Risk)" | "Info";
    message: string;
    recommendedFix: string;
  }[];
  status: "Clean - Ready to Transmit" | "Blocked by Hard Stop" | "Under Review";
}

export interface WorkQueueItem {
  id: string;
  priorityScore: number; // 1-100 calculated from impact * urgency * recoverability
  priorityLevel: "Urgent" | "High" | "Medium" | "Low";
  module: "Doc Integrity" | "Coding QA" | "Prior Auth" | "Denials & Appeals" | "Discharge" | "Claim Scrubbing";
  patientName: string;
  encounterId: string;
  payer: string;
  title: string;
  description: string;
  financialImpact: number;
  deadline: string;
  assignedAgent: string;
  confidence: number;
  status: "New" | "In Progress" | "Resolved" | "Escalated";
  assignedUser?: string;
}

export interface FinancialMetrics {
  grossChargesBilled: number;
  netRevenueCollected: number;
  preventedDenialDollars: number;
  recoveredDenialDollars: number;
  identifiedLeakageOpportunity: number;
  cleanClaimRatePercent: number;
  initialDenialRatePercent: number;
  daysInAR: number;
  agedAROver90DaysPercent: number;
  priorAuthFailureRatePercent: number;
  cdiQueryAgreementRatePercent: number;
  roiMultiplier: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  patientId: string;
  encounterId: string;
  module: string;
  details: string;
  aiModel?: string;
  aiConfidence?: number;
  ipAddress: string;
  tamperProofHash: string;
}

export interface MonthlyPerformanceMetric {
  monthKey: string; // e.g. "2026-05", "2026-06", "2026-07", "2026-08"
  monthLabel: string; // e.g. "May 2026", "Jun 2026", "Jul 2026", "Aug 2026 (Current)"
  shortLabel: string; // "May", "Jun", "Jul", "Aug (Curr)"
  isCurrentMonth: boolean;
  grossBilled: number;
  netCollected: number;
  preventedDenials: number;
  recoveredAppeals: number;
  totalProtectedRevenue: number;
  cleanClaimRatePercent: number;
  initialDenialRatePercent: number;
  daysInAR: number;
  agedAROver90DaysPercent: number;
  cdiQueryAgreementRatePercent: number;
  priorAuthReadinessScore: number;
  preBillLeakageIntercepted: number;
}

export interface PayerRulePolicy {
  id: string;
  payerName: string;
  policyNumber: string;
  title: string;
  category: "Coverage Policy (LCD/NCD)" | "Prior Auth Guideline" | "Coding & Modifier Rule" | "Timely Filing Limit";
  effectiveDate: string;
  expirationDate: string;
  applicableCodes: string[];
  summaryCriteria: string[];
  sourceUrl: string;
}

export interface TopPayerPerformance {
  id: string;
  payerName: string;
  shortName: string;
  category: "Government / CMS" | "Commercial" | "Medicare Advantage" | "Managed Medicaid";
  claimVolume: number;
  totalBilledAmount: number;
  totalCollectedAmount: number;
  avgTurnaroundDays: number; // Average Turnaround Time in days
  recoveryRatePercent: number; // Recovery rate percentage (e.g. 96.8%)
  cleanClaimRatePercent: number;
  initialDenialRatePercent: number;
  appealsOverturnRatePercent: number;
  promptPayCompliancePercent: number;
  status: "Optimal" | "Auth Sensitive" | "Med-Nec Watch" | "Active Scrubbing" | "High Friction";
  primaryDenialRootCause: string;
  recommendedAction: string;
}


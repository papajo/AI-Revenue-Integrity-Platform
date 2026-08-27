import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ExecutiveDashboardView } from "./components/views/ExecutiveDashboardView";
import { WorkQueueView } from "./components/views/WorkQueueView";
import { DocumentationIntegrityView } from "./components/views/DocumentationIntegrityView";
import { CodingQAView } from "./components/views/CodingQAView";
import { PriorAuthView } from "./components/views/PriorAuthView";
import { DenialsAppealsView } from "./components/views/DenialsAppealsView";
import { DischargeIntelligenceView } from "./components/views/DischargeIntelligenceView";
import { BillingServiceView } from "./components/views/BillingServiceView";
import { EndToEndDemoView } from "./components/views/EndToEndDemoView";
import { AIIntegrityStudioView } from "./components/views/AIIntegrityStudioView";
import { AuditGovernanceView } from "./components/views/AuditGovernanceView";
import { IntegrationHubView } from "./components/views/IntegrationHubView";

import {
  initialFinancialMetrics,
  mockWorkQueue,
  mockDocumentationFindings,
  mockCodingFindings,
  mockPriorAuthCases,
  mockDenialItems,
  mockDischargeSummaries,
  mockClaimScrubs,
  mockEncounters,
  mockAuditLogs,
} from "./data/mockData";
import {
  UserRole,
  WorkQueueItem,
  DocumentationFinding,
  CodingFinding,
  PriorAuthorizationCase,
  DenialItem,
  DischargeSummaryFinding,
  ClaimScrubResult,
  AuditLogEntry,
} from "./types";

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>("CDI Specialist");
  const [currentOrg, setCurrentOrg] = useState("St. Jude Memorial Health System (Multi-Hospital)");
  const [maskPhi, setMaskPhi] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Application Data States
  const [workQueueItems, setWorkQueueItems] = useState<WorkQueueItem[]>(mockWorkQueue);
  const [docFindings, setDocFindings] = useState<DocumentationFinding[]>(mockDocumentationFindings);
  const [codingFindings, setCodingFindings] = useState<CodingFinding[]>(mockCodingFindings);
  const [priorAuthCases, setPriorAuthCases] = useState<PriorAuthorizationCase[]>(mockPriorAuthCases);
  const [denials, setDenials] = useState<DenialItem[]>(mockDenialItems);
  const [dischargeFindings, setDischargeFindings] = useState<DischargeSummaryFinding[]>(mockDischargeSummaries);
  const [scrubResults, setScrubResults] = useState<ClaimScrubResult[]>(mockClaimScrubs);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditLogs);

  // Quick Action handlers
  const handleResolveWorkQueueItem = (itemId: string) => {
    setWorkQueueItems((prev) => prev.filter((item) => item.id !== itemId));
    addAuditLog(`Resolved Work Queue Item #${itemId}`, "Work Queue", "Human user approved and closed work queue item.");
  };

  const handleSendDocQuery = (findingId: string, queryDraft: any) => {
    setDocFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: "Query Sent" } : f))
    );
    addAuditLog(`Physician CDI Query sent for Finding #${findingId}`, "Documentation Integrity", "AHIMA/ACDIS non-leading clarification query transmitted.");
  };

  const handleAcceptDocFinding = (findingId: string) => {
    setDocFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: "Accepted" } : f))
    );
    addAuditLog(`Accepted CDI Recommendation for Finding #${findingId}`, "Documentation Integrity", "Applied specific diagnosis documentation upgrade.");
  };

  const handleDismissDocFinding = (findingId: string) => {
    setDocFindings((prev) => prev.filter((f) => f.id !== findingId));
    addAuditLog(`Dismissed CDI Recommendation #${findingId}`, "Documentation Integrity", "Physician reviewed clinical notes and confirmed baseline.");
  };

  const handleAcceptCodingFinding = (findingId: string) => {
    setCodingFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: "Accepted" } : f))
    );
    addAuditLog(`Accepted Coding QA Edit #${findingId}`, "Coding QA", "Corrected NCCI edit and unbundling conflict.");
  };

  const handleOverrideCodingFinding = (findingId: string) => {
    setCodingFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: "Overridden" } : f))
    );
    addAuditLog(`Overrode Coding QA Edit #${findingId}`, "Coding QA", "Documented clinical modifier override rationale.");
  };

  const handleUpdatePriorAuthCase = (updatedCase: PriorAuthorizationCase) => {
    setPriorAuthCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
    addAuditLog(`Updated Prior Auth Case #${updatedCase.id}`, "Prior Authorization", `Status updated to ${updatedCase.status}. 278 EDI payload sent.`);
  };

  const handleUpdateDenial = (updatedDenial: DenialItem) => {
    setDenials((prev) =>
      prev.map((d) => (d.id === updatedDenial.id ? updatedDenial : d))
    );
    addAuditLog(`Updated Denial Record #${updatedDenial.id}`, "Denials & Appeals", `Appeal package submitted under status: ${updatedDenial.appealStatus}.`);
  };

  const handleReconcileDischarge = (findingId: string) => {
    setDischargeFindings((prev) =>
      prev.map((df) => (df.id === findingId ? { ...df, reconciliationStatus: "Clean" } : df))
    );
    addAuditLog(`Reconciled Discharge Summary #${findingId}`, "Discharge Intelligence", "Reconciled inpatient hospital course against discharge principal diagnosis.");
  };

  const handleAutoFixClaim = (claimId: string) => {
    setScrubResults((prev) =>
      prev.map((s) =>
        s.claimId === claimId
          ? {
              ...s,
              status: "Clean - Ready to Transmit",
              cleanClaimScore: 100,
              errors: [],
              passedChecks: s.totalChecks,
            }
          : s
      )
    );
    addAuditLog(`Auto-Scrubbed & Fixed Claim #${claimId}`, "Claim Scrubber", "Applied automated NCCI modifier and box 23 prior auth reference fix.");
  };

  const handleSubmitClaim = (claimId: string) => {
    setScrubResults((prev) =>
      prev.map((s) => (s.claimId === claimId ? { ...s, status: "Clean - Ready to Transmit" } : s))
    );
    addAuditLog(`Transmitted 837 Claim #${claimId}`, "Claim Scrubber", "Clean 837 EDI claim dispatched to payer clearinghouse.");
  };

  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: "usr-active-session",
      userName: `${currentRole} (Active Session)`,
      userRole: currentRole,
      action: action,
      patientId: "PT-ACTIVE",
      encounterId: "ENC-ACTIVE",
      module: module,
      details: details,
      ipAddress: "10.142.1.25",
      tamperProofHash: `sha256_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        workQueueCount={workQueueItems.length}
        docGapCount={docFindings.filter((f) => f.status === "Open Action Required").length}
        codingIssueCount={codingFindings.filter((f) => f.status === "Review Pending").length}
        priorAuthGapCount={priorAuthCases.filter((c) => c.status !== "Approved").length}
        denialCount={denials.filter((d) => d.appealStatus !== "Paid/Recovered").length}
        currentRole={currentRole}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main App Layout */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          currentOrg={currentOrg}
          onOrgChange={setCurrentOrg}
          maskPhi={maskPhi}
          onToggleMaskPhi={() => setMaskPhi(!maskPhi)}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onStartDemo={() => setActiveTab("end_to_end_demo")}
        />

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === "dashboard" && (
              <ExecutiveDashboardView
                metrics={initialFinancialMetrics}
                onNavigateToQueue={() => setActiveTab("work_queue")}
                onNavigateToDemo={() => setActiveTab("end_to_end_demo")}
              />
            )}

            {activeTab === "work_queue" && (
              <WorkQueueView
                items={workQueueItems}
                currentRole={currentRole}
                maskPhi={maskPhi}
                onSelectModule={(modKey) => setActiveTab(modKey)}
                onResolveItem={handleResolveWorkQueueItem}
              />
            )}

            {activeTab === "doc_integrity" && (
              <DocumentationIntegrityView
                findings={docFindings}
                encounters={mockEncounters}
                maskPhi={maskPhi}
                onSendQuery={handleSendDocQuery}
                onAcceptFinding={handleAcceptDocFinding}
                onDismissFinding={handleDismissDocFinding}
              />
            )}

            {activeTab === "coding_qa" && (
              <CodingQAView
                findings={codingFindings}
                encounters={mockEncounters}
                maskPhi={maskPhi}
                onAcceptFinding={handleAcceptCodingFinding}
                onOverrideFinding={handleOverrideCodingFinding}
              />
            )}

            {activeTab === "prior_auth" && (
              <PriorAuthView
                cases={priorAuthCases}
                encounters={mockEncounters}
                maskPhi={maskPhi}
                onUpdateCase={handleUpdatePriorAuthCase}
              />
            )}

            {activeTab === "denials_appeals" && (
              <DenialsAppealsView
                denials={denials}
                encounters={mockEncounters}
                maskPhi={maskPhi}
                onUpdateDenial={handleUpdateDenial}
              />
            )}

            {activeTab === "discharge_intel" && (
              <DischargeIntelligenceView
                findings={dischargeFindings}
                encounters={mockEncounters}
                maskPhi={maskPhi}
                onReconcile={handleReconcileDischarge}
              />
            )}

            {activeTab === "billing_service" && (
              <BillingServiceView
                scrubResults={scrubResults}
                encounters={mockEncounters}
                maskPhi={maskPhi}
                onAutoFixClaim={handleAutoFixClaim}
                onSubmitClaim={handleSubmitClaim}
              />
            )}

            {activeTab === "end_to_end_demo" && (
              <EndToEndDemoView
                maskPhi={maskPhi}
                onJumpToModule={(mod) => setActiveTab(mod)}
              />
            )}

            {activeTab === "ai_studio" && <AIIntegrityStudioView />}

            {activeTab === "governance_audit" && (
              <AuditGovernanceView
                logs={auditLogs}
                maskPhi={maskPhi}
                onToggleMaskPhi={() => setMaskPhi(!maskPhi)}
                currentRole={currentRole}
              />
            )}

            {activeTab === "integration_hub" && <IntegrationHubView />}
          </div>
        </main>
      </div>
    </div>
  );
}

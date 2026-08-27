import React, { useState } from "react";
import {
  Workflow,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  FileCheck2,
  FileCode2,
  ShieldAlert,
  BadgeDollarSign,
  Play,
  SkipForward,
  Info,
} from "lucide-react";

interface EndToEndDemoProps {
  maskPhi: boolean;
  onJumpToModule: (module: string) => void;
}

export const EndToEndDemoView: React.FC<EndToEndDemoProps> = ({
  maskPhi,
  onJumpToModule,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoPlaying, setAutoPlaying] = useState(false);

  const steps = [
    {
      step: 1,
      title: "Patient Scheduled for Procedure",
      actor: "EHR Scheduling Interface",
      description: `Patient ${maskPhi ? "Confidential Patient" : "Marcus Brody"} is scheduled for elective L4-L5 Lumbar Spinal Fusion (CPT 22612) at Valley Orthopedic Surgery Center.`,
      module: "prior_auth",
      moduleName: "Prior Auth Module",
      status: "Complete",
      icon: ClockIcon,
      impact: "$42,700 Total Procedure Charges",
      detail: "Order received via FHIR Appointment/ServiceRequest resource from Dr. Sarah Jenkins.",
    },
    {
      step: 2,
      title: "Clinical Intake & Documentation Ingested",
      actor: "Interoperability Ingestion Layer",
      description: "System automatically ingests clinical notes, imaging consults, and payer insurance details (Blue Cross Blue Shield Choice).",
      module: "doc_integrity",
      moduleName: "Doc Integrity",
      status: "Complete",
      icon: FileCheck2,
      impact: "Clinical Baseline Established",
      detail: "Consult note DOC-910 parsed: 6 months back pain, MRI lumbar spine with foraminal stenosis, PT attended for 3 weeks.",
    },
    {
      step: 3,
      title: "Prior Auth Agent Detects Payer Policy Mandate",
      actor: "Prior Authorization Intelligence Agent",
      description: "AI scans BCBS Guideline SURG.00024 and confirms prior authorization is mandatory for CPT 22612.",
      module: "prior_auth",
      moduleName: "Prior Auth Module",
      status: "Complete",
      icon: ShieldAlert,
      impact: "Auth Mandate Confirmed",
      detail: "Payer requires structured failure of 6 weeks physical therapy and imaging within 12 months.",
    },
    {
      step: 4,
      title: "Doc Integrity Agent Identifies Clinical Prerequisite Gap",
      actor: "Documentation Integrity Agent",
      description: "AI flags that only 3 weeks of physical therapy are documented in EHR notes — 3-week conservative therapy gap before surgery.",
      module: "doc_integrity",
      moduleName: "Doc Integrity",
      status: "Complete",
      icon: AlertTriangle,
      impact: "Preventable Denial Risk: $42,700",
      detail: "Without documentation of 6 full weeks of PT or physician exception, immediate CARC 197 prior auth denial will occur.",
    },
    {
      step: 5,
      title: "Automated Work Queue Task Created",
      actor: "Revenue Integrity Orchestrator",
      description: "Task #WQ-101 created with Priority Score 98 (Urgent: surgery scheduled in 24 hours).",
      module: "work_queue",
      moduleName: "Work Queue",
      status: "Complete",
      icon: ListIcon,
      impact: "High Priority Alert Dispatched",
      detail: "Assigned to Prior Auth Coordinator and CDI Lead for provider clarification.",
    },
    {
      step: 6,
      title: "Human Resolves Documentation Issue (Physician Clarification)",
      actor: "Physician & Prior Auth Specialist",
      description: "Dr. Jenkins submits documentation of 4 additional weeks of supervised home PT and severe progressive neurological motor deficit.",
      module: "doc_integrity",
      moduleName: "Doc Integrity",
      status: "Complete",
      icon: CheckCircle2,
      impact: "Clinical Criteria 100% Satisfied",
      detail: "Clinical readiness score upgraded from 65% to 100%.",
    },
    {
      step: 7,
      title: "Electronic 278 Authorization Submitted & Approved",
      actor: "X12 EDI Gateway",
      description: "278 EDI request transmitted to Blue Cross Blue Shield. Instant electronic approval received (Auth #AUTH-BCBS-994102).",
      module: "prior_auth",
      moduleName: "Prior Auth Module",
      status: "Complete",
      icon: ShieldCheck,
      impact: "Pre-Service Authorization Secured",
      detail: "Valid for 90 days. Auth number automatically stamped on patient pre-bill record.",
    },
    {
      step: 8,
      title: "Coding QA Agent Audits Operative Record & NCCI Edits",
      actor: "Coding QA Agent",
      description: "Surgeon performs fusion. Coding QA audits CPT 22612 + 22842 instrumentation for NCCI compliance and modifier accuracy.",
      module: "coding_qa",
      moduleName: "Coding QA",
      status: "Complete",
      icon: FileCode2,
      impact: "Zero Unbundling / Clean Code Set",
      detail: "Verified distinct anatomical segmental instrumentation without illegal unbundling.",
    },
    {
      step: 9,
      title: "Pre-Submission 837 Claim Generated",
      actor: "Claim Generation Engine",
      description: "837P Professional Claim compiled with CPT codes, ICD-10 diagnoses (M54.16), and Box 23 Prior Auth reference.",
      module: "billing_service",
      moduleName: "Claim Scrubber",
      status: "Complete",
      icon: BadgeDollarSign,
      impact: "Total Billed: $68,400",
      detail: "Expected reimbursement: $31,200.",
    },
    {
      step: 10,
      title: "Claim Passes Pre-Submission Revenue Scrubber (100% Score)",
      actor: "BaaS Claim Scrubber",
      description: "Claim passes all 27 automated pre-bill checks (Eligibility, NCCI, POA, Auth ID, Modifiers).",
      module: "billing_service",
      moduleName: "Claim Scrubber",
      status: "Complete",
      icon: CheckCircle2,
      impact: "Clean Claim Score: 100%",
      detail: "Zero hard-stop rejections or leakage warnings.",
    },
    {
      step: 11,
      title: "Clean Claim Transmitted to Payer Clearinghouse",
      actor: "EDI Submitter Gateway",
      description: "837 EDI claim dispatched via Change Healthcare clearinghouse to Blue Cross Blue Shield.",
      module: "billing_service",
      moduleName: "EDI Gateway",
      status: "Complete",
      icon: SendIcon,
      impact: "First-Pass Submission",
      detail: "999 Functional Acknowledgement and 277CA Acceptance received in 4 minutes.",
    },
    {
      step: 12,
      title: "Payer Returns 835 Remittance with Full Contracted Payment",
      actor: "Payer Adjudication Engine",
      description: "Payer adjudicates claim on first pass. 835 Remittance arrives with $31,200 ACH payment deposited.",
      module: "billing_service",
      moduleName: "Payment Posting",
      status: "Complete",
      icon: DollarSignIcon,
      impact: "$31,200 Collected on First Pass",
      detail: "0 days in appeal; 0 denial write-offs; zero staff rework.",
    },
    {
      step: 13,
      title: "System Records Financial Protection & Immutable Audit Log",
      actor: "Revenue Integrity ROI Engine",
      description: "System updates Executive Dashboard: 'Prevented Denial Risk: +$42,700' and writes SHA-256 tamper-proof HIPAA audit entry.",
      module: "governance_audit",
      moduleName: "AI Governance & Audit",
      status: "Complete",
      icon: ShieldCheck,
      impact: "+$42,700 Net Prevented Leakage",
      detail: "End-to-end loop closed: Clinical Reality → Documentation → Coding → Auth → Clean Claim → Full Reimbursement.",
    },
  ];

  function ClockIcon(props: any) {
    return <ClockIconSvg {...props} />;
  }
  function ClockIconSvg(props: any) {
    return <FileCheck2 {...props} />;
  }
  function ListIcon(props: any) {
    return <Workflow {...props} />;
  }
  function SendIcon(props: any) {
    return <CheckCircle2 {...props} />;
  }
  function DollarSignIcon(props: any) {
    return <BadgeDollarSign {...props} />;
  }

  const activeStepData = steps[currentStep - 1];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Section 50 Canonical Healthcare Journey</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              13-Step End-to-End Revenue Integrity Walkthrough
            </h1>
            <p className="text-xs text-slate-300">
              Follow a real clinical procedure from initial scheduling through AI documentation gap detection, prior auth resolution, coding QA, claim scrub, to guaranteed first-pass payment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 disabled:opacity-30 transition-colors"
            >
              ← Previous Step
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(13, currentStep + 1))}
              disabled={currentStep === 13}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-30 transition-colors shadow-2xs"
            >
              Next Step ({currentStep}/13) →
            </button>
          </div>
        </div>
      </div>

      {/* Step Progress Visualizer */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[750px] gap-2">
          {steps.map((s) => {
            const isCurrent = s.step === currentStep;
            const isPast = s.step < currentStep;
            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`flex-1 flex flex-col items-center p-2 rounded-lg text-center transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-emerald-700 text-white shadow-2xs scale-105"
                    : isPast
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200/80"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent
                      ? "bg-white text-emerald-800"
                      : isPast
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {s.step}
                </div>
                <div className="text-[10px] font-semibold truncate w-full mt-1">
                  {s.step === 1 ? "Schedule" : s.step === 4 ? "Gap Found" : s.step === 7 ? "Auth 278" : s.step === 10 ? "Scrub 100%" : s.step === 13 ? "Paid & Logged" : `Step ${s.step}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-700 text-white px-2.5 py-1 text-xs font-black">
                STEP {activeStepData.step} OF 13
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Actor: {activeStepData.actor}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">{activeStepData.title}</h2>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Financial / Operational Value</div>
            <div className="text-lg font-black text-emerald-700">{activeStepData.impact}</div>
          </div>
        </div>

        {/* Description & Technical Mechanism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
            <div className="font-bold text-slate-900 text-sm">What Happens in the Platform:</div>
            <p className="text-slate-700 leading-relaxed">{activeStepData.description}</p>
          </div>

          <div className="rounded-lg bg-emerald-50/60 border border-emerald-200 p-4 space-y-2">
            <div className="font-bold text-emerald-950 text-sm">Data Architecture & Verification:</div>
            <p className="text-emerald-900 leading-relaxed">{activeStepData.detail}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={() => onJumpToModule(activeStepData.module)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            <span>Open in {activeStepData.moduleName}</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 13 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Advance to Step {currentStep + 1}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <span>Full 13-Step Lifecycle Completed Successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

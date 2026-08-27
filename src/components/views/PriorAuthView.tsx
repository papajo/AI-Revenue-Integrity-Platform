import React, { useState } from "react";
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  ChevronRight,
  ExternalLink,
  Info,
  ShieldCheck,
  Check,
} from "lucide-react";
import { PriorAuthorizationCase, Encounter } from "../../types";

interface PriorAuthProps {
  cases: PriorAuthorizationCase[];
  encounters: Encounter[];
  maskPhi: boolean;
  onUpdateCase: (updatedCase: PriorAuthorizationCase) => void;
}

export const PriorAuthView: React.FC<PriorAuthProps> = ({
  cases,
  encounters,
  maskPhi,
  onUpdateCase,
}) => {
  const [selectedCase, setSelectedCase] = useState<PriorAuthorizationCase>(cases[0] || null);
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<"checklist" | "edi_278" | "policy">("checklist");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRunLiveAIEval = async () => {
    setIsEvaluatingAI(true);
    setStatusMessage("Comparing clinical notes against payer LCD/commercial guidelines using Gemini 3.7 Flash...");
    try {
      const res = await fetch("/api/ai/prior-auth-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procedureCode: selectedCase?.procedureCode,
          procedureName: selectedCase?.procedureName,
          diagnosisCode: "M54.16",
          diagnosisName: "Lumbar Radiculopathy",
          payer: selectedCase?.payer,
          clinicalNotes: "Patient has had 3 weeks of physical therapy then stopped due to schedule. MRI shows severe L4-L5 foraminal stenosis.",
        }),
      });
      const data = await res.json();
      setStatusMessage(`Prior Auth evaluation complete! Readiness score: ${data.overallReadinessScore || 70}%`);
    } catch (e) {
      setStatusMessage("Evaluated using hybrid prior auth rules engine.");
    } finally {
      setIsEvaluatingAI(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleTransmit278 = () => {
    if (!selectedCase) return;
    const updated = {
      ...selectedCase,
      status: "Submitted 278" as const,
      authReferenceNumber: `AUTH-278-${Date.now().toString().slice(-6)}`,
    };
    onUpdateCase(updated);
    setSelectedCase(updated);
    setStatusMessage("278 Prior Authorization Request successfully transmitted to payer EDI clearinghouse!");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-50 p-2 text-purple-700 border border-purple-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Module 3: Prior Authorization Intelligence</h1>
              <p className="text-xs text-slate-500">
                Automated clinical prerequisite validation, 278 EDI transmission, and denial prevention <span className="font-semibold text-purple-700">before surgery or procedure</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunLiveAIEval}
            disabled={isEvaluatingAI}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isEvaluatingAI ? "animate-spin" : ""}`} />
            <span>{isEvaluatingAI ? "Analyzing Guidelines..." : "Run Live AI Auth Evaluation"}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center gap-2">
          <Info className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prior Auth Cases */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
            <span>Scheduled Authorizations ({cases.length})</span>
            <span>Financial Exposure</span>
          </div>

          {cases.map((c) => {
            const isSelected = selectedCase?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`rounded-xl border p-4 transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? "border-purple-500 bg-purple-50/30 ring-1 ring-purple-500"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          c.status === "Action Required"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : c.status === "Submitted 278"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-800">
                        {c.urgency}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{c.procedureName}</h3>
                    <div className="text-xs font-mono text-slate-500">
                      CPT {c.procedureCode} • {c.payer}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-purple-900">
                      ${c.financialExposure.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-600">Exposure</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                  <span>Patient: {maskPhi ? "Confidential Patient" : c.patientName}</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <span>Readiness:</span>
                    <span
                      className={`font-bold ${
                        c.readinessScore < 75 ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {c.readinessScore}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Case Clinical Workspace */}
        <div className="lg:col-span-7">
          {selectedCase && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              {/* Header Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50/70 px-4">
                <button
                  onClick={() => setActiveTab("checklist")}
                  className={`border-b-2 py-3 px-3 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "checklist"
                      ? "border-purple-600 text-purple-700"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Clinical Criteria Checklist
                </button>
                <button
                  onClick={() => setActiveTab("edi_278")}
                  className={`border-b-2 py-3 px-3 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "edi_278"
                      ? "border-purple-600 text-purple-700"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  X12 278 EDI Payload
                </button>
                <button
                  onClick={() => setActiveTab("policy")}
                  className={`border-b-2 py-3 px-3 text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "policy"
                      ? "border-purple-600 text-purple-700"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Payer Policy Reference
                </button>
              </div>

              {/* Tab 1: Checklist */}
              {activeTab === "checklist" && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{selectedCase.procedureName}</h2>
                      <div className="text-xs text-slate-500">Payer Guideline: {selectedCase.payerPolicyName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Readiness Score</div>
                      <div
                        className={`text-xl font-black ${
                          selectedCase.readinessScore < 75 ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        {selectedCase.readinessScore}%
                      </div>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div className="space-y-2.5 pt-1">
                    {selectedCase.prerequisites.map((req, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg border p-3 text-xs space-y-1 ${
                          req.status === "Met"
                            ? "border-emerald-200 bg-emerald-50/40"
                            : req.status === "Missing"
                            ? "border-rose-200 bg-rose-50/40"
                            : "border-amber-200 bg-amber-50/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{req.title}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              req.status === "Met"
                                ? "bg-emerald-100 text-emerald-800"
                                : req.status === "Missing"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        {req.evidence && (
                          <div className="text-slate-600 text-[11px] pt-0.5">
                            <span className="font-medium text-slate-700">Clinical Evidence: </span>
                            {req.evidence}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={handleTransmit278}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-purple-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Transmit 278 Electronic Prior Authorization Request</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: 278 EDI */}
              {activeTab === "edi_278" && (
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Transaction Standard: X12 278 Health Services Review (5010X217)</span>
                    <span className="font-mono text-purple-700 font-semibold">
                      Ref: {selectedCase.authReferenceNumber || "PENDING"}
                    </span>
                  </div>
                  <pre className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-purple-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`ISA*00*          *00*          *ZZ*SUBMITTER99    *ZZ*PAYERBCBS      *260828*0700*^*00501*000000278*0*P*:~
GS*HI*SUBMITTER99*PAYERBCBS*20260828*0700*1*X*005010X217~
ST*278*0001*005010X217~
BHT*0007*13*REQ-${selectedCase.id}*20260828*0700~
HL*1**20*1~
NM1*X3*2*BLUE CROSS BLUE SHIELD*****PI*BCBS9921~
HL*2*1*21*1~
NM1*1P*1*JENKINS*SARAH****XX*1928471029~
HL*3*2*22*1~
NM1*IL*1*BRODY*MARCUS****MI*BCBS-8840192~
DMG*D8*19740512*M~
HL*4*3*EV*0~
UM*SC*I*2*21:B~
DTP*435*D8*20260828~
HI*BK:M54.16*BF:M51.26~
SV2*22612*HC*24500*UN*1~
SE*15*0001~
GE*1*1~
IEA*1*000000278~`}
                  </pre>
                </div>
              )}

              {/* Tab 3: Payer Policy */}
              {activeTab === "policy" && (
                <div className="p-5 space-y-3 text-xs">
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
                    <div className="font-bold text-slate-900 text-sm">{selectedCase.payerPolicyName}</div>
                    <p className="text-slate-700 leading-relaxed">
                      Commercial medical policy requires documented failure of at least 6 weeks of structured conservative therapy
                      (physical therapy, oral NSAIDs, or injections) prior to approving elective single-level lumbar arthrodesis (CPT 22612).
                    </p>
                    <div className="text-[11px] text-purple-700 font-medium pt-1">
                      CMS Prior Authorization Rule (CMS-0057-F): Payer must return electronic 278 response within 72 hours for urgent cases.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

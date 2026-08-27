import React, { useState } from "react";
import {
  Sparkles,
  Play,
  FileCheck2,
  FileCode2,
  ShieldAlert,
  RotateCcw,
  FileText,
  Copy,
  Check,
  Zap,
  Info,
} from "lucide-react";

export const AIIntegrityStudioView: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<"cdi" | "coding" | "auth" | "appeal">("cdi");
  const [inputText, setInputText] = useState(
    `PATIENT: 68-year-old female\nHISTORY OF PRESENT ILLNESS:\nPatient admitted through ED with severe shortness of breath, acute onset bilateral lower extremity edema, and orthopnea.\n\nPHYSICAL EXAM & LABS:\nBP: 168/94, HR: 104, SpO2: 86% on room air placed on 4L nasal cannula.\nBNP: 1,840 pg/mL (marked elevation)\nCreatinine: 1.9 mg/dL (baseline 0.8 mg/dL 2 months prior)\nTroponin I: 0.04 ng/mL (negative)\nChest X-ray: Bilateral pulmonary vascular congestion with small pleural effusions.\n\nASSESSMENT & PLAN:\nAcute congestive heart failure. Started on IV Furosemide 40mg BID with strict I&Os.\nRenal function monitored.`
  );
  const [outputResult, setOutputResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleSnippets = {
    cdi: `PATIENT: 68-year-old female\nHISTORY OF PRESENT ILLNESS:\nPatient admitted through ED with severe shortness of breath, acute onset bilateral lower extremity edema, and orthopnea.\n\nPHYSICAL EXAM & LABS:\nBP: 168/94, HR: 104, SpO2: 86% on room air placed on 4L nasal cannula.\nBNP: 1,840 pg/mL (marked elevation)\nCreatinine: 1.9 mg/dL (baseline 0.8 mg/dL 2 months prior)\nTroponin I: 0.04 ng/mL (negative)\nChest X-ray: Bilateral pulmonary vascular congestion with small pleural effusions.\n\nASSESSMENT & PLAN:\nAcute congestive heart failure. Started on IV Furosemide 40mg BID with strict I&Os.\nRenal function monitored.`,
    coding: `PROCEDURE PERFORMED: Diagnostic cardiac catheterization and left heart ventriculography.\nFINDINGS: 90% stenosis in proximal LAD. Drug-eluting stent successfully deployed in LAD.\nCODES ASSIGNED BY BILLING: CPT 93458 (Cath with ventriculography) AND CPT 92928 (Single vessel stent).`,
    auth: `PROCEDURE REQUEST: Single level Lumbar Spinal Fusion (CPT 22612)\nDIAGNOSIS: M54.16 (Lumbar Radiculopathy)\nPAYER: Blue Cross Blue Shield\nCLINICAL SUMMARY: Patient has lower back pain radiating to left leg for 7 months. MRI confirms L4-L5 herniation with nerve root compression. Completed 3 weeks of physical therapy then stopped due to schedule.`,
    appeal: `DENIAL INTAKE:\nClaim #CLM-99214 | Billed: $24,500 | Payer: Aetna Choice\nCARC 50: Non-covered services because this is not deemed a medical necessity by payer.\nSERVICE: Emergency Percutaneous Coronary Intervention with Stent (CPT 92928).\nCLINICAL FACTS: Patient presented with acute crushing chest pain, positive troponin (1.48 ng/mL), ST depressions in V2-V4. Emergency catheterization performed with TIMI-3 flow restored.`,
  };

  const handleSelectEngine = (engine: "cdi" | "coding" | "auth" | "appeal") => {
    setActiveEngine(engine);
    setInputText(sampleSnippets[engine]);
    setOutputResult(null);
  };

  const handleExecuteEngine = async () => {
    setIsLoading(true);
    try {
      if (activeEngine === "cdi") {
        const res = await fetch("/api/ai/analyze-documentation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            encounterId: "TEST-EHR-001",
            patientName: "Synthetic Test Patient",
            noteText: inputText,
            currentDiagnoses: [{ code: "I50.9", description: "Heart failure, unspecified" }],
          }),
        });
        const data = await res.json();
        setOutputResult(data);
      } else if (activeEngine === "coding") {
        const res = await fetch("/api/ai/validate-coding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            encounterId: "TEST-EHR-002",
            assignedCodes: [
              { code: "93458", type: "CPT" },
              { code: "92928", type: "CPT" },
            ],
            clinicalText: inputText,
          }),
        });
        const data = await res.json();
        setOutputResult(data);
      } else if (activeEngine === "auth") {
        const res = await fetch("/api/ai/prior-auth-eval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            procedureCode: "22612",
            procedureName: "Lumbar Arthrodesis",
            diagnosisCode: "M54.16",
            diagnosisName: "Lumbar Radiculopathy",
            payer: "Blue Cross Blue Shield",
            clinicalNotes: inputText,
          }),
        });
        const data = await res.json();
        setOutputResult(data);
      } else {
        const res = await fetch("/api/ai/generate-appeal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            claimId: "CLM-99214",
            patientName: "Synthetic Patient",
            denialCode: "CARC 50",
            denialReason: "Medical necessity denial",
            payer: "Aetna Choice",
            billedAmount: 24500,
            serviceDescription: "Percutaneous Coronary Intervention with Stent (CPT 92928)",
            clinicalNotes: inputText,
          }),
        });
        const data = await res.json();
        setOutputResult(data);
      }
    } catch (e) {
      setOutputResult({ error: "Failed to connect to backend AI agent. Using deterministic engine." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 border border-emerald-200">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Revenue Integrity Laboratory & Sandbox</h1>
              <p className="text-xs text-slate-500">
                Interactive real-time playground for testing Gemini 3.7 Flash clinical & billing intelligence models.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-slate-100 px-3 py-1.5 border border-slate-200 text-xs font-mono text-slate-700">
            Model: gemini-3.7-flash (HIPAA Container Isolated)
          </div>
        </div>
      </div>

      {/* Engine Selection Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => handleSelectEngine("cdi")}
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            activeEngine === "cdi"
              ? "border-rose-500 bg-rose-50/50 text-rose-900 ring-1 ring-rose-500"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <FileCheck2 className="h-4 w-4 text-rose-600" />
          <span>CDI Integrity Agent</span>
        </button>

        <button
          onClick={() => handleSelectEngine("coding")}
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            activeEngine === "coding"
              ? "border-amber-500 bg-amber-50/50 text-amber-900 ring-1 ring-amber-500"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <FileCode2 className="h-4 w-4 text-amber-600" />
          <span>Coding QA & NCCI Engine</span>
        </button>

        <button
          onClick={() => handleSelectEngine("auth")}
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            activeEngine === "auth"
              ? "border-purple-500 bg-purple-50/50 text-purple-900 ring-1 ring-purple-500"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <ShieldAlert className="h-4 w-4 text-purple-600" />
          <span>Prior Auth Readiness</span>
        </button>

        <button
          onClick={() => handleSelectEngine("appeal")}
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            activeEngine === "appeal"
              ? "border-indigo-500 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-500"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <RotateCcw className="h-4 w-4 text-indigo-600" />
          <span>Denials & Appeals Generator</span>
        </button>
      </div>

      {/* Main 2-Column Test Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Clinical & Billing Text */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Clinical Record / Claim Input:</span>
            <button
              onClick={() => setInputText(sampleSnippets[activeEngine])}
              className="text-emerald-700 hover:underline font-semibold text-[11px]"
            >
              Reset to Clinical Benchmark
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={15}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />

          <button
            onClick={handleExecuteEngine}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Running AI Integrity Engine..." : "Execute Real-Time AI Analysis"}</span>
          </button>
        </div>

        {/* Right Column: Structured Output Viewer */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Structured AI Diagnostic Result:</span>
            {outputResult && (
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(outputResult, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy JSON"}</span>
              </button>
            )}
          </div>

          {outputResult ? (
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 shadow-2xs max-h-[420px] overflow-y-auto">
              <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(outputResult, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-400 space-y-2">
              <Sparkles className="mx-auto h-8 w-8 text-slate-300" />
              <div className="font-bold text-slate-700">Awaiting AI Evaluation</div>
              <div className="text-xs max-w-sm mx-auto">
                Click &quot;Execute Real-Time AI Analysis&quot; to invoke the server-side Gemini 3.7 Flash engine and inspect structured findings, evidence extractions, and financial impact.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

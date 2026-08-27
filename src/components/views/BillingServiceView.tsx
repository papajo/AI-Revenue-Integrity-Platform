import React, { useState } from "react";
import {
  BadgeDollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Clock,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Send,
  RefreshCw,
  Info,
  Check,
} from "lucide-react";
import { ClaimScrubResult, Encounter } from "../../types";

interface BillingServiceProps {
  scrubResults: ClaimScrubResult[];
  encounters: Encounter[];
  maskPhi: boolean;
  onAutoFixClaim: (claimId: string) => void;
  onSubmitClaim: (claimId: string) => void;
}

export const BillingServiceView: React.FC<BillingServiceProps> = ({
  scrubResults,
  encounters,
  maskPhi,
  onAutoFixClaim,
  onSubmitClaim,
}) => {
  const [selectedScrub, setSelectedScrub] = useState<ClaimScrubResult>(scrubResults[0] || null);
  const [activeTab, setActiveTab] = useState<"scrubber" | "eligibility" | "ar_aging" | "posting">("scrubber");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFixAndSubmit = () => {
    if (!selectedScrub) return;
    onAutoFixClaim(selectedScrub.claimId);
    setSelectedScrub({
      ...selectedScrub,
      status: "Clean - Ready to Transmit",
      cleanClaimScore: 100,
      errors: [],
      passedChecks: selectedScrub.totalChecks,
    });
    setStatusMessage("Claim scrubbed and auto-corrected! Clean score: 100%. Ready for 837 EDI transmission.");
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleTransmit = () => {
    if (!selectedScrub) return;
    onSubmitClaim(selectedScrub.claimId);
    setStatusMessage(`837 EDI Claim #${selectedScrub.claimId} successfully transmitted to clearinghouse!`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-700 border border-indigo-200">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Module 6: Billing-as-a-Service (BaaS) & Claim Scrubber</h1>
              <p className="text-xs text-slate-500">
                End-to-end managed revenue cycle operations: 270 Eligibility, 837 Claim Scrubbing, 835 Payment Posting, and A/R Management.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>96.4% First-Pass Clean Rate</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center gap-2">
          <Info className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 shadow-2xs">
        <button
          onClick={() => setActiveTab("scrubber")}
          className={`border-b-2 py-3 px-4 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "scrubber"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Pre-Submission Claim Scrubber (837P / 837I)
        </button>
        <button
          onClick={() => setActiveTab("eligibility")}
          className={`border-b-2 py-3 px-4 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "eligibility"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Real-Time Eligibility (270/271)
        </button>
        <button
          onClick={() => setActiveTab("ar_aging")}
          className={`border-b-2 py-3 px-4 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "ar_aging"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          A/R Aging & Forecasting
        </button>
        <button
          onClick={() => setActiveTab("posting")}
          className={`border-b-2 py-3 px-4 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "posting"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          835 Payment Auto-Posting
        </button>
      </div>

      {/* Tab 1: Claim Scrubber */}
      {activeTab === "scrubber" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Claim Scrubber List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
              <span>Claims in Scrubber ({scrubResults.length})</span>
              <span>Billed Amount</span>
            </div>

            {scrubResults.map((scrub) => {
              const isSelected = selectedScrub?.claimId === scrub.claimId;
              return (
                <div
                  key={scrub.claimId}
                  onClick={() => setSelectedScrub(scrub)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${
                            scrub.status.includes("Clean")
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-rose-100 text-rose-800 border-rose-200"
                          }`}
                        >
                          {scrub.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{scrub.claimId}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">
                        {maskPhi ? "Confidential Patient" : scrub.patientName}
                      </h3>
                      <div className="text-xs text-slate-500">
                        {scrub.claimType} • {scrub.payer}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-slate-900">
                        ${scrub.totalBilled.toLocaleString()}
                      </div>
                      <div
                        className={`text-[11px] font-bold ${
                          scrub.cleanClaimScore < 80 ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        {scrub.cleanClaimScore}% Clean Score
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <span>
                      Passed {scrub.passedChecks} of {scrub.totalChecks} Pre-Bill Edits
                    </span>
                    <span className="font-semibold text-rose-600">
                      {scrub.errors.length} Hard Stop / Warning
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Scrub Rules Checker */}
          <div className="lg:col-span-7">
            {selectedScrub && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Claim Scrub Report: {selectedScrub.claimId}
                    </h2>
                    <div className="text-xs text-slate-500">
                      Patient: {maskPhi ? "Confidential Patient" : selectedScrub.patientName} • {selectedScrub.payer}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">Clean Claim Score</div>
                    <div
                      className={`text-xl font-black ${
                        selectedScrub.cleanClaimScore < 80 ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {selectedScrub.cleanClaimScore}%
                    </div>
                  </div>
                </div>

                {/* Errors List */}
                {selectedScrub.errors.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-900">
                      Pre-Submission Blocking Edits ({selectedScrub.errors.length})
                    </div>
                    {selectedScrub.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-rose-200 bg-rose-50/60 p-3.5 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-rose-700" />
                            <span>{err.category}: {err.severity}</span>
                          </span>
                          <span className="font-mono text-[10px] text-rose-700">{err.ruleId}</span>
                        </div>
                        <p className="text-slate-800">{err.message}</p>
                        <div className="rounded bg-white p-2 border border-rose-200/80 text-[11px] text-slate-700">
                          <span className="font-bold text-slate-900">Automated Fix: </span>
                          {err.recommendedFix}
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleFixAndSubmit}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Apply AI Auto-Fix & Re-Scrub to 100%</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Claim Passed All 27 Pre-Bill Validation Rules</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Zero NCCI conflicts, POA confirmed, authorization referenced on Box 23, and eligibility active.
                      </p>
                    </div>

                    <button
                      onClick={handleTransmit}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-800 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Transmit 837 EDI to Clearinghouse</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: 270/271 Real-Time Eligibility */}
      {activeTab === "eligibility" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Real-Time Eligibility Verification (X12 270/271)</h2>
              <p className="text-xs text-slate-500">
                Verifies patient active coverage, copay, coinsurance, and deductible balances before appointment.
              </p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
              Active Coverage Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Primary Payer</div>
              <div className="font-bold text-slate-900 text-sm">Medicare Advantage PPO</div>
              <div className="text-slate-600">Member ID: MA-84920194</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">In-Network Deductible</div>
              <div className="font-bold text-emerald-700 text-sm">$0.00 Remaining</div>
              <div className="text-slate-600">($1,500 met for CY2026)</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Inpatient Co-insurance</div>
              <div className="font-bold text-slate-900 text-sm">10% ($350 Copay Max)</div>
              <div className="text-slate-600">Prior Auth Required for Surgery</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: A/R Aging */}
      {activeTab === "ar_aging" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Accounts Receivable (A/R) Aging Distribution</h2>
            <p className="text-xs text-slate-500">
              Target benchmark &lt;35 days in A/R. Current performance: <span className="font-bold text-emerald-700">32.4 Days</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center">
              <div className="text-xs font-semibold text-emerald-800">0 - 30 Days (Current)</div>
              <div className="text-2xl font-black text-slate-900 mt-1">$8.4M</div>
              <div className="text-[11px] text-emerald-700 font-medium">73.4% of Total A/R</div>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-center">
              <div className="text-xs font-semibold text-blue-800">31 - 60 Days</div>
              <div className="text-2xl font-black text-slate-900 mt-1">$2.1M</div>
              <div className="text-[11px] text-blue-700 font-medium">18.3% of Total A/R</div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center">
              <div className="text-xs font-semibold text-amber-800">61 - 90 Days</div>
              <div className="text-2xl font-black text-slate-900 mt-1">$680K</div>
              <div className="text-[11px] text-amber-700 font-medium">5.9% of Total A/R</div>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-center">
              <div className="text-xs font-semibold text-rose-800">90+ Days (High Risk)</div>
              <div className="text-2xl font-black text-rose-700 mt-1">$270K</div>
              <div className="text-[11px] text-rose-600 font-medium">2.4% (Down from 8.2%)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 835 Payment Posting */}
      {activeTab === "posting" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Automated 835 Payment & Adjustment Posting Engine</h2>
              <p className="text-xs text-slate-500">
                Ingests electronic remittance advice, reconciles EFT deposits, and flags underpayments.
              </p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
              Auto-Posting 99.4% Matched
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs space-y-2">
            <div className="flex justify-between font-medium text-slate-700">
              <span>Electronic Remittance File:</span>
              <span className="font-mono">ERA_20260826_STJUDE_835.DAT</span>
            </div>
            <div className="flex justify-between font-medium text-slate-700">
              <span>Total Payments Posted:</span>
              <span className="font-bold text-emerald-700">$1,420,850.00 (ACH EFT Reconciled)</span>
            </div>
            <div className="flex justify-between font-medium text-slate-700">
              <span>Contractual Adjustments (CO-45):</span>
              <span className="text-slate-900">$380,410.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

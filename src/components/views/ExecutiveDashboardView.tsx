import React from "react";
import {
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Clock,
  AlertTriangle,
  FileCheck2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { FinancialMetrics } from "../../types";

interface ExecutiveDashboardProps {
  metrics: FinancialMetrics;
  onNavigateToQueue: () => void;
  onNavigateToDemo: () => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardProps> = ({
  metrics,
  onNavigateToQueue,
  onNavigateToDemo,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner: Financial ROI Engine */}
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-Time Pre-Bill Revenue Protection Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Executive Financial & Revenue Integrity Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Continuously validating clinical reality, documentation specificity, medical coding, prior authorization,
              and payer rules <span className="font-semibold text-emerald-300">before claim submission</span> to stop preventable leakage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-white/10 backdrop-blur border border-white/15 p-3.5 text-center min-w-[130px]">
              <div className="text-xs text-slate-300 font-medium">ROI Multiplier</div>
              <div className="text-2xl font-black text-emerald-400">{metrics.roiMultiplier}x</div>
              <div className="text-[10px] text-emerald-200/80">Net return on RCM ops</div>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur border border-white/15 p-3.5 text-center min-w-[150px]">
              <div className="text-xs text-slate-300 font-medium">Total Value Protected</div>
              <div className="text-2xl font-black text-white">
                ${((metrics.preventedDenialDollars + metrics.recoveredDenialDollars) / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-slate-300">YTD Revenue Shield</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Prevented Denial Dollars */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prevented Denials</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${(metrics.preventedDenialDollars).toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+$384,100 this quarter (Pre-bill)</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Caught before 837 claim transmission
          </div>
        </div>

        {/* 2. Recovered Denial Dollars */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Appeals Recovered</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${(metrics.recoveredDenialDollars).toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>92.4% AI Appeal Overturn Rate</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Average overturn cycle: 18.2 days
          </div>
        </div>

        {/* 3. Clean Claim Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Clean Claim Rate</span>
            <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.cleanClaimRatePercent}%
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+14.2% vs industry benchmark (82%)</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Pre-submission NCCI & auth scrubber active
          </div>
        </div>

        {/* 4. Days in A/R */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Days in A/R</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {metrics.daysInAR} <span className="text-base font-normal text-slate-500">days</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>-15.6 days acceleration</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Aged &gt;90d A/R reduced to {metrics.agedAROver90DaysPercent}%
          </div>
        </div>
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Denial Categories & Prevention Rate */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Preventable Denial Root Cause Breakdown</h2>
              <p className="text-xs text-slate-500">AI detection and pre-submission interception by category</p>
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              95.9% Intercept Success
            </span>
          </div>

          {/* Custom SVG / Bar Visualization */}
          <div className="space-y-4 pt-2">
            {[
              {
                category: "Prior Authorization Missing / Gaps (CARC 197)",
                amount: "$720,400",
                pct: 88,
                color: "bg-purple-600",
                desc: "Clinical conservative therapy criteria gaps detected pre-service",
              },
              {
                category: "Medical Necessity & Unsupported DX (CARC 50)",
                amount: "$540,200",
                pct: 74,
                color: "bg-blue-600",
                desc: "Biomarker / Troponin / Imaging evidence extracted from clinical notes",
              },
              {
                category: "NCCI Unbundling & Mutually Exclusive (CARC 97)",
                amount: "$384,100",
                pct: 96,
                color: "bg-emerald-600",
                desc: "Column 1/2 CPT overlap & Modifier 25/59 automated verification",
              },
              {
                category: "Clinical Documentation Specificity & CC/MCC Downcoding",
                amount: "$412,800",
                pct: 82,
                color: "bg-amber-600",
                desc: "Acuity, laterality, and nutritional linkage clarified via CDI queries",
              },
            ].map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 font-semibold">{item.category}</span>
                  <span className="text-slate-900 font-bold">{item.amount} protected</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.desc}</span>
                  <span className="font-semibold text-slate-700">{item.pct}% pre-bill interception rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payer Performance Matrix */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">Payer Adjudication Matrix</h2>
              <span className="text-[11px] text-slate-500">Live 835 ERA feeds</span>
            </div>

            <div className="space-y-3 pt-1">
              {[
                {
                  payer: "Medicare Fee-for-Service",
                  cleanRate: "98.8%",
                  avgPayDays: "14.2d",
                  status: "Optimal",
                  statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                },
                {
                  payer: "Blue Cross Blue Shield",
                  cleanRate: "94.2%",
                  avgPayDays: "22.5d",
                  status: "Auth Sensitive",
                  statusColor: "text-purple-700 bg-purple-50 border-purple-200",
                },
                {
                  payer: "Aetna Choice POS",
                  cleanRate: "91.5%",
                  avgPayDays: "26.1d",
                  status: "Med-Nec Watch",
                  statusColor: "text-amber-700 bg-amber-50 border-amber-200",
                },
                {
                  payer: "UnitedHealthcare",
                  cleanRate: "93.1%",
                  avgPayDays: "24.8d",
                  status: "Active Scrubbing",
                  statusColor: "text-blue-700 bg-blue-50 border-blue-200",
                },
              ].map((p) => (
                <div
                  key={p.payer}
                  className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{p.payer}</div>
                    <div className="text-[11px] text-slate-500">
                      Clean: <span className="font-medium text-slate-800">{p.cleanRate}</span> • Turnaround:{" "}
                      <span className="font-medium text-slate-800">{p.avgPayDays}</span>
                    </div>
                  </div>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${p.statusColor}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA to interactive story demo */}
          <div className="mt-4 rounded-lg bg-slate-900 p-3.5 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Full 13-Step Patient Revenue Lifecycle</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300">
              Walk step-by-step through order intake, prior auth gap, CDI query, coding QA, claim scrub, to full payment.
            </p>
            <button
              onClick={onNavigateToDemo}
              className="mt-2.5 w-full rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Launch Interactive Story Walkthrough →
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Revenue Interventions Bar */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-200 p-2 text-amber-900">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                5 High-Priority Tasks Pending Human Review
              </div>
              <div className="text-xs text-amber-800">
                Identified <span className="font-bold">$84,850</span> in immediate pre-bill exposure across Prior Auth, Coding QA, and Inpatient CDI.
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToQueue}
            className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Open Work Queue →
          </button>
        </div>
      </div>
    </div>
  );
};

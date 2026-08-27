import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Clock,
  TrendingUp,
  ShieldCheck,
  Building2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Filter,
  BarChart3,
  ListOrdered,
  FileCheck2,
  Layers,
  Sparkles,
} from "lucide-react";
import { TopPayerPerformance } from "../../types";

interface PayerPerformanceSectionProps {
  payersData: TopPayerPerformance[];
}

export const PayerPerformanceSection: React.FC<PayerPerformanceSectionProps> = ({
  payersData,
}) => {
  const [selectedPayerId, setSelectedPayerId] = useState<string | null>(payersData[0]?.id || "PAYER-01");
  const [sortBy, setSortBy] = useState<"default" | "turnaround" | "recovery" | "volume">("default");
  const [viewMode, setViewMode] = useState<"chart" | "cards" | "table">("chart");

  // Format currency helpers
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${Math.round(val / 1000)}k`;
    return `$${val.toLocaleString()}`;
  };

  // Calculate Network Benchmarks across Top 5
  const totalBilled = payersData.reduce((acc, p) => acc + p.totalBilledAmount, 0);
  const totalCollected = payersData.reduce((acc, p) => acc + p.totalCollectedAmount, 0);
  const weightedAvgTurnaround = (
    payersData.reduce((acc, p) => acc + p.avgTurnaroundDays * p.claimVolume, 0) /
    payersData.reduce((acc, p) => acc + p.claimVolume, 0)
  ).toFixed(1);
  const aggregateRecoveryRate = ((totalCollected / totalBilled) * 100).toFixed(1);

  // Sorted data based on selection
  const sortedPayers = [...payersData].sort((a, b) => {
    if (sortBy === "turnaround") return a.avgTurnaroundDays - b.avgTurnaroundDays; // fastest first
    if (sortBy === "recovery") return b.recoveryRatePercent - a.recoveryRatePercent; // highest yield first
    if (sortBy === "volume") return b.claimVolume - a.claimVolume;
    return 0; // default original ranking
  });

  const activePayer = payersData.find((p) => p.id === selectedPayerId) || payersData[0];

  // Custom Chart Tooltip
  const CustomPayerTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload as TopPayerPerformance;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-4 text-xs text-white shadow-2xl backdrop-blur min-w-[270px] z-50">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-slate-100">{data.payerName}</span>
            </div>
            <span className="rounded bg-slate-800 text-[10px] font-semibold text-slate-300 px-2 py-0.5 border border-slate-700">
              {data.category}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                Recovery / Collection Rate:
              </span>
              <span className="font-bold text-emerald-400 text-sm">{data.recoveryRatePercent}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-indigo-400 inline-block" />
                Avg Turnaround Time:
              </span>
              <span className="font-bold text-indigo-300 text-sm">{data.avgTurnaroundDays} days</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Clean Claim Rate:</span>
              <span className="text-slate-200 font-medium">{data.cleanClaimRatePercent}%</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Claim Volume:</span>
              <span className="text-slate-200 font-medium">{data.claimVolume.toLocaleString()} encounters</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Billed / Collected:</span>
              <span className="text-emerald-300 font-medium">
                {formatCurrency(data.totalCollectedAmount)} / {formatCurrency(data.totalBilledAmount)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              <span className="text-amber-400 font-semibold">Primary Risk: </span>
              {data.primaryDenialRootCause}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status: TopPayerPerformance["status"]) => {
    switch (status) {
      case "Optimal":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Auth Sensitive":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Active Scrubbing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Med-Nec Watch":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "High Friction":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 mb-1">
            <Building2 className="h-3 w-3" />
            <span>Payer Performance & Adjudication Benchmark</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Top 5 Insurance Payers: Turnaround Time vs. Recovery Rate
          </h2>
          <p className="text-xs text-slate-500">
            Tracking electronic 835 remittance turnaround, clean claim pass-through, and net collection yields across core payer contracts.
          </p>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="default">Default Network Rank</option>
              <option value="turnaround">Turnaround (Fastest First)</option>
              <option value="recovery">Recovery Rate (Highest First)</option>
              <option value="volume">Claim Volume</option>
            </select>
          </div>

          {/* View Modes */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setViewMode("chart")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "chart"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Bar Chart</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Payer Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Matrix Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Network Benchmark KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider">
              Network Avg Turnaround
            </span>
            <div className="rounded bg-indigo-100 p-1 text-indigo-700">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{weightedAvgTurnaround}</span>
            <span className="text-xs font-semibold text-slate-600">days</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowDownRight className="h-3 w-3" />-32% vs Ind. Avg
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Industry norm ~32.0d from 837 submission
          </div>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
              Top 5 Net Recovery Rate
            </span>
            <div className="rounded bg-emerald-100 p-1 text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{aggregateRecoveryRate}%</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="h-3 w-3" />+{formatCurrency(totalCollected)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Out of {formatCurrency(totalBilled)} total billed across 13.7k encounters
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider">
              Fastest Payer Remittance
            </span>
            <div className="rounded bg-blue-100 p-1 text-blue-700">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">14.2</span>
            <span className="text-xs font-semibold text-slate-600">days</span>
            <span className="text-xs font-semibold text-blue-800 bg-blue-100/70 px-1.5 py-0.2 rounded">
              Medicare FFS
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Auto-adjudicated with 98.8% clean claim rate
          </div>
        </div>

        <div className="rounded-lg border border-teal-100 bg-teal-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider">
              Top Yield Commercial
            </span>
            <div className="rounded bg-teal-100 p-1 text-teal-700">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">92.4%</span>
            <span className="text-xs font-semibold text-teal-800 bg-teal-100/70 px-1.5 py-0.2 rounded">
              BCBS
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {formatCurrency(payersData[1]?.totalCollectedAmount || 1339800)} collected / 22.5d turnaround
          </div>
        </div>
      </div>

      {/* Main Bar Chart Visualization */}
      {viewMode === "chart" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  Comparative Turnaround (Days) vs. Recovery Rate (%) by Payer
                </h3>
                <p className="text-xs text-slate-500">
                  Left Axis: Recovery Rate (%) • Right Axis: Average Turnaround Time (Days)
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-emerald-500 inline-block" />
                  <span className="text-slate-700 font-medium">Recovery Rate (%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-indigo-500 inline-block" />
                  <span className="text-slate-700 font-medium">Turnaround (Days)</span>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedPayers}
                  margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: "#334155", fontWeight: 600 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  {/* Left Y Axis for Recovery Rate % (0 to 100) */}
                  <YAxis
                    yAxisId="left"
                    domain={[60, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: "#059669" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  {/* Right Y Axis for Turnaround Time in Days (0 to 35) */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 35]}
                    tickFormatter={(v) => `${v}d`}
                    tick={{ fontSize: 11, fill: "#4f46e5" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomPayerTooltip />} />
                  <ReferenceLine
                    yAxisId="left"
                    y={91.3}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{
                      value: "Avg Recovery (91.3%)",
                      fill: "#059669",
                      fontSize: 10,
                      position: "insideTopLeft",
                    }}
                  />
                  <ReferenceLine
                    yAxisId="right"
                    y={21.8}
                    stroke="#6366f1"
                    strokeDasharray="3 3"
                    label={{
                      value: "Avg Turnaround (21.8d)",
                      fill: "#4f46e5",
                      fontSize: 10,
                      position: "insideTopRight",
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="recoveryRatePercent"
                    name="Recovery Rate (%)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                    onClick={(data) => setSelectedPayerId(data.id)}
                    className="cursor-pointer"
                  >
                    {sortedPayers.map((entry) => (
                      <Cell
                        key={`cell-recovery-${entry.id}`}
                        fill={selectedPayerId === entry.id ? "#059669" : "#10b981"}
                        opacity={selectedPayerId && selectedPayerId !== entry.id ? 0.75 : 1}
                      />
                    ))}
                  </Bar>
                  <Bar
                    yAxisId="right"
                    dataKey="avgTurnaroundDays"
                    name="Avg Turnaround (Days)"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                    onClick={(data) => setSelectedPayerId(data.id)}
                    className="cursor-pointer"
                  >
                    {sortedPayers.map((entry) => (
                      <Cell
                        key={`cell-turnaround-${entry.id}`}
                        fill={selectedPayerId === entry.id ? "#4338ca" : "#6366f1"}
                        opacity={selectedPayerId && selectedPayerId !== entry.id ? 0.75 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Click Indicator */}
            <div className="mt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span>Click on any bar above to spotlight detailed contract metrics and denial risk profile below</span>
            </div>
          </div>

          {/* Selected Payer Detail Spotlight Card */}
          {activePayer && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/20 p-4 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-indigo-600 p-2 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{activePayer.payerName}</h4>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadge(activePayer.status)}`}>
                        {activePayer.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {activePayer.category} • {activePayer.claimVolume.toLocaleString()} total encounters submitted
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-normal block">Avg Turnaround</span>
                    <span className="text-sm font-bold text-indigo-700">{activePayer.avgTurnaroundDays} days</span>
                  </div>
                  <div className="text-right border-l border-indigo-100 pl-4">
                    <span className="text-[10px] text-slate-500 font-normal block">Recovery Rate</span>
                    <span className="text-sm font-bold text-emerald-700">{activePayer.recoveryRatePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="rounded-lg bg-white p-2.5 border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-500">Total Billed</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{formatCurrency(activePayer.totalBilledAmount)}</div>
                  <span className="text-[10px] text-slate-400">837 Claim Submissions</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-500">Net Collected</span>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">{formatCurrency(activePayer.totalCollectedAmount)}</div>
                  <span className="text-[10px] text-emerald-600 font-medium">835 Remittance Yield</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-500">Clean Claim Pass</span>
                  <div className="text-sm font-bold text-teal-700 mt-0.5">{activePayer.cleanClaimRatePercent}%</div>
                  <span className="text-[10px] text-slate-400">First-pass clean rate</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-500">Appeals Overturn</span>
                  <div className="text-sm font-bold text-indigo-700 mt-0.5">{activePayer.appealsOverturnRatePercent}%</div>
                  <span className="text-[10px] text-slate-400">Post-bill recovery success</span>
                </div>
              </div>

              {/* Actionable Strategy Guidance */}
              <div className="rounded-lg bg-white p-3 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Primary Denial Root Cause: {activePayer.primaryDenialRootCause}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-5">
                    <span className="font-semibold text-emerald-700">AI Mitigation: </span>
                    {activePayer.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cards View Mode */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPayers.map((payer) => {
            const isSelected = payer.id === selectedPayerId;
            return (
              <div
                key={payer.id}
                onClick={() => setSelectedPayerId(payer.id)}
                className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{payer.payerName}</h4>
                      <span className="text-[11px] text-slate-500">{payer.category}</span>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadge(payer.status)}`}>
                      {payer.status}
                    </span>
                  </div>

                  {/* Dual Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="rounded-md bg-slate-50 p-2 border border-slate-100">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-indigo-600" />
                        Avg Turnaround
                      </span>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">{payer.avgTurnaroundDays} days</div>
                      <span className="text-[10px] text-slate-400">{payer.promptPayCompliancePercent}% prompt pay</span>
                    </div>

                    <div className="rounded-md bg-emerald-50/60 p-2 border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        Recovery Yield
                      </span>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">{payer.recoveryRatePercent}%</div>
                      <span className="text-[10px] text-emerald-600 font-medium">{formatCurrency(payer.totalCollectedAmount)}</span>
                    </div>
                  </div>

                  {/* Clean Claim & Denial Stats */}
                  <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Clean Claim Pass:</span>
                      <span className="font-semibold text-slate-800">{payer.cleanClaimRatePercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Initial Denial Rate:</span>
                      <span className="font-semibold text-slate-800">{payer.initialDenialRatePercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Claim Encounters:</span>
                      <span className="font-semibold text-slate-800">{payer.claimVolume.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
                  <span className="font-semibold text-amber-700">Root Cause: </span>
                  {payer.primaryDenialRootCause}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Matrix Table View Mode */}
      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Payer & Network Type</th>
                <th className="px-3 py-3 text-right">Encounters</th>
                <th className="px-3 py-3 text-right">Avg Turnaround</th>
                <th className="px-3 py-3 text-right">Recovery Rate</th>
                <th className="px-3 py-3 text-right">Clean Claim %</th>
                <th className="px-3 py-3 text-right">Initial Denial %</th>
                <th className="px-3 py-3 text-right">Total Collected</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {sortedPayers.map((payer) => (
                <tr
                  key={payer.id}
                  onClick={() => setSelectedPayerId(payer.id)}
                  className={`hover:bg-slate-50/70 cursor-pointer ${
                    payer.id === selectedPayerId ? "bg-indigo-50/30 font-medium" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{payer.payerName}</div>
                    <div className="text-[10px] text-slate-500">{payer.category}</div>
                  </td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono">
                    {payer.claimVolume.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-bold text-indigo-700 font-mono">{payer.avgTurnaroundDays}d</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-bold text-emerald-700 font-mono">{payer.recoveryRatePercent}%</span>
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700 font-mono">
                    {payer.cleanClaimRatePercent}%
                  </td>
                  <td className="px-3 py-3 text-right text-rose-700 font-mono">
                    {payer.initialDenialRatePercent}%
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(payer.totalCollectedAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadge(payer.status)}`}>
                      {payer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

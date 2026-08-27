import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Clock,
  FileCheck2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  BarChart3,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { MonthlyPerformanceMetric } from "../../types";

interface ExecutiveTrendAnalyticsProps {
  monthlyData: MonthlyPerformanceMetric[];
}

export const ExecutiveTrendAnalytics: React.FC<ExecutiveTrendAnalyticsProps> = ({
  monthlyData,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "financial" | "velocity" | "table">("overview");
  const [selectedMonth, setSelectedMonth] = useState<string>(monthlyData[monthlyData.length - 1]?.monthKey || "2026-08");

  // Format currency helpers
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${Math.round(val / 1000)}k`;
    return `$${val.toLocaleString()}`;
  };

  const formatShortCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${Math.round(val / 1000)}k`;
    return `$${val}`;
  };

  // Baseline vs Current Calculations (May 2026 vs Aug 2026)
  const baseline = monthlyData[0] || {} as MonthlyPerformanceMetric;
  const current = monthlyData[monthlyData.length - 1] || {} as MonthlyPerformanceMetric;

  const revenueProtectedGrowth = baseline.totalProtectedRevenue
    ? (((current.totalProtectedRevenue - baseline.totalProtectedRevenue) / baseline.totalProtectedRevenue) * 100).toFixed(1)
    : "0";

  const cleanClaimImprovement = (current.cleanClaimRatePercent - baseline.cleanClaimRatePercent).toFixed(1);
  const daysInARReduction = (baseline.daysInAR - current.daysInAR).toFixed(1);
  const initialDenialDrop = (baseline.initialDenialRatePercent - current.initialDenialRatePercent).toFixed(1);

  // Custom Recharts Tooltip for Financial Recovery
  const CustomFinancialTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as MonthlyPerformanceMetric;
      return (
        <div className="rounded-lg border border-slate-200 bg-slate-900/95 p-3.5 text-xs text-white shadow-xl backdrop-blur min-w-[220px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              {dataPoint.monthLabel}
            </span>
            {dataPoint.isCurrentMonth && (
              <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                Active Month
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                Pre-Bill Prevented:
              </span>
              <span className="font-semibold text-emerald-300">
                {formatCurrency(dataPoint.preventedDenials)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400 inline-block" />
                Appeals Recovered:
              </span>
              <span className="font-semibold text-indigo-300">
                {formatCurrency(dataPoint.recoveredAppeals)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-700/80 pt-1.5 font-bold text-white">
              <span className="text-teal-300">Total Shielded:</span>
              <span className="text-emerald-400">{formatCurrency(dataPoint.totalProtectedRevenue)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Gross Billed:</span>
              <span>{formatCurrency(dataPoint.grossBilled)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Velocity & Quality
  const CustomVelocityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as MonthlyPerformanceMetric;
      return (
        <div className="rounded-lg border border-slate-200 bg-slate-900/95 p-3.5 text-xs text-white shadow-xl backdrop-blur min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              {dataPoint.monthLabel}
            </span>
            {dataPoint.isCurrentMonth && (
              <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                Current
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                Clean Claim Rate:
              </span>
              <span className="font-semibold text-emerald-300">{dataPoint.cleanClaimRatePercent}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />
                Days in A/R:
              </span>
              <span className="font-semibold text-blue-300">{dataPoint.daysInAR} days</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" />
                Initial Denial Rate:
              </span>
              <span className="font-semibold text-rose-300">{dataPoint.initialDenialRatePercent}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                CDI Clarification Agreement:
              </span>
              <span className="font-semibold text-amber-300">{dataPoint.cdiQueryAgreementRatePercent}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const selectedMonthData = monthlyData.find((m) => m.monthKey === selectedMonth) || current;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>4-Month Trend Analysis & AI Recovery Impact</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Revenue Cycle Performance: Current Month vs. Prior 3 Months
          </h2>
          <p className="text-xs text-slate-500">
            Tracking pre-bill denial interception, clean claim elevation, and A/R turnaround across May, June, July, and August 2026.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("financial")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "financial"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Financial Recovery ($)
          </button>
          <button
            onClick={() => setActiveTab("velocity")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "velocity"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quality & Velocity (%)
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "table"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Scorecard Table
          </button>
        </div>
      </div>

      {/* 4-Month Trajectory Quick Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
              Monthly Value Protected
            </span>
            <div className="rounded bg-emerald-100 p-1 text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(current.totalProtectedRevenue)}
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="h-3 w-3" />+{revenueProtectedGrowth}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            vs. {formatCurrency(baseline.totalProtectedRevenue)} in May 2026
          </div>
        </div>

        <div className="rounded-lg border border-teal-100 bg-teal-50/50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider">
              Clean Claim Rate
            </span>
            <div className="rounded bg-teal-100 p-1 text-teal-700">
              <FileCheck2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {current.cleanClaimRatePercent}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="h-3 w-3" />+{cleanClaimImprovement}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            vs. {baseline.cleanClaimRatePercent}% baseline
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider">
              Days in A/R
            </span>
            <div className="rounded bg-blue-100 p-1 text-blue-700">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {current.daysInAR} <span className="text-xs font-normal text-slate-500">days</span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowDownRight className="h-3 w-3" />-{daysInARReduction}d
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Accelerated from {baseline.daysInAR}d in May
          </div>
        </div>

        <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider">
              Initial Denial Rate
            </span>
            <div className="rounded bg-indigo-100 p-1 text-indigo-700">
              <RotateCcw className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {current.initialDenialRatePercent}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowDownRight className="h-3 w-3" />-{initialDenialDrop}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Down from {baseline.initialDenialRatePercent}% initial rate
          </div>
        </div>
      </div>

      {/* Main Visualizations Body */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
          {/* 1. Revenue Cycle Recovery Trend ($) */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Monthly Financial Protection ($)
                </h3>
                <p className="text-[11px] text-slate-500">Pre-bill prevented denials + post-bill appeals recovered</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +$614.5k / mo vs Baseline
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11, fill: "#475569" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatShortCurrency}
                    tick={{ fontSize: 11, fill: "#475569" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomFinancialTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
                  />
                  <Bar
                    dataKey="preventedDenials"
                    name="Prevented Denials (Pre-Bill)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={38}
                  />
                  <Bar
                    dataKey="recoveredAppeals"
                    name="Appeals Recovered (Post-Bill)"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={38}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalProtectedRevenue"
                    name="Total Protected Revenue"
                    stroke="#0f766e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0f766e", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-4">
              <span>May 2026: <strong className="text-slate-800">$395k</strong></span>
              <span>•</span>
              <span>Jun 2026: <strong className="text-slate-800">$580k</strong></span>
              <span>•</span>
              <span>Jul 2026: <strong className="text-slate-800">$785k</strong></span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Aug 2026: $1.01M</span>
            </div>
          </div>

          {/* 2. Operational Velocity & Quality Trends (%) */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                  Clean Claim Rate & A/R Turnaround
                </h3>
                <p className="text-[11px] text-slate-500">Quality score expansion and cash-acceleration curve</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                -15.4 Days in A/R
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11, fill: "#475569" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  {/* Left Y Axis for Percentages */}
                  <YAxis
                    yAxisId="left"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: "#475569" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  {/* Right Y Axis for Days in A/R */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[20, 60]}
                    tickFormatter={(v) => `${v}d`}
                    tick={{ fontSize: 11, fill: "#3b82f6" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomVelocityTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cleanClaimRatePercent"
                    name="Clean Claim Rate (%)"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#059669", strokeWidth: 2, stroke: "#fff" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="initialDenialRatePercent"
                    name="Initial Denial Rate (%)"
                    stroke="#e11d48"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#e11d48", strokeWidth: 2, stroke: "#fff" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="daysInAR"
                    name="Days in A/R (Days)"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-4">
              <span>Clean Claims: <strong className="text-emerald-700">{baseline.cleanClaimRatePercent}% → {current.cleanClaimRatePercent}%</strong></span>
              <span>•</span>
              <span>Days in A/R: <strong className="text-blue-700">{baseline.daysInAR}d → {current.daysInAR}d</strong></span>
              <span>•</span>
              <span>Denials: <strong className="text-rose-700">{baseline.initialDenialRatePercent}% → {current.initialDenialRatePercent}%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Financial Deep-Dive Tab */}
      {activeTab === "financial" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Pre-Bill vs. Post-Bill Recovery Breakdown Over Time
                </h3>
                <p className="text-xs text-slate-500">
                  Comparing proactive pre-submission interception against post-claim overturns
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Select month details:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  {monthlyData.map((m) => (
                    <option key={m.monthKey} value={m.monthKey}>
                      {m.monthLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrevented" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: "#475569" }} />
                  <YAxis tickFormatter={formatShortCurrency} tick={{ fontSize: 11, fill: "#475569" }} />
                  <Tooltip content={<CustomFinancialTooltip />} />
                  <Legend verticalAlign="top" height={32} />
                  <Area
                    type="monotone"
                    dataKey="preventedDenials"
                    name="Prevented Denials ($)"
                    stroke="#059669"
                    fillOpacity={1}
                    fill="url(#colorPrevented)"
                  />
                  <Area
                    type="monotone"
                    dataKey="recoveredAppeals"
                    name="Appeals Recovered ($)"
                    stroke="#4f46e5"
                    fillOpacity={1}
                    fill="url(#colorRecovered)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Selected Month Breakdown Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Detailed Performance Spotlight: {selectedMonthData.monthLabel}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Gross Collections: {formatCurrency(selectedMonthData.netCollected)} / {formatCurrency(selectedMonthData.grossBilled)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-md bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-slate-500 text-[11px]">Total Protected</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  {formatCurrency(selectedMonthData.totalProtectedRevenue)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Combined yield</div>
              </div>
              <div className="rounded-md bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-slate-500 text-[11px]">Pre-Bill Prevented</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {formatCurrency(selectedMonthData.preventedDenials)}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">
                  {Math.round((selectedMonthData.preventedDenials / selectedMonthData.totalProtectedRevenue) * 100)}% of total
                </div>
              </div>
              <div className="rounded-md bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-slate-500 text-[11px]">Appeals Recovered</div>
                <div className="text-base font-bold text-indigo-700 mt-0.5">
                  {formatCurrency(selectedMonthData.recoveredAppeals)}
                </div>
                <div className="text-[10px] text-indigo-600 mt-0.5">
                  {Math.round((selectedMonthData.recoveredAppeals / selectedMonthData.totalProtectedRevenue) * 100)}% of total
                </div>
              </div>
              <div className="rounded-md bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-slate-500 text-[11px]">Pre-Bill Leakage Scanned</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {formatCurrency(selectedMonthData.preBillLeakageIntercepted)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Intercepted in CDI / QA</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality & Velocity Tab */}
      {activeTab === "velocity" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Revenue Velocity, Claim Quality & Aged A/R Compounding
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking 4-month reduction in accounts receivable aging and provider clarification agreement
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: "#475569" }} />
                  <YAxis
                    yAxisId="pct"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: "#475569" }}
                  />
                  <YAxis
                    yAxisId="days"
                    orientation="right"
                    domain={[0, 60]}
                    tickFormatter={(v) => `${v}d`}
                    tick={{ fontSize: 11, fill: "#2563eb" }}
                  />
                  <Tooltip content={<CustomVelocityTooltip />} />
                  <Legend verticalAlign="top" height={32} />
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="cleanClaimRatePercent"
                    name="Clean Claim Rate (%)"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="cdiQueryAgreementRatePercent"
                    name="CDI Query Agreement (%)"
                    stroke="#d97706"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="agedAROver90DaysPercent"
                    name="Aged A/R >90 Days (%)"
                    stroke="#9333ea"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="days"
                    type="monotone"
                    dataKey="daysInAR"
                    name="Days in A/R"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4-Month Performance Scorecard Table Tab */}
      {activeTab === "table" && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Financial & RCM Indicator</th>
                {monthlyData.map((m) => (
                  <th
                    key={m.monthKey}
                    className={`px-4 py-3 text-right ${
                      m.isCurrentMonth ? "bg-emerald-50/70 text-emerald-900 font-bold" : ""
                    }`}
                  >
                    <div className="flex flex-col items-end">
                      <span>{m.shortLabel}</span>
                      {m.isCurrentMonth && (
                        <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-extrabold">
                          Current Run
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-emerald-800 font-bold bg-slate-100/60">
                  4-Month Net Delta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {/* Row 1: Total Protected Revenue */}
              <tr className="hover:bg-slate-50/50 font-semibold">
                <td className="px-4 py-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Total Value Protected</span>
                </td>
                {monthlyData.map((m) => (
                  <td
                    key={m.monthKey}
                    className={`px-4 py-2.5 text-right font-bold ${
                      m.isCurrentMonth ? "bg-emerald-50/40 text-emerald-700" : ""
                    }`}
                  >
                    {formatCurrency(m.totalProtectedRevenue)}
                  </td>
                ))}
                <td className="px-4 py-2.5 text-right font-bold text-emerald-700 bg-emerald-50/30">
                  +{revenueProtectedGrowth}%
                </td>
              </tr>

              {/* Row 2: Pre-Bill Prevented */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-slate-600 pl-8">↳ Pre-Bill Prevented Denials</td>
                {monthlyData.map((m) => (
                  <td key={m.monthKey} className={`px-4 py-2 text-right ${m.isCurrentMonth ? "bg-emerald-50/20" : ""}`}>
                    {formatCurrency(m.preventedDenials)}
                  </td>
                ))}
                <td className="px-4 py-2 text-right text-emerald-700 font-semibold bg-slate-50/30">
                  +${((current.preventedDenials - baseline.preventedDenials) / 1000).toFixed(0)}k
                </td>
              </tr>

              {/* Row 3: Appeals Recovered */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-slate-600 pl-8">↳ Post-Bill Appeals Recovered</td>
                {monthlyData.map((m) => (
                  <td key={m.monthKey} className={`px-4 py-2 text-right ${m.isCurrentMonth ? "bg-emerald-50/20" : ""}`}>
                    {formatCurrency(m.recoveredAppeals)}
                  </td>
                ))}
                <td className="px-4 py-2 text-right text-indigo-700 font-semibold bg-slate-50/30">
                  +${((current.recoveredAppeals - baseline.recoveredAppeals) / 1000).toFixed(0)}k
                </td>
              </tr>

              {/* Row 4: Clean Claim Rate */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2.5 font-medium flex items-center gap-1.5">
                  <FileCheck2 className="h-3.5 w-3.5 text-teal-600" />
                  <span>Clean Claim Rate (%)</span>
                </td>
                {monthlyData.map((m) => (
                  <td
                    key={m.monthKey}
                    className={`px-4 py-2.5 text-right font-medium ${
                      m.isCurrentMonth ? "bg-emerald-50/40 text-emerald-800 font-bold" : ""
                    }`}
                  >
                    {m.cleanClaimRatePercent}%
                  </td>
                ))}
                <td className="px-4 py-2.5 text-right font-bold text-emerald-700 bg-emerald-50/30">
                  +{cleanClaimImprovement}%
                </td>
              </tr>

              {/* Row 5: Days in A/R */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2.5 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  <span>Days in A/R</span>
                </td>
                {monthlyData.map((m) => (
                  <td
                    key={m.monthKey}
                    className={`px-4 py-2.5 text-right font-medium ${
                      m.isCurrentMonth ? "bg-emerald-50/40 text-blue-800 font-bold" : ""
                    }`}
                  >
                    {m.daysInAR} days
                  </td>
                ))}
                <td className="px-4 py-2.5 text-right font-bold text-emerald-700 bg-emerald-50/30">
                  -{daysInARReduction} days
                </td>
              </tr>

              {/* Row 6: Initial Denial Rate */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2.5 font-medium flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
                  <span>Initial Claim Denial Rate (%)</span>
                </td>
                {monthlyData.map((m) => (
                  <td
                    key={m.monthKey}
                    className={`px-4 py-2.5 text-right font-medium ${
                      m.isCurrentMonth ? "bg-emerald-50/40 text-rose-800 font-bold" : ""
                    }`}
                  >
                    {m.initialDenialRatePercent}%
                  </td>
                ))}
                <td className="px-4 py-2.5 text-right font-bold text-emerald-700 bg-emerald-50/30">
                  -{initialDenialDrop}%
                </td>
              </tr>

              {/* Row 7: Aged A/R >90 Days */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-slate-600 pl-8">↳ Aged A/R &gt;90 Days (%)</td>
                {monthlyData.map((m) => (
                  <td key={m.monthKey} className={`px-4 py-2 text-right ${m.isCurrentMonth ? "bg-emerald-50/20" : ""}`}>
                    {m.agedAROver90DaysPercent}%
                  </td>
                ))}
                <td className="px-4 py-2 text-right text-emerald-700 font-semibold bg-slate-50/30">
                  -{(baseline.agedAROver90DaysPercent - current.agedAROver90DaysPercent).toFixed(1)}%
                </td>
              </tr>

              {/* Row 8: CDI Physician Clarification Agreement */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-slate-600 pl-8">↳ CDI Clarification Agreement (%)</td>
                {monthlyData.map((m) => (
                  <td key={m.monthKey} className={`px-4 py-2 text-right ${m.isCurrentMonth ? "bg-emerald-50/20" : ""}`}>
                    {m.cdiQueryAgreementRatePercent}%
                  </td>
                ))}
                <td className="px-4 py-2 text-right text-emerald-700 font-semibold bg-slate-50/30">
                  +{(current.cdiQueryAgreementRatePercent - baseline.cdiQueryAgreementRatePercent).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

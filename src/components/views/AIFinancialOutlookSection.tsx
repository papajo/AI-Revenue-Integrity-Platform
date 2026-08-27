import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
  Dot,
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Sliders,
  FileCheck2,
  Layers,
  ChevronRight,
  Info,
  DollarSign,
  Activity,
  BarChart2,
} from "lucide-react";
import { ProjectedKpiDataPoint, NextQuarterProjectionSummary, FinancialMetrics } from "../../types";
import { mockOutlookProjections, mockNextQuarterSummary } from "../../data/mockData";

interface AIFinancialOutlookSectionProps {
  projections?: ProjectedKpiDataPoint[];
  summary?: NextQuarterProjectionSummary;
  currentMetrics?: FinancialMetrics;
}

export const AIFinancialOutlookSection: React.FC<AIFinancialOutlookSectionProps> = ({
  projections = mockOutlookProjections,
  summary = mockNextQuarterSummary,
  currentMetrics,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "quality" | "arDays" | "collections">("revenue");
  const [scenario, setScenario] = useState<"expected" | "conservative" | "accelerated">("expected");
  const [selectedPointKey, setSelectedPointKey] = useState<string>("2026-10");

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

  // Scenario Multiplier adjustment on projections
  const adjustedProjections = useMemo(() => {
    const multiplier = scenario === "conservative" ? 0.92 : scenario === "accelerated" ? 1.08 : 1.0;
    const qualityBonus = scenario === "conservative" ? -0.8 : scenario === "accelerated" ? 0.6 : 0;
    const arReductionBonus = scenario === "conservative" ? 1.5 : scenario === "accelerated" ? -1.2 : 0;

    return projections.map((p) => {
      if (p.isActual) {
        return {
          ...p,
          actualProtectedRevenue: p.actualProtectedRevenue,
          actualCleanClaimRate: p.actualCleanClaimRate,
          actualInitialDenialRate: p.actualInitialDenialRate,
          actualDaysInAR: p.actualDaysInAR,
          actualNetCollected: p.actualNetCollected,
          trendProtectedRevenue: p.trendProtectedRevenue,
          trendCleanClaimRate: p.trendCleanClaimRate,
          trendInitialDenialRate: p.trendInitialDenialRate,
          trendDaysInAR: p.trendDaysInAR,
          trendNetCollected: p.trendNetCollected,
          projectedTrendRevenue: p.isCurrent ? p.trendProtectedRevenue : undefined,
          projectedCleanRate: p.isCurrent ? p.trendCleanClaimRate : undefined,
          projectedDenialRate: p.isCurrent ? p.trendInitialDenialRate : undefined,
          projectedDaysAR: p.isCurrent ? p.trendDaysInAR : undefined,
          projectedCollections: p.isCurrent ? p.trendNetCollected : undefined,
        };
      }

      const adjRevenue = Math.round(p.trendProtectedRevenue * multiplier);
      const adjCleanRate = Math.min(99.6, +(p.trendCleanClaimRate + qualityBonus).toFixed(1));
      const adjDenialRate = Math.max(1.0, +(p.trendInitialDenialRate - qualityBonus * 0.5).toFixed(1));
      const adjDaysInAR = Math.max(20.0, +(p.trendDaysInAR + arReductionBonus).toFixed(1));
      const adjCollections = Math.round(p.trendNetCollected * multiplier);
      const confSpread = adjRevenue * 0.08;

      return {
        ...p,
        trendProtectedRevenue: adjRevenue,
        trendCleanClaimRate: adjCleanRate,
        trendInitialDenialRate: adjDenialRate,
        trendDaysInAR: adjDaysInAR,
        trendNetCollected: adjCollections,
        // Differentiate projected lines in chart
        projectedTrendRevenue: adjRevenue,
        projectedCleanRate: adjCleanRate,
        projectedDenialRate: adjDenialRate,
        projectedDaysAR: adjDaysInAR,
        projectedCollections: adjCollections,
        confidenceLower: Math.round(adjRevenue - confSpread),
        confidenceUpper: Math.round(adjRevenue + confSpread),
      };
    });
  }, [projections, scenario]);

  // Dynamically calculate Q4 Projected Summary based on scenario
  const q4Points = adjustedProjections.filter((p) => p.quarter === "Q4 2026");
  const q4ProtectedRevenue = q4Points.reduce((acc, p) => acc + p.trendProtectedRevenue, 0);
  const q4NetCollected = q4Points.reduce((acc, p) => acc + p.trendNetCollected, 0);
  const q4AvgCleanRate = (
    q4Points.reduce((acc, p) => acc + p.trendCleanClaimRate, 0) / q4Points.length
  ).toFixed(1);
  const q4AvgDenialRate = (
    q4Points.reduce((acc, p) => acc + p.trendInitialDenialRate, 0) / q4Points.length
  ).toFixed(1);
  const q4ExitDaysInAR = q4Points[q4Points.length - 1]?.trendDaysInAR || 24.8;
  const confidenceScore =
    scenario === "expected" ? 94.2 : scenario === "conservative" ? 97.8 : 88.5;

  const activePoint =
    adjustedProjections.find((p) => p.periodKey === selectedPointKey) ||
    adjustedProjections[adjustedProjections.length - 1];

  // Custom Chart Tooltip
  const CustomOutlookTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-4 text-xs text-white shadow-2xl backdrop-blur min-w-[280px] z-50">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-bold text-slate-100">{data.label}</span>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                data.isActual
                  ? data.isCurrent
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-700 text-slate-300 border-slate-600"
                  : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
              }`}
            >
              {data.isActual
                ? data.isCurrent
                  ? "Current Live Anchor"
                  : "Historical Actual"
                : "AI Q4 Forecast"}
            </span>
          </div>

          <div className="space-y-2">
            {selectedMetric === "revenue" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                    {data.isActual ? "Actual Protected:" : "Projected Protected:"}
                  </span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {formatCurrency(data.trendProtectedRevenue)}
                  </span>
                </div>
                {!data.isActual && data.confidenceLower && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>95% Confidence Band:</span>
                    <span className="text-slate-200 font-mono">
                      {formatCurrency(data.confidenceLower)} – {formatCurrency(data.confidenceUpper)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Net Collected Cash:</span>
                  <span className="text-slate-200 font-medium">
                    {formatCurrency(data.trendNetCollected)}
                  </span>
                </div>
              </>
            )}

            {selectedMetric === "quality" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-teal-400 inline-block" />
                    Clean Claim Rate:
                  </span>
                  <span className="font-bold text-teal-300 text-sm">
                    {data.trendCleanClaimRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" />
                    Initial Denial Rate:
                  </span>
                  <span className="font-bold text-rose-300 text-sm">
                    {data.trendInitialDenialRate}%
                  </span>
                </div>
              </>
            )}

            {selectedMetric === "arDays" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />
                    Days in A/R Turnaround:
                  </span>
                  <span className="font-bold text-blue-300 text-sm">
                    {data.trendDaysInAR} days
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Turnaround Improvement:</span>
                  <span className="text-emerald-400 font-medium">
                    -{(47.8 - data.trendDaysInAR).toFixed(1)} days vs Baseline
                  </span>
                </div>
              </>
            )}

            {selectedMetric === "collections" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 inline-block" />
                    Monthly Net Collections:
                  </span>
                  <span className="font-bold text-indigo-300 text-sm">
                    {formatCurrency(data.trendNetCollected)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Protected Revenue Share:</span>
                  <span className="text-emerald-400 font-medium">
                    {formatCurrency(data.trendProtectedRevenue)}
                  </span>
                </div>
              </>
            )}

            {data.notes && (
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
                <span className="text-indigo-400 font-semibold not-italic">AI Milestone: </span>
                {data.notes}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>AI Predictive Modeling & Quarterly Trajectory</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            AI Financial Outlook: Next Quarter (Q4 2026) Projected KPIs
          </h2>
          <p className="text-xs text-slate-500">
            Predictive revenue cycle performance model combining multi-agent Bayesian regression with live August baseline velocity.
          </p>
        </div>

        {/* Forecast Scenario & View Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scenario Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700">
            <Sliders className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Scenario:</span>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="expected">Expected Baseline (94% Conf.)</option>
              <option value="conservative">Conservative (+15% Payer Friction)</option>
              <option value="accelerated">Accelerated (+10% AI Adoption)</option>
            </select>
          </div>

          {/* Metric View Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setSelectedMetric("revenue")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedMetric === "revenue"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <span>Revenue ($)</span>
            </button>
            <button
              onClick={() => setSelectedMetric("quality")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedMetric === "quality"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>Clean Claims (%)</span>
            </button>
            <button
              onClick={() => setSelectedMetric("arDays")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedMetric === "arDays"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              <span>Days in A/R</span>
            </button>
            <button
              onClick={() => setSelectedMetric("collections")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedMetric === "collections"
                  ? "bg-white text-slate-900 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
              <span>Collections ($)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projected Q4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
              Projected Q4 Protected Rev
            </span>
            <div className="rounded bg-emerald-100 p-1 text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{formatCurrency(q4ProtectedRevenue)}</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="h-3 w-3" />+74.4% vs Q3
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Averaging {formatCurrency(Math.round(q4ProtectedRevenue / 3))}/mo pre-bill interception
          </div>
        </div>

        <div className="rounded-lg border border-teal-100 bg-teal-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider">
              Projected Clean Claim Rate
            </span>
            <div className="rounded bg-teal-100 p-1 text-teal-700">
              <FileCheck2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{q4AvgCleanRate}%</span>
            <span className="text-xs font-semibold text-teal-700 flex items-center">
              <ArrowUpRight className="h-3 w-3" />+1.9% vs Current
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Initial denial rate projected at {q4AvgDenialRate}%
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider">
              Projected Exit Days in A/R
            </span>
            <div className="rounded bg-blue-100 p-1 text-blue-700">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{q4ExitDaysInAR}</span>
            <span className="text-xs font-semibold text-slate-600">days</span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <ArrowDownRight className="h-3 w-3" />-7.6d vs Aug
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Compressed from 47.8 baseline days
          </div>
        </div>

        <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider">
              Q4 Cash Flow Velocity Lift
            </span>
            <div className="rounded bg-indigo-100 p-1 text-indigo-700">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">+{formatCurrency(summary.estimatedCashFlowLift)}</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">
              {confidenceScore}% Conf
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Total Q4 net collected: {formatCurrency(q4NetCollected)}
          </div>
        </div>
      </div>

      {/* Main Trend Line Chart Visualization */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-600" />
              {selectedMetric === "revenue" && "Quarterly Revenue Protection Trajectory (May 2026 – Dec 2026)"}
              {selectedMetric === "quality" && "First-Pass Clean Claim Rate (%) vs Initial Denial Rate (%)"}
              {selectedMetric === "arDays" && "Accounts Receivable Turnaround Velocity (Days in A/R)"}
              {selectedMetric === "collections" && "Monthly Net Cash Collections & AI Contribution"}
            </h3>
            <p className="text-xs text-slate-500">
              Solid Line: Historical Actuals (May–Aug 2026) • Dashed Line: Projected Q4 AI Trajectory (Sep–Dec 2026)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-4 bg-slate-400 rounded-full inline-block" />
              <span className="text-slate-600 font-medium">Actuals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 border-t-2 border-dashed border-emerald-600 inline-block" />
              <span className="text-emerald-700 font-semibold">AI Forecast (Q4)</span>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-72 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={adjustedProjections}
              margin={{ top: 15, right: 25, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              
              <XAxis
                dataKey="shortLabel"
                tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />

              {/* Dynamic Y Axis based on Selected Metric */}
              {selectedMetric === "revenue" && (
                <YAxis
                  domain={[0, 1800000]}
                  tickFormatter={formatShortCurrency}
                  tick={{ fontSize: 11, fill: "#059669" }}
                  axisLine={false}
                  tickLine={false}
                />
              )}

              {selectedMetric === "quality" && (
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11, fill: "#0d9488" }}
                  axisLine={false}
                  tickLine={false}
                />
              )}

              {selectedMetric === "arDays" && (
                <YAxis
                  domain={[15, 55]}
                  tickFormatter={(v) => `${v}d`}
                  tick={{ fontSize: 11, fill: "#2563eb" }}
                  axisLine={false}
                  tickLine={false}
                />
              )}

              {selectedMetric === "collections" && (
                <YAxis
                  domain={[2000000, 5000000]}
                  tickFormatter={formatShortCurrency}
                  tick={{ fontSize: 11, fill: "#4f46e5" }}
                  axisLine={false}
                  tickLine={false}
                />
              )}

              <Tooltip content={<CustomOutlookTooltip />} />

              {/* Vertical Reference Line at Current Live Month */}
              <ReferenceLine
                x="Aug (Curr)"
                stroke="#059669"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: "Live Anchor (Aug 2026)",
                  fill: "#059669",
                  fontSize: 10,
                  fontWeight: 600,
                  position: "insideTopLeft",
                }}
              />

              {/* 1. REVENUE METRIC LINES */}
              {selectedMetric === "revenue" && (
                <>
                  {/* Historical Solid Line */}
                  <Line
                    type="monotone"
                    dataKey="actualProtectedRevenue"
                    name="Actual Protected ($)"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#047857" }}
                    connectNulls={false}
                  />

                  {/* Forecast Dashed Line */}
                  <Line
                    type="monotone"
                    dataKey="projectedTrendRevenue"
                    name="Projected Protected ($)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#059669" }}
                    connectNulls={true}
                  />
                </>
              )}

              {/* 2. QUALITY & CLEAN CLAIM LINES */}
              {selectedMetric === "quality" && (
                <>
                  {/* Actual Clean Claim Rate */}
                  <Line
                    type="monotone"
                    dataKey="actualCleanClaimRate"
                    name="Actual Clean Claim %"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0d9488", stroke: "#ffffff", strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  {/* Projected Clean Claim Rate */}
                  <Line
                    type="monotone"
                    dataKey="projectedCleanRate"
                    name="Projected Clean Claim %"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "#14b8a6", stroke: "#ffffff", strokeWidth: 2 }}
                    connectNulls={true}
                  />

                  {/* Actual Initial Denial Rate */}
                  <Line
                    type="monotone"
                    dataKey="actualInitialDenialRate"
                    name="Actual Initial Denial %"
                    stroke="#e11d48"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#e11d48", stroke: "#ffffff", strokeWidth: 1.5 }}
                    connectNulls={false}
                  />
                  {/* Projected Initial Denial Rate */}
                  <Line
                    type="monotone"
                    dataKey="projectedDenialRate"
                    name="Projected Initial Denial %"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: "#f43f5e", stroke: "#ffffff", strokeWidth: 1.5 }}
                    connectNulls={true}
                  />
                </>
              )}

              {/* 3. DAYS IN A/R LINES */}
              {selectedMetric === "arDays" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="actualDaysInAR"
                    name="Actual Days in A/R"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedDaysAR"
                    name="Projected Days in A/R"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                    connectNulls={true}
                  />
                </>
              )}

              {/* 4. NET COLLECTIONS LINES */}
              {selectedMetric === "collections" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="actualNetCollected"
                    name="Actual Net Collections ($)"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#4f46e5", stroke: "#ffffff", strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedCollections"
                    name="Projected Net Collections ($)"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
                    connectNulls={true}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Indicator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <Info className="h-3.5 w-3.5 text-indigo-600" />
            <span>Select a projection milestone to inspect underlying operational drivers:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {adjustedProjections.map((p) => (
              <button
                key={p.periodKey}
                onClick={() => setSelectedPointKey(p.periodKey)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  p.periodKey === selectedPointKey
                    ? "bg-slate-900 text-white shadow-2xs"
                    : p.isActual
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                {p.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Period Spotlight & Key Growth Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 1-col: Selected Milestone Snapshot */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span>{activePoint.label} Milestone</span>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                  activePoint.isActual
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {activePoint.quarter}
              </span>
            </div>

            <div className="space-y-2.5 mt-3 text-xs">
              <div className="rounded-lg bg-white p-2.5 border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] text-slate-500">Monthly Protected Revenue</span>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  {formatCurrency(activePoint.trendProtectedRevenue)}
                </div>
                <span className="text-[10px] text-slate-400">
                  {activePoint.isActual ? "Historical verified" : `95% CI: ${formatCurrency(activePoint.confidenceLower || 0)} - ${formatCurrency(activePoint.confidenceUpper || 0)}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500">Clean Claim Pass</span>
                  <div className="text-sm font-bold text-teal-700 mt-0.5">{activePoint.trendCleanClaimRate}%</div>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500">Days in A/R</span>
                  <div className="text-sm font-bold text-blue-700 mt-0.5">{activePoint.trendDaysInAR}d</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-indigo-100 text-[11px] text-slate-600">
            <span className="font-semibold text-indigo-900">AI Context: </span>
            {activePoint.notes || "Continuous auto-scrubbing and real-time electronic 278 auth verification."}
          </div>
        </div>

        {/* Right 2-cols: Strategic AI Levers Driving Q4 Outlook */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Key AI Drivers Fueling Next Quarter Performance</h4>
              <p className="text-xs text-slate-500">Automated interventions active across the revenue cycle lifecycle</p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {summary.forecastModel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {summary.keyDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-slate-50 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{driver.title}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {driver.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {driver.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

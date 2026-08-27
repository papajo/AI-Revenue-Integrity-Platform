import React, { useState } from "react";
import {
  ListFilter,
  Search,
  AlertCircle,
  Clock,
  DollarSign,
  Sparkles,
  CheckCircle2,
  XCircle,
  Send,
  FileEdit,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { WorkQueueItem, UserRole } from "../../types";

interface WorkQueueProps {
  items: WorkQueueItem[];
  currentRole: UserRole;
  maskPhi: boolean;
  onSelectModule: (module: string) => void;
  onResolveItem: (itemId: string) => void;
}

export const WorkQueueView: React.FC<WorkQueueProps> = ({
  items,
  currentRole,
  maskPhi,
  onSelectModule,
  onResolveItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<WorkQueueItem | null>(items[0] || null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.payer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === "All" || item.module === selectedModule;
    const matchesPriority = selectedPriority === "All" || item.priorityLevel === selectedPriority;
    return matchesSearch && matchesModule && matchesPriority;
  });

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "Urgent":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "High":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getModuleBadge = (mod: string) => {
    switch (mod) {
      case "Prior Auth":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Doc Integrity":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Coding QA":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Denials & Appeals":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Discharge":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Priority Formula */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Unified Revenue Integrity Work Queue</h1>
          <p className="text-xs text-slate-500">
            Intelligent task triage ranked by{" "}
            <span className="font-semibold text-slate-700">
              Financial Impact × Probability of Recovery × Urgency × Preventability
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-xs font-semibold text-emerald-800">
            {filteredItems.length} Active Tasks
          </div>
          <div className="rounded-lg bg-slate-100 px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700">
            Total Exposure: ${(items.reduce((acc, i) => acc + i.financialImpact, 0)).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient, encounter, payer, or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
        </div>

        {/* Module Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Module:</span>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Modules</option>
            <option value="Doc Integrity">Doc Integrity (CDI)</option>
            <option value="Coding QA">Coding QA</option>
            <option value="Prior Auth">Prior Auth</option>
            <option value="Denials & Appeals">Denials & Appeals</option>
            <option value="Discharge">Discharge</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent (Score 95+)</option>
            <option value="High">High (Score 80-94)</option>
            <option value="Medium">Medium (Score 60-79)</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Work Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Task List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredItems.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`rounded-xl border p-4 transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${getPriorityColor(
                          item.priorityLevel
                        )}`}
                      >
                        {item.priorityLevel} • {item.priorityScore}/100
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${getModuleBadge(
                          item.module
                        )}`}
                      >
                        {item.module}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{item.encounterId}</span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900">{item.title}</h2>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-emerald-800">
                      ${item.financialImpact.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-600">Exposure</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">
                      {maskPhi ? "Confidential Patient" : item.patientName}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600">{item.payer}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <Sparkles className="h-3 w-3" />
                      {(item.confidence * 100).toFixed(0)}% AI Conf.
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <div className="font-semibold text-slate-800">No matching tasks found</div>
              <div className="text-xs">All revenue integrity tasks in this category have been resolved!</div>
            </div>
          )}
        </div>

        {/* Right Column: Active Task Action Panel (Section 26 UI Example) */}
        <div className="lg:col-span-5">
          {activeItem ? (
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase border ${getPriorityColor(
                    activeItem.priorityLevel
                  )}`}
                >
                  {activeItem.priorityLevel} PRIORITY TASK
                </span>
                <span className="text-xs font-mono text-slate-500">{activeItem.id}</span>
              </div>

              {/* Patient & Context */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold text-slate-800">
                    {maskPhi ? "Confidential Patient" : activeItem.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Encounter:</span>
                  <span className="font-mono font-medium text-slate-800">{activeItem.encounterId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payer:</span>
                  <span className="font-medium text-slate-800">{activeItem.payer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Agent:</span>
                  <span className="font-medium text-emerald-800">{activeItem.assignedAgent}</span>
                </div>
              </div>

              {/* Issue & Clinical Evidence */}
              <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-2 border border-slate-200/80">
                <div className="font-bold text-slate-900">Potential Issue:</div>
                <p className="text-slate-700 leading-relaxed">{activeItem.description}</p>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                  <span className="text-slate-500">Estimated Financial Exposure:</span>
                  <span className="text-sm font-black text-rose-600">
                    ${activeItem.financialImpact.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">AI Confidence:</span>
                  <span className="font-bold text-emerald-700">
                    {(activeItem.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Action Buttons (Section 26 standard) */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    const modKey =
                      activeItem.module === "Doc Integrity"
                        ? "doc_integrity"
                        : activeItem.module === "Coding QA"
                        ? "coding_qa"
                        : activeItem.module === "Prior Auth"
                        ? "prior_auth"
                        : activeItem.module === "Denials & Appeals"
                        ? "denials_appeals"
                        : "discharge_intel";
                    onSelectModule(modKey);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Open in {activeItem.module} Module</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onResolveItem(activeItem.id);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approve & Resolve</span>
                  </button>

                  <button
                    onClick={() => {
                      onResolveItem(activeItem.id);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>Dismiss / Defer</span>
                  </button>
                </div>
              </div>

              {/* Human Accountability Notice (Principle 3.2) */}
              <div className="text-[10px] text-slate-600 text-center leading-tight">
                AI recommends; human reviewer ({currentRole}) remains clinically and financially accountable.
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
              Select a work queue item to view clinical evidence & take action.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

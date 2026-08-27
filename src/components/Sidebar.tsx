import React from "react";
import {
  LayoutDashboard,
  ListTodo,
  FileCheck2,
  FileCode2,
  ShieldAlert,
  RotateCcw,
  FileText,
  BadgeDollarSign,
  Workflow,
  Sparkles,
  Share2,
  Lock,
  X,
} from "lucide-react";
import { UserRole } from "../types";

export type NavTab =
  | "dashboard"
  | "work_queue"
  | "doc_integrity"
  | "coding_qa"
  | "prior_auth"
  | "denials_appeals"
  | "discharge_intel"
  | "billing_service"
  | "end_to_end_demo"
  | "ai_studio"
  | "integration_hub"
  | "governance_audit";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  workQueueCount?: number;
  docGapCount?: number;
  codingIssueCount?: number;
  priorAuthGapCount?: number;
  denialCount?: number;
  currentRole?: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  setActiveTab,
  workQueueCount = 6,
  docGapCount = 4,
  codingIssueCount = 3,
  priorAuthGapCount = 2,
  denialCount = 4,
  isOpen = false,
  onClose,
}) => {
  const handleSelect = (tabId: string) => {
    if (typeof onSelectTab === "function") {
      onSelectTab(tabId);
    } else if (typeof setActiveTab === "function") {
      setActiveTab(tabId);
    }
    if (onClose) {
      onClose();
    }
  };

  const navSections = [
    {
      group: "Core Command",
      items: [
        {
          id: "dashboard",
          label: "Executive ROI Hub",
          icon: LayoutDashboard,
          badge: "$1.8M Saved",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        {
          id: "work_queue",
          label: "Revenue Work Queue",
          icon: ListTodo,
          badge: workQueueCount ? workQueueCount.toString() : undefined,
          badgeColor: "bg-amber-100 text-amber-800",
        },
      ],
    },
    {
      group: "AI Revenue Integrity Modules",
      items: [
        {
          id: "doc_integrity",
          label: "1. Doc Integrity (CDI)",
          icon: FileCheck2,
          badge: docGapCount > 0 ? `${docGapCount} gaps` : undefined,
          badgeColor: "bg-rose-100 text-rose-800",
        },
        {
          id: "coding_qa",
          label: "2. Coding QA & NCCI",
          icon: FileCode2,
          badge: codingIssueCount > 0 ? `${codingIssueCount} edits` : undefined,
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          id: "prior_auth",
          label: "3. Prior Auth Intel",
          icon: ShieldAlert,
          badge: priorAuthGapCount > 0 ? `${priorAuthGapCount} action` : undefined,
          badgeColor: "bg-purple-100 text-purple-800",
        },
        {
          id: "denials_appeals",
          label: "4. Denials & Appeals",
          icon: RotateCcw,
          badge: denialCount > 0 ? `${denialCount} denials` : undefined,
          badgeColor: "bg-rose-100 text-rose-800",
        },
        {
          id: "discharge_intel",
          label: "5. Discharge Summary",
          icon: FileText,
        },
        {
          id: "billing_service",
          label: "6. Billing-as-a-Service",
          icon: BadgeDollarSign,
          badge: "BaaS Hub",
          badgeColor: "bg-indigo-100 text-indigo-800",
        },
      ],
    },
    {
      group: "Intelligence & Governance",
      items: [
        {
          id: "end_to_end_demo",
          label: "13-Step Patient Journey",
          icon: Workflow,
          badge: "Interactive",
          badgeColor: "bg-emerald-100 text-emerald-800 font-semibold",
        },
        {
          id: "ai_studio",
          label: "AI Integrity Studio",
          icon: Sparkles,
          badge: "Gemini 3.7",
          badgeColor: "bg-purple-100 text-purple-800",
        },
        {
          id: "integration_hub",
          label: "FHIR R4 & X12 EDI Hub",
          icon: Share2,
        },
        {
          id: "governance_audit",
          label: "AI Governance & Audit",
          icon: Lock,
          badge: "HTI-1",
          badgeColor: "bg-slate-100 text-slate-700",
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto">
      <div className="p-3 space-y-5">
        {/* Mobile close button */}
        {onClose && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 md:hidden">
            <span className="text-xs font-bold text-slate-700">Platform Navigation</span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {navSections.map((section) => (
          <div key={section.group} className="space-y-1">
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              {section.group}
            </div>
            <div className="space-y-0.5 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-emerald-700 text-white shadow-2xs font-semibold"
                        : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-white" : "text-slate-600 group-hover:text-slate-800"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`ml-2 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-none ${
                          isActive ? "bg-white/20 text-white" : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Compliance / Safe Harbor Footer */}
      <div className="p-3 border-t border-slate-200 bg-white/70 text-[11px] text-slate-500">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-700">HIPAA Security Standard</span>
          <span className="text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
            BAA Active
          </span>
        </div>
        <p className="text-[10px] text-slate-600 leading-tight">
          Role-based Access Control • TLS 1.3 Transmission • Immutable Audit Controls
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200 bg-slate-50/70 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex w-72 max-w-full flex-1 flex-col bg-slate-50 shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

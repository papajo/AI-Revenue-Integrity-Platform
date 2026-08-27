import React from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  PlayCircle,
  Building2,
  UserCheck,
  Menu,
} from "lucide-react";
import { UserRole, OrganizationTier } from "../types";

interface NavbarProps {
  currentRole: UserRole | string;
  onRoleChange?: (role: any) => void;
  setCurrentRole?: (role: any) => void;
  currentOrgTier?: OrganizationTier;
  currentOrg?: string;
  onOrgChange?: (org: string) => void;
  setCurrentOrgTier?: (tier: OrganizationTier) => void;
  maskPhi: boolean;
  onToggleMaskPhi?: () => void;
  setMaskPhi?: (mask: boolean) => void;
  onMenuToggle?: () => void;
  onStartDemo?: () => void;
  onOpenNewEncounter?: () => void;
  hasLiveAI?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  setCurrentRole,
  currentOrgTier,
  currentOrg,
  onOrgChange,
  setCurrentOrgTier,
  maskPhi,
  onToggleMaskPhi,
  setMaskPhi,
  onMenuToggle,
  onStartDemo,
  onOpenNewEncounter,
  hasLiveAI = true,
}) => {
  const roleNames: Record<string, string> = {
    "CDI Specialist": "CDI Specialist",
    "Medical Coder": "Medical Coder",
    "Coding Auditor": "Coding Auditor",
    "Prior Auth Specialist": "Prior Auth Specialist",
    "Appeals Specialist": "Appeals Specialist",
    "Billing Manager": "Billing Manager",
    "VP of Revenue Cycle": "VP of Revenue Cycle",
    "Compliance Officer": "Compliance Officer",
    cdi_specialist: "CDI Specialist",
    medical_coder: "Medical Coder",
    coding_auditor: "Coding Auditor",
    appeals_specialist: "Appeals Specialist",
    prior_auth_specialist: "Prior Auth Specialist",
    vp_revenue_cycle: "VP of Revenue Cycle",
    compliance_officer: "Compliance Officer",
    system_admin: "Organization Admin",
  };

  const orgOptions = [
    "St. Jude Memorial Health System (Multi-Hospital)",
    "Tier 1: Physician Practice Group",
    "Tier 2: Regional Acute Hospital",
    "Tier 3: Academic Health System",
    "Tier 4: Enterprise RCM Partner",
  ];

  const handleRoleChange = (newRole: any) => {
    if (onRoleChange) onRoleChange(newRole);
    else if (setCurrentRole) setCurrentRole(newRole);
  };

  const handleOrgChange = (newOrg: string) => {
    if (onOrgChange) onOrgChange(newOrg);
    else if (setCurrentOrgTier) setCurrentOrgTier(newOrg as OrganizationTier);
  };

  const handleTogglePhi = () => {
    if (onToggleMaskPhi) onToggleMaskPhi();
    else if (setMaskPhi) setMaskPhi(!maskPhi);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur shadow-2xs">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        {/* Brand & Platform Identity */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="flex md:hidden items-center justify-center p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
              title="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-xs">
            <Shield className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">
                AegisRev
              </span>
              <span className="hidden sm:inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200/70">
                Revenue Integrity OS
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-normal">
              Pre-Bill Prevention • Coding QA • Prior Auth • Denials • BaaS
            </p>
          </div>
        </div>

        {/* Center Controls: Org & Role Switcher */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Org Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs">
            <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <select
              value={currentOrg || currentOrgTier || orgOptions[0]}
              onChange={(e) => handleOrgChange(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-hidden cursor-pointer max-w-[200px] truncate"
            >
              {orgOptions.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
            <span className="text-slate-500">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {Object.entries(roleNames).slice(0, 7).map(([roleKey, label]) => (
                <option key={roleKey} value={roleKey}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: PHI Masking, AI Engine, Demo Shortcut */}
        <div className="flex items-center gap-2">
          {/* PHI Masking Toggle (HIPAA Safe Harbor) */}
          <button
            onClick={handleTogglePhi}
            title={maskPhi ? "PHI is currently de-identified (HIPAA Safe Harbor)" : "Click to de-identify and mask PHI"}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors border cursor-pointer ${
              maskPhi
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            {maskPhi ? <EyeOff className="h-3.5 w-3.5 text-emerald-700 shrink-0" /> : <Eye className="h-3.5 w-3.5 text-amber-700 shrink-0" />}
            <span className="hidden sm:inline">{maskPhi ? "PHI Masked" : "De-identify PHI"}</span>
            <span className="sm:hidden">{maskPhi ? "Masked" : "Raw"}</span>
          </button>

          {/* AI Engine Status */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-2.5 py-1.5 text-xs text-emerald-900">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700 animate-pulse shrink-0" />
            <span className="font-medium">
              {hasLiveAI ? "Gemini 3.7 Flash RCM" : "NLP Rules Engine"}
            </span>
          </div>

          {/* 13-Step Guided Journey */}
          {onStartDemo && (
            <button
              onClick={onStartDemo}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
            >
              <PlayCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline">13-Step Journey</span>
              <span className="md:hidden">Demo</span>
            </button>
          )}

          {/* New Clinical Ingestion / Encounter */}
          {onOpenNewEncounter && (
            <button
              onClick={onOpenNewEncounter}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <span>Ingest</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

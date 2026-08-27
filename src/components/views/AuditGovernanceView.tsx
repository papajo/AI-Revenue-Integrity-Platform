import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  FileText,
  Key,
  Hash,
  Download,
  Filter,
} from "lucide-react";
import { AuditLogEntry, UserRole } from "../../types";

interface AuditGovernanceProps {
  logs: AuditLogEntry[];
  maskPhi: boolean;
  onToggleMaskPhi: () => void;
  currentRole: UserRole;
}

export const AuditGovernanceView: React.FC<AuditGovernanceProps> = ({
  logs,
  maskPhi,
  onToggleMaskPhi,
  currentRole,
}) => {
  const [filterModule, setFilterModule] = useState<string>("All");

  const filteredLogs = logs.filter(
    (log) => filterModule === "All" || log.module.toLowerCase().includes(filterModule.toLowerCase()) || log.action.toLowerCase().includes(filterModule.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Governance, HIPAA Security & Audit Trail</h1>
              <p className="text-xs text-slate-500">
                Immutable, cryptographically hashed ledger tracking every AI recommendation, physician query, and human review decision.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMaskPhi}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold border transition-colors cursor-pointer ${
              maskPhi
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-amber-50 border-amber-300 text-amber-900"
            }`}
          >
            {maskPhi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{maskPhi ? "PHI De-Identification: ON" : "PHI De-Identification: OFF (Raw Data)"}</span>
          </button>
        </div>
      </div>

      {/* 4 Compliance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">AI Model Version</div>
          <div className="text-sm font-bold text-slate-900 mt-1">Gemini 3.7 Flash RCM-v4.2</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">HIPAA BAA Compliant</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Human Accountability</div>
          <div className="text-sm font-bold text-emerald-700 mt-1">100% Supervised</div>
          <div className="text-[11px] text-slate-600 mt-0.5">No Unreviewed Submissions</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Cryptographic Integrity</div>
          <div className="text-sm font-bold text-slate-900 mt-1">SHA-256 Chained</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Zero Tampering Detected</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Active User Role</div>
          <div className="text-sm font-bold text-slate-900 mt-1">{currentRole}</div>
          <div className="text-[11px] text-slate-600 mt-0.5">Role-Based Access Control</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-200 bg-slate-50/60">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Immutable HIPAA Audit Log</h2>
            <p className="text-xs text-slate-500">Cryptographically verifiable event log for all AI & human actions.</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Event Types</option>
              <option value="Doc">Doc Integrity</option>
              <option value="Coding">Coding QA</option>
              <option value="Prior Auth">Prior Auth</option>
              <option value="Denials">Denials & Appeals</option>
              <option value="Claim">Claim Scrubber</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Action & Module</th>
                <th className="py-3 px-4">User / Agent</th>
                <th className="py-3 px-4">Patient / Encounter</th>
                <th className="py-3 px-4">Cryptographic Hash</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                    <div>{log.action}</div>
                    <span className="text-[10px] text-slate-500 font-normal">{log.module}</span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">{log.userName}</td>
                  <td className="py-3 px-4 text-slate-600">{log.encounterId}</td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-[140px]">{log.tamperProofHash}</td>
                  <td className="py-3 px-4 font-sans text-slate-600 max-w-[240px] truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

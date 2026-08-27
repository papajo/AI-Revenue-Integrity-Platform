import React, { useState } from "react";
import {
  Layers,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Zap,
} from "lucide-react";

export const IntegrationHubView: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<"fhir" | "edi" | "ehr">("fhir");

  const integrations = [
    {
      name: "Epic Systems EHR (FHIR R4 / USCDI v3)",
      type: "EHR Direct API",
      status: "Connected & Streaming",
      latency: "42ms",
      eventsPerMin: 1420,
      protocol: "SMART on FHIR OAuth 2.0 / TLS 1.3",
      endpoint: "https://fhir.stjude-health.org/r4/Encounter",
    },
    {
      name: "Oracle Health (Cerner Millennium)",
      type: "EHR Inpatient Feed",
      status: "Connected",
      latency: "58ms",
      eventsPerMin: 890,
      protocol: "HL7 v2.5.1 / FHIR Bulk Data Access",
      endpoint: "https://cerner-bridge.stjude-health.org/api/v1/clinical",
    },
    {
      name: "Availity Clearinghouse (X12 EDI Gateway)",
      type: "Payer EDI Gateway",
      status: "Connected & Processing",
      latency: "110ms",
      eventsPerMin: 320,
      protocol: "X12 270/271, 278, 837P/I, 835 (5010A1)",
      endpoint: "https://gateway.availity.com/edi/v5010/837",
    },
    {
      name: "Change Healthcare / Optum EDI Switch",
      type: "Payer EDI Gateway",
      status: "Connected",
      latency: "95ms",
      eventsPerMin: 210,
      protocol: "AS2 Secure EDI Protocol / 278 Prior Auth",
      endpoint: "https://edi.optum.com/as2/receive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700 border border-blue-200">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Interoperability & Integration Gateway</h1>
              <p className="text-xs text-slate-500">
                Bidirectional FHIR R4, USCDI v3, HL7 v2, and X12 EDI 5010 streaming connectivity with enterprise EHRs and payer clearinghouses.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>4 Active Live Streams (99.99% Uptime)</span>
          </div>
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold text-emerald-700">{item.status}</span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-1">{item.name}</h2>
                <div className="text-xs text-slate-500">{item.type}</div>
              </div>
              <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-mono text-slate-700">
                {item.latency}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1.5 border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Protocol:</span>
                <span className="font-semibold text-slate-800">{item.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Throughput:</span>
                <span className="font-semibold text-slate-800">{item.eventsPerMin} events / min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Endpoint:</span>
                <span className="font-mono text-[11px] text-blue-700 truncate max-w-[200px]">{item.endpoint}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Sample Payloads */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4">
          <button
            onClick={() => setSelectedFormat("fhir")}
            className={`border-b-2 py-3 px-4 text-xs font-semibold cursor-pointer ${
              selectedFormat === "fhir"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Sample FHIR R4 Bundle (Encounter & Condition)
          </button>
          <button
            onClick={() => setSelectedFormat("edi")}
            className={`border-b-2 py-3 px-4 text-xs font-semibold cursor-pointer ${
              selectedFormat === "edi"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Sample X12 837P Professional Claim EDI
          </button>
        </div>

        <div className="p-4 bg-slate-900">
          <pre className="font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {selectedFormat === "fhir"
              ? `{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Encounter",
        "id": "ENC-882194",
        "status": "in-progress",
        "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP" },
        "subject": { "reference": "Patient/PT-49102", "display": "Marcus Brody" },
        "diagnosis": [
          {
            "condition": { "display": "Lumbar Radiculopathy" },
            "use": { "coding": [{ "code": "AD" }] },
            "rank": 1
          }
        ]
      }
    }
  ]
}`
              : `ISA*00*          *00*          *ZZ*SUBMITTER99    *ZZ*AVAILITY       *260827*0930*^*00501*000000837*0*P*:~
GS*HC*SUBMITTER99*AVAILITY*20260827*0930*1*X*005010X222A1~
ST*837*0001*005010X222A1~
BHT*0019*00*CLM-882194*20260827*0930*CH~
NM1*41*2*ST JUDE REVENUE NETWORK*****46*1928471029~
PER*IC*EDI OPERATIONS*TE*8005550199~
NM1*40*2*BLUE CROSS BLUE SHIELD*****46*BCBS9921~
HL*1**20*1~
PRV*BI*PXC*207X00000X~
NM1*85*2*ST JUDE SURGICAL GROUP*****XX*1928471029~
N3*1000 HEALTHCARE BLVD~
N4*LOS ANGELES*CA*90001~
REF*EI*958271029~
HL*2*1*22*0~
SBR*P*18*******CI~
NM1*IL*1*BRODY*MARCUS****MI*BCBS-8840192~
CLM*CLM-882194*42700***11:B:1*Y*A*Y*Y~
HI*BK:M54.16*BF:M51.26~
LX*1~
SV1*HC:22612*42700*UN*1~~~1~
DTP*472*D8*20260827~
REF*G1*AUTH-BCBS-994102~
SE*23*0001~
GE*1*1~
IEA*1*000000837~`}
          </pre>
        </div>
      </div>
    </div>
  );
};

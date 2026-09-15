import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import type { GuardrailCheck, RiskItem } from '../../types';

interface GuardrailsViewProps {
  guardrails: GuardrailCheck[];
  risks: RiskItem[];
}

export const GuardrailsView: React.FC<GuardrailsViewProps> = ({ guardrails, risks }) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>8 Security Guardrails & Risk Assessment (Slide 8 Layer 2 & Slide 9)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Active security boundaries enforcing source credibility, PII redaction, token budgets, and risk mitigation.
        </p>
      </div>

      {/* 8 Guardrails Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Active Enterprise Security Guardrails (8 Controls)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 pb-2">
                <th className="pb-2 font-semibold w-12">#</th>
                <th className="pb-2 font-semibold w-64">Guardrail Control</th>
                <th className="pb-2 font-semibold w-24">Status</th>
                <th className="pb-2 font-semibold">Audit Enforcement Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {guardrails.map((g) => (
                <tr key={g.id} className="hover:bg-slate-950/40">
                  <td className="py-3 text-slate-500 font-bold">{g.id}</td>
                  <td className="py-3 font-semibold text-white">{g.name}</td>
                  <td className="py-3">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 font-sans text-xs">{g.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Assessment List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Risk Agent Strategic Threat Analysis</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {risks.map((r, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{r.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  r.severity === 'HIGH'
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {r.severity}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{r.description}</p>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Mitigation Strategy:</span>
                {r.mitigation_strategy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

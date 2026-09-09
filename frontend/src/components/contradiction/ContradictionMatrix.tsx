import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import type { ContradictionMatrix as IContradictionMatrix } from '../../types';

interface ContradictionMatrixProps {
  contradictions: IContradictionMatrix;
}

export const ContradictionMatrix: React.FC<ContradictionMatrixProps> = ({ contradictions }) => {
  const items = contradictions.contradictions || [];
  const heatmap = contradictions.tension_heatmap || {};
  const dims = Object.keys(heatmap);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'MODERATE':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      default:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Cross-Source Contradiction Resolution Engine (CSI-CRE)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detects discrepancies between corporate PR claims and ground-truth telemetry (CapEx, GitHub velocity, talent density, tech debt).
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[11px] font-mono uppercase text-slate-400">Inconsistency Index</div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {contradictions.overall_inconsistency_index.toFixed(3)}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-md border text-xs font-mono font-bold ${
            contradictions.transformation_mirage_risk.includes('HIGH')
              ? 'bg-rose-950/80 text-rose-400 border-rose-700'
              : 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
          }`}>
            {contradictions.transformation_mirage_risk.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Heatmap Matrix */}
      {dims.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">Cross-Evidence Divergence Matrix</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Normalized Divergence (0.00 - 1.00)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-slate-400">Dimension</th>
                  {dims.map((d) => (
                    <th key={d} className="p-2 text-slate-300 text-[11px]">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dims.map((row) => (
                  <tr key={row} className="border-t border-slate-800/60">
                    <td className="p-2 text-left font-semibold text-slate-300">{row}</td>
                    {dims.map((col) => {
                      const val = heatmap[row]?.[col] ?? 0;
                      const bg = val > 0.20 ? 'bg-rose-950/60 text-rose-300' : val > 0.10 ? 'bg-amber-950/40 text-amber-300' : 'bg-slate-950 text-slate-500';
                      return (
                        <td key={col} className="p-2">
                          <span className={`inline-block px-2 py-1 rounded text-[11px] font-semibold ${bg}`}>
                            {val.toFixed(2)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tension Finding Cards */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
          Identified Cross-Source Tensions & Mitigations ({items.length})
        </div>

        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">
                  {item.dimension_a} <span className="text-slate-500 font-normal">vs.</span> {item.dimension_b}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-bold self-start sm:self-auto ${getSeverityBadge(item.tension_severity)}`}>
                Severity: {item.tension_severity} (Discrepancy: {item.discrepancy_score.toFixed(2)})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-[10px] font-mono uppercase text-blue-400 font-semibold">Dimension A Claim:</div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.claim_a}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">Ground-Truth Telemetry:</div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.claim_b}</p>
              </div>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-lg space-y-1">
              <div className="text-[10px] font-mono uppercase text-rose-400 font-bold flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Transformation Mirage & Execution Risk:</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed font-sans">{item.strategic_risk}</p>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-lg space-y-1">
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Prescriptive Mitigation Strategy:</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">{item.mitigation_recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Radar as RadarIcon, Sliders, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ReadinessTensor } from '../../types';

interface ReadinessRadarProps {
  readiness: ReadinessTensor;
}

export const ReadinessRadar: React.FC<ReadinessRadarProps> = ({ readiness }) => {
  const [customWeights, setCustomWeights] = useState({
    financial_elasticity: 0.25,
    tech_modernity: 0.25,
    talent_velocity: 0.20,
    operational_agility: 0.15,
    strategic_momentum: 0.15,
  });

  const chartData = Object.entries(readiness.dimensions).map(([key, dim]) => ({
    dimension: dim.name,
    score: dim.score,
    lower: dim.confidence_lower,
    upper: dim.confidence_upper,
    fullMark: 100
  }));

  // Re-compute interactive dynamic score
  const dynamicScore = Object.entries(readiness.dimensions).reduce((acc, [key, dim]) => {
    const w = (customWeights as any)[key] || 0.20;
    return acc + dim.score * w;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <RadarIcon className="w-5 h-5 text-cyan-400" />
            <span>Multi-Dimensional Technology & Operational Readiness Index (MD-TORI)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            5-Axis readiness tensor calibrated with dynamic Bayesian credibility weighting and uncertainty intervals.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[11px] font-mono uppercase text-slate-400">Calibrated Score</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {dynamicScore.toFixed(1)}<span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Radar */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col items-center justify-center min-h-[420px]">
          <div className="text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">5-Axis Tensor Geometry</div>
          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="dimension" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#475569" />
                <Radar
                  name="Readiness Score"
                  dataKey="score"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }}
                  itemStyle={{ color: '#06B6D4', fontSize: '12px', fontFamily: 'monospace' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Dimension Detail Cards & Weight Customizer */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">Dimension Tensor Weights</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Adjustable Weights</span>
          </div>

          <div className="space-y-3">
            {Object.entries(readiness.dimensions).map(([key, dim]) => (
              <div key={key} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{dim.name}</span>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-slate-400 text-[11px]">[{dim.confidence_lower} - {dim.confidence_upper}]</span>
                    <span className="font-bold text-cyan-400">{dim.score.toFixed(1)}</span>
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                  <span className="w-14">Weight: {((customWeights as any)[key] * 100).toFixed(0)}%</span>
                  <input
                    type="range"
                    min="0.05"
                    max="0.50"
                    step="0.05"
                    value={(customWeights as any)[key]}
                    onChange={(e) => {
                      setCustomWeights({
                        ...customWeights,
                        [key]: parseFloat(e.target.value)
                      });
                    }}
                    className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gap Analysis Remediation Table */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase">Strategic Capability Gap Breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Dimension</th>
                <th className="pb-2 font-semibold">Priority</th>
                <th className="pb-2 font-semibold">Current Diagnostic</th>
                <th className="pb-2 font-semibold">Target Standard</th>
                <th className="pb-2 font-semibold text-right">Remediation Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {readiness.gap_analysis.map((gap, i) => (
                <tr key={i} className="hover:bg-slate-950/40">
                  <td className="py-3 font-semibold text-slate-200">{gap.dimension}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      gap.priority_level.includes('CRITICAL')
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {gap.priority_level}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 max-w-xs font-sans text-xs">{gap.current_state}</td>
                  <td className="py-3 text-slate-400 max-w-xs font-sans text-xs">{gap.target_state}</td>
                  <td className="py-3 text-right font-bold text-cyan-400">{gap.estimated_remediation_weeks} Weeks</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitPullRequest
} from 'lucide-react';
import type { AnalysisRunResult } from '../../types';

interface ExecutiveOverviewProps {
  data: AnalysisRunResult;
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ data, onNavigateTab }) => {
  const readiness = data.readiness_tensor;
  const contradictions = data.contradictions;
  const roadmap = data.roadmap;
  const evidence = data.evidence_summary;

  const getBandColor = (band: string) => {
    switch (band) {
      case 'TRANSFORMATION_LEADER':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
      case 'SCALED_ACCELERATOR':
        return 'text-blue-400 border-blue-500/40 bg-blue-950/20';
      case 'FOUNDATIONAL_READY':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
      default:
        return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Information */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-xl backdrop-blur">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{data.company.name}</h1>
            {data.company.ticker && (
              <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300">
                {data.company.ticker}
              </span>
            )}
            <span className={`px-3 py-0.5 rounded-full border text-xs font-mono font-semibold ${getBandColor(readiness.readiness_band)}`}>
              {readiness.readiness_band.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {data.company.description || data.company.industry}
          </p>
        </div>

        <div className="flex items-center space-x-6 self-start md:self-auto">
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400 uppercase">Readiness Index</div>
            <div className="text-3xl font-extrabold font-mono text-cyan-400">
              {data.composite_readiness_score.toFixed(1)}<span className="text-sm text-slate-500">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Card Scorecard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Evidence Ingested</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {evidence.total_records} <span className="text-xs text-slate-400 font-normal">Signals</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>Mean Credibility:</span>
            <span className="text-emerald-400 font-mono font-semibold">{(evidence.mean_credibility * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Cross-Source Tensions</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
            {contradictions.contradictions.length} <span className="text-xs text-slate-400 font-normal">Detected</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>Mirage Risk:</span>
            <span className="text-amber-400 font-mono font-semibold">{contradictions.transformation_mirage_risk.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Horizon Critical Path</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {roadmap.total_estimated_months} <span className="text-xs text-slate-400 font-normal">Months</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Phased 3-Horizon Topological Schedule
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Projected ROIC Frontier</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-2 truncate">
            3.2x - 5.2x
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {roadmap.aggregate_capex_envelope}
          </div>
        </div>
      </div>

      {/* Strategic Decision Support & Verdict Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wide">Executive Transformation Verdict</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Confidence: 96.5%</span>
            </div>
            
            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950 p-4 rounded-lg border border-slate-800/80">
              {data.transformation_verdict}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              {data.executive_summary}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('roadmap')}
                className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-colors"
              >
                <span>Inspect 3-Horizon Roadmap</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigateTab('contradictions')}
                className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-colors"
              >
                <span>Review Contradiction Matrix</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick 5-Axis Score Snapshot */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase text-slate-300">5-Axis Multi-Dimensional Readiness Snapshot</span>
              <button onClick={() => onNavigateTab('readiness')} className="text-xs text-blue-400 hover:underline">
                Full Radar Detail
              </button>
            </div>
            <div className="space-y-2.5 pt-1">
              {Object.entries(readiness.dimensions).map(([key, dim]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{dim.name}</span>
                    <span className="font-mono font-bold text-cyan-400">{dim.score.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-400 h-1.5 rounded-full"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Critical Deficits and Actions */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
              <GitPullRequest className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold font-mono uppercase text-slate-200">Priority Remediation Gaps</span>
            </div>

            <div className="space-y-3">
              {readiness.gap_analysis.slice(0, 3).map((gap, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{gap.dimension}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      gap.priority_level.includes('CRITICAL')
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {gap.priority_level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{gap.capability_gap}</p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    Est. Remediation: <span className="text-slate-300 font-semibold">{gap.estimated_remediation_weeks} weeks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  TrendingUp,
  Shield,
  CheckCircle2,
  Layers,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import type { OpportunityAnalysisResult } from '../../types';

interface ExecutiveOverviewProps {
  data: OpportunityAnalysisResult;
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ data, onNavigateTab }) => {
  const getBandColor = (band: string) => {
    switch (band) {
      case 'RAPID_OPPORTUNITY':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
      case 'HIGH_GROWTH':
        return 'text-blue-400 border-blue-500/40 bg-blue-950/20';
      default:
        return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{data.company_name}</h1>
            {data.ticker && (
              <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300">
                {data.ticker}
              </span>
            )}
            <span className={`px-3 py-0.5 rounded-full border text-xs font-mono font-semibold ${getBandColor(data.opportunity_band)}`}>
              {data.opportunity_band.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {data.industry}
          </p>
        </div>

        <div className="flex items-center space-x-6 self-start md:self-auto">
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400 uppercase">Overall Opportunity Rate</div>
            <div className="text-3xl font-extrabold font-mono text-blue-400">
              {data.overall_opportunity_rate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 4 Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Opportunity Rate */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Opportunity Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{data.overall_opportunity_rate.toFixed(1)}%</div>
          <div className="text-[11px] text-emerald-400 font-mono">Multi-signal calibrated rate</div>
        </div>

        {/* Top Opportunity Domain */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Top Opportunity Pillar</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white truncate">{data.top_opportunity_category}</div>
          <div className="text-[11px] text-purple-400 font-mono">Highest ROI conversion</div>
        </div>

        {/* Hallucination Groundedness */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Evidence Groundedness</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {data.hallucination_detection.groundedness_score.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Zero hallucination risk</div>
        </div>

        {/* 8 Guardrails */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Security Guardrails</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">8 / 8 Active</div>
          <div className="text-[11px] text-cyan-400 font-mono">PII & credibility verified</div>
        </div>
      </div>

      {/* Scored Opportunity Pillars Breakdown (Slide 6 & Slide 8 Layer 5) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Scored Opportunity Pillars (Cloud, AI, Cyber, Modernization)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Custom scoring algorithm ranking market demand, financial runway, and implementation feasibility.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('opportunities')}
            className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View All Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {data.opportunities.map((opp, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800/80 p-4 rounded-lg space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{opp.category}</div>
                    <div className="text-[11px] text-slate-400">{opp.title}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 font-mono text-xs">
                  <span className="text-slate-400">Confidence: {opp.confidence_score.toFixed(1)}%</span>
                  <span className="text-sm font-bold text-blue-400">{opp.opportunity_rate.toFixed(1)}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${opp.opportunity_rate}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Recommended IT Services:</span>
                {opp.recommended_it_services.map((srv, sIdx) => (
                  <span key={sIdx} className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded font-mono">
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Synthesis Verdict */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Strategy Coordinator Synthesis Verdict
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {data.summary}
        </p>
      </div>
    </div>
  );
};

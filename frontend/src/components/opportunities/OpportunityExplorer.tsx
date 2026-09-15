import React, { useState } from 'react';
import {
  TrendingUp,
  Zap,
  CheckCircle2,
  FileText,
  Sliders,
  DollarSign,
  Layers
} from 'lucide-react';
import type { OpportunityScore } from '../../types';

interface OpportunityExplorerProps {
  opportunities: OpportunityScore[];
  companyName: string;
}

export const OpportunityExplorer: React.FC<OpportunityExplorerProps> = ({ opportunities, companyName }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(opportunities.map(o => o.category)))];

  const filtered = selectedCategory === 'ALL'
    ? opportunities
    : opportunities.filter(o => o.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Scored Business Opportunities & IT Service Mapping (Slide 6 & 8)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Custom scoring algorithm ranking opportunity rates (0-100%) across Cloud, AI, Cybersecurity, and Modernization with explainable reasoning traces.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold border transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((opp, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              {/* Pillar Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  {opp.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  opp.priority_level === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}>
                  {opp.priority_level} PRIORITY
                </span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-wide">{opp.title}</h3>

              {/* Opportunity Rate Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Opportunity Rate</span>
                  <span className="font-bold text-blue-400 text-sm">{opp.opportunity_rate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${opp.opportunity_rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Confidence: {opp.confidence_score.toFixed(1)}%</span>
                  <span>Signal Weight: High</span>
                </div>
              </div>

              {/* Value Unlock */}
              <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg flex items-start space-x-2 text-xs">
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Estimated Business Value:</span>
                  <span className="text-emerald-400 font-semibold">{opp.estimated_value_unlock}</span>
                </div>
              </div>

              {/* Recommended IT Services */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Recommended IT Services:</div>
                <div className="flex flex-wrap gap-1.5">
                  {opp.recommended_it_services.map((srv, sIdx) => (
                    <span key={sIdx} className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 px-2.5 py-1 rounded font-mono">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Explainable Reasoning Trace (Slide 6) */}
            <div className="border-t border-slate-800/80 pt-3 space-y-2">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Explainable Reasoning Trace:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                {opp.reasoning_trace}
              </p>

              {/* Top Evidence Citations */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Top Evidence Sources:</span>
                <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                  {opp.top_evidence_sources.map((ev, evIdx) => (
                    <li key={evIdx}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

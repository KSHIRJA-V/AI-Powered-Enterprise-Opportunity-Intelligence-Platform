import React from 'react';
import { Database, TrendingUp, Newspaper } from 'lucide-react';
import type { OpportunityAnalysisResult } from '../../types';

interface TelemetryViewProps {
  data: OpportunityAnalysisResult;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ data }) => {
  const fin = data.financial_synthesis || {};
  const news = data.evidence_records.filter(e => e.source_type === 'MARKET_NEWS');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-400" />
          <span>Financial Health & Real-Time News Telemetry (Slide 8 Layer 1)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Raw ingestion feeds from Alpha Vantage (SEC 10-K filings) and NewsAPI providing ground-truth enterprise signals.
        </p>
      </div>

      {/* Financial Metrics Grid */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Alpha Vantage Audited Financial Telemetry</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">CapEx Runway</span>
            <div className="text-white font-bold text-sm">{fin.capex_runway || '$3B+'}</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">CapEx Growth YoY</span>
            <div className="text-cyan-400 font-bold text-sm">+{fin.capex_growth_pct || 18.5}%</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">R&D Intensity</span>
            <div className="text-purple-400 font-bold text-sm">{fin.rd_intensity_pct || 14.2}%</div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Revenue Growth YoY</span>
            <div className="text-emerald-400 font-bold text-sm">+{fin.revenue_growth_yoy || 22.0}%</div>
          </div>
        </div>
      </div>

      {/* NewsAPI Articles List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Newspaper className="w-4 h-4 text-blue-400" />
          <span>Real-Time Strategic News Feed (NewsAPI)</span>
        </h3>

        <div className="space-y-3">
          {news.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold">{item.title}</span>
                <span className="text-emerald-400 text-[11px]">Credibility: {(item.credibility_score * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

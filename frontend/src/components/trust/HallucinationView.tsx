import React from 'react';
import { CheckCircle2, ShieldAlert, Award, FileSearch } from 'lucide-react';
import type { HallucinationMetrics, EvidenceItem } from '../../types';

interface HallucinationViewProps {
  metrics: HallucinationMetrics;
  evidence: EvidenceItem[];
}

export const HallucinationView: React.FC<HallucinationViewProps> = ({ metrics, evidence }) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Hallucination Detection & Evidence Grounding (Slide 6 & Slide 8 Layer 6)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Every AI-generated recommendation is cross-verified against retrieved empirical evidence with measurable groundedness metrics.
        </p>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">Groundedness Score</div>
          <div className="text-3xl font-bold font-mono text-emerald-400">{metrics.groundedness_score.toFixed(1)}%</div>
          <p className="text-xs text-slate-400 font-sans">
            Percentage of claims that directly match retrieved NewsAPI and SEC financial telemetry.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">Citation Coverage</div>
          <div className="text-3xl font-bold font-mono text-blue-400">{metrics.citation_coverage.toFixed(1)}%</div>
          <p className="text-xs text-slate-400 font-sans">
            Percentage of output recommendations citing explicit primary source documents.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">Evidence Match Rate</div>
          <div className="text-3xl font-bold font-mono text-purple-400">{metrics.evidence_match_rate.toFixed(1)}%</div>
          <p className="text-xs text-slate-400 font-sans">
            Rate of cross-verified numerical metrics (CapEx, revenue, operating margins).
          </p>
        </div>
      </div>

      {/* Verification Verdict Box */}
      <div className="bg-emerald-950/20 border border-emerald-800/40 p-5 rounded-xl flex items-center space-x-3 text-emerald-400 font-mono text-xs">
        <Award className="w-5 h-5 shrink-0" />
        <div>
          <span className="font-bold block uppercase">Audited Verification Verdict:</span>
          <span className="text-slate-300 font-sans">{metrics.verification_verdict}</span>
        </div>
      </div>

      {/* Retrieved Telemetry Chunks */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <FileSearch className="w-4 h-4 text-blue-400" />
          <span>Retrieved Evidence Chunks from Vector Database</span>
        </h3>

        <div className="space-y-3">
          {evidence.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-blue-400 font-bold">[{item.source_type}] {item.title}</span>
                <span className="text-slate-500">Credibility: {(item.credibility_score * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

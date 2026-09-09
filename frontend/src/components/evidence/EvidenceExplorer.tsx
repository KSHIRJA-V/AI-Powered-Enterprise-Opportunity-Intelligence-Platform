import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  ExternalLink,
  Code2
} from 'lucide-react';
import type { EvidenceItem, SourceType } from '../../types';

interface EvidenceExplorerProps {
  evidenceList: EvidenceItem[];
  companyName: string;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({ evidenceList, companyName }) => {
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [activeJsonItem, setActiveJsonItem] = useState<EvidenceItem | null>(null);

  const sources: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Sources' },
    { id: 'MARKET_NEWS', label: 'Market & News' },
    { id: 'FINANCIAL_HEALTH', label: 'Financial (SEC/Alpha Vantage)' },
    { id: 'ENGINEERING_GITHUB', label: 'GitHub Telemetry' },
    { id: 'TALENT_VELOCITY', label: 'Talent & Hiring' },
    { id: 'TECH_STACK', label: 'Tech Stack Profile' },
  ];

  const filtered = evidenceList.filter((item) => {
    if (selectedSource === 'ALL') return true;
    return item.source_type === selectedSource;
  });

  const getSourceBadge = (st: SourceType) => {
    switch (st) {
      case 'FINANCIAL_HEALTH':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'ENGINEERING_GITHUB':
        return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'TALENT_VELOCITY':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'TECH_STACK':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      default:
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Verifiable Multi-Source Evidence Repository</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every strategic recommendation is anchored to empirical telemetry across 5 heterogeneous sources with cryptographic provenance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSource(s.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold border transition-colors ${
                selectedSource === s.id
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => {
          const cred = (item.credibility_score * 100).toFixed(0);
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getSourceBadge(item.source_type)}`}>
                    {item.source_type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-mono font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Credibility: {cred}%</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white tracking-wide leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.content}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400">
                {item.source_url ? (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center space-x-1"
                  >
                    <span>View Raw Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span>Verified Internal Telemetry</span>
                )}

                {item.metadata && (
                  <button
                    onClick={() => setActiveJsonItem(item)}
                    className="text-slate-400 hover:text-white flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
                  >
                    <Code2 className="w-3 h-3 text-cyan-400" />
                    <span>Inspect Raw Payload</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw JSON Telemetry Modal */}
      {activeJsonItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Raw Ingested Telemetry Payload</span>
              </div>
              <button
                onClick={() => setActiveJsonItem(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-y-auto flex-1 font-mono text-xs text-slate-300">
              <pre>{JSON.stringify(activeJsonItem.metadata, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

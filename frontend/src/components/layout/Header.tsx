import React from 'react';
import { Shield, FileText, Activity, RefreshCw } from 'lucide-react';
import type { Company } from '../../types';
import { apiService } from '../../services/api';

interface HeaderProps {
  currentCompany: string;
  presetCompanies: Company[];
  onSelectCompany: (name: string, ticker?: string) => void;
  onRefreshAnalysis: () => void;
  isAnalyzing: boolean;
  readinessScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  presetCompanies,
  onSelectCompany,
  onRefreshAnalysis,
  isAnalyzing,
  readinessScore
}) => {
  const handleDownloadPdf = () => {
    window.open(apiService.getPdfReportUrl(currentCompany), '_blank');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            TM
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-slate-100 uppercase">TransforMind AI</div>
            <div className="text-xs text-slate-400 font-mono">Enterprise Transformation Intelligence</div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Enterprise Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline">Target Entity:</span>
          <select
            value={currentCompany}
            onChange={(e) => {
              const matched = presetCompanies.find(c => c.name === e.target.value);
              onSelectCompany(e.target.value, matched?.ticker);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            {presetCompanies.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} {c.ticker ? '(' + c.ticker + ')' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Readiness Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-md px-3 py-1">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-400 font-mono">Readiness Score:</span>
          <span className="text-xs font-bold text-cyan-400 font-mono">{readinessScore.toFixed(1)}/100</span>
        </div>

        {/* Guardrail Status */}
        <div className="hidden md:flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs px-2.5 py-1 rounded-md">
          <Shield className="w-3.5 h-3.5" />
          <span className="font-mono">Guardrails Active</span>
        </div>

        {/* Refresh / Re-Run Button */}
        <button
          onClick={onRefreshAnalysis}
          disabled={isAnalyzing}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            isAnalyzing
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-blue-400' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Re-Run Pipeline'}</span>
        </button>

        {/* Executive PDF Dossier Button */}
        <button
          onClick={handleDownloadPdf}
          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md shadow-blue-600/20 transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Export Dossier (PDF)</span>
        </button>
      </div>
    </header>
  );
};

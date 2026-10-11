import React, { useState } from 'react';
import { Shield, FileText, Activity, RefreshCw, Bell, Loader2 } from 'lucide-react';
import type { Company } from '../../types';
import { apiService } from '../../services/api';
import { SubscriptionModal } from '../SubscriptionModal';

interface HeaderProps {
  currentCompany: string;
  presetCompanies: Company[];
  onSelectCompany: (name: string, ticker?: string) => void;
  onRefreshAnalysis: () => void;
  isAnalyzing: boolean;
  opportunityRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  presetCompanies,
  onSelectCompany,
  onRefreshAnalysis,
  isAnalyzing,
  opportunityRate
}) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await apiService.downloadPdfReport(currentCompany);
    } catch (e) {
      console.error('Failed to download PDF:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              EO
            </div>
            <div>
              <div className="text-sm font-bold tracking-wider text-slate-100 uppercase">Enterprise Opportunity Intelligence</div>
              <div className="text-xs text-slate-400 font-mono">Strategic Decision Support Platform</div>
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
          {/* Overall Opportunity Rate Pill */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-md px-3 py-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-400 font-mono">Opportunity Rate:</span>
            <span className="text-xs font-bold text-blue-400 font-mono">{opportunityRate.toFixed(1)}%</span>
          </div>

          {/* Guardrail Status */}
          <div className="hidden md:flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs px-2.5 py-1 rounded-md">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-mono">8 Guardrails Active</span>
          </div>

          {/* Subscription Alerts Button (Slide 6 & 7) */}
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            title="Configure automated frequency-based email digests and alerts"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Alerts & Email</span>
          </button>

          {/* Re-Run Pipeline Button */}
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

          {/* Export PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-md shadow-blue-600/20 transition-all disabled:opacity-60"
            title="Download executive PDF strategy brief with embedded charts"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Export Report (PDF)</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Subscription Alerts Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentCompany={currentCompany}
      />
    </>
  );
};

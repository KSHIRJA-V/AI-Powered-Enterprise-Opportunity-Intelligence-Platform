import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, type ActiveTab } from './components/layout/Sidebar';
import { ExecutiveOverview } from './components/dashboard/ExecutiveOverview';
import { AgentPipelineVisualizer } from './components/dashboard/AgentPipelineVisualizer';
import { OpportunityExplorer } from './components/opportunities/OpportunityExplorer';
import { TelemetryView } from './components/telemetry/TelemetryView';
import { GuardrailsView } from './components/guardrails/GuardrailsView';
import { HallucinationView } from './components/trust/HallucinationView';
import type { Company, OpportunityAnalysisResult } from './types';
import { apiService } from './services/api';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currentCompany, setCurrentCompany] = useState<string>('NVIDIA Corporation');
  const [currentTicker, setCurrentTicker] = useState<string | undefined>('NVDA');
  const [presetCompanies, setPresetCompanies] = useState<Company[]>([]);
  const [analysisData, setAnalysisData] = useState<OpportunityAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Load presets on startup
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const presets = await apiService.getPresetCompanies();
        setPresetCompanies(presets);
      } catch (err) {
        console.error('Failed to load preset enterprises:', err);
      }
    };
    loadPresets();
  }, []);

  // Run analysis on company change
  const executeAnalysis = async (compName: string, ticker?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await apiService.runAnalysis(compName, ticker);
      setAnalysisData(res);
    } catch (err) {
      console.error('Analysis pipeline execution error:', err);
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeAnalysis(currentCompany, currentTicker);
  }, [currentCompany]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header
        currentCompany={currentCompany}
        presetCompanies={presetCompanies}
        onSelectCompany={(name, ticker) => {
          setCurrentCompany(name);
          setCurrentTicker(ticker);
        }}
        onRefreshAnalysis={() => executeAnalysis(currentCompany, currentTicker)}
        isAnalyzing={isAnalyzing}
        opportunityRate={analysisData ? analysisData.overall_opportunity_rate : 0}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          opportunityCount={analysisData ? analysisData.opportunities.length : 0}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <div className="text-sm font-mono text-slate-400">
                Executing 5-Agent Opportunity Intelligence Graph...
              </div>
            </div>
          ) : analysisData ? (
            <>
              {activeTab === 'overview' && (
                <ExecutiveOverview data={analysisData} onNavigateTab={setActiveTab} />
              )}
              {activeTab === 'pipeline' && (
                <AgentPipelineVisualizer companyName={currentCompany} />
              )}
              {activeTab === 'opportunities' && (
                <OpportunityExplorer opportunities={analysisData.opportunities} companyName={currentCompany} />
              )}
              {activeTab === 'telemetry' && (
                <TelemetryView data={analysisData} />
              )}
              {activeTab === 'guardrails' && (
                <GuardrailsView guardrails={analysisData.guardrail_checks} risks={analysisData.risks} />
              )}
              {activeTab === 'trust' && (
                <HallucinationView
                  metrics={analysisData.hallucination_detection}
                  evidence={analysisData.evidence_records}
                />
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-500">
              Failed to load enterprise data. Please check backend connection.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

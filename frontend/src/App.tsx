import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, type ActiveTab } from './components/layout/Sidebar';
import { ExecutiveOverview } from './components/dashboard/ExecutiveOverview';
import { AgentPipelineVisualizer } from './components/dashboard/AgentPipelineVisualizer';
import { ReadinessRadar } from './components/readiness/ReadinessRadar';
import { ContradictionMatrix } from './components/contradiction/ContradictionMatrix';
import { HorizonRoadmapView } from './components/roadmap/HorizonRoadmapView';
import { EvidenceExplorer } from './components/evidence/EvidenceExplorer';
import { BenchmarkComparison } from './components/evaluation/BenchmarkComparison';
import { PatentAndResearchView } from './components/docs/PatentAndResearchView';
import type { Company, AnalysisRunResult } from './types';
import { apiService } from './services/api';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currentCompany, setCurrentCompany] = useState<string>('NVIDIA Corporation');
  const [currentTicker, setCurrentTicker] = useState<string | undefined>('NVDA');
  const [presetCompanies, setPresetCompanies] = useState<Company[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisRunResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);

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

  // Run or fetch analysis on company change
  const executeAnalysis = async (compName: string, ticker?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await apiService.runAnalysis(compName, ticker);
      setAnalysisData(res);
      
      // Fetch evidence items
      const evRes = await apiService.getEvidence(compName);
      setEvidenceList(evRes.evidence || []);
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

  const handleSelectCompany = (name: string, ticker?: string) => {
    setCurrentCompany(name);
    setCurrentTicker(ticker);
  };

  const handleRefresh = () => {
    executeAnalysis(currentCompany, currentTicker);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        currentCompany={currentCompany}
        presetCompanies={presetCompanies}
        onSelectCompany={handleSelectCompany}
        onRefreshAnalysis={handleRefresh}
        isAnalyzing={isAnalyzing}
        readinessScore={analysisData?.composite_readiness_score || 78.5}
      />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          contradictionCount={analysisData?.contradictions?.contradictions?.length || 0}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {isLoading && !analysisData ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <div className="text-xs font-mono text-slate-400">Initializing Multi-Source Evidence Fusion Engine...</div>
            </div>
          ) : analysisData ? (
            <div>
              {activeTab === 'overview' && (
                <ExecutiveOverview data={analysisData} onNavigateTab={setActiveTab} />
              )}
              {activeTab === 'pipeline' && (
                <AgentPipelineVisualizer companyName={currentCompany} />
              )}
              {activeTab === 'readiness' && (
                <ReadinessRadar readiness={analysisData.readiness_tensor} />
              )}
              {activeTab === 'contradictions' && (
                <ContradictionMatrix contradictions={analysisData.contradictions} />
              )}
              {activeTab === 'roadmap' && (
                <HorizonRoadmapView roadmap={analysisData.roadmap} companyName={currentCompany} />
              )}
              {activeTab === 'evidence' && (
                <EvidenceExplorer evidenceList={evidenceList} companyName={currentCompany} />
              )}
              {activeTab === 'benchmark' && (
                <BenchmarkComparison companyName={currentCompany} />
              )}
              {activeTab === 'docs' && (
                <PatentAndResearchView />
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">
              Unable to load enterprise intelligence. Please check backend status at localhost:8000.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

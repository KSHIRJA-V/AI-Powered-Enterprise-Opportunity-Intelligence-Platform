import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  Clock,
  Terminal,
  Layers,
  ArrowDown
} from 'lucide-react';
import type { AgentStreamEvent } from '../../types';

interface AgentPipelineVisualizerProps {
  companyName: string;
}

const AGENTS = [
  { id: 'market_agent', name: 'Market Intelligence Agent', domain: 'NewsAPI, SEC Filings & Strategic Intent', icon: Layers },
  { id: 'financial_agent', name: 'Financial Health Agent', domain: 'Alpha Vantage, CapEx Runway & R&D Intensity', icon: Layers },
  { id: 'engineering_agent', name: 'Engineering & OSS Auditor', domain: 'GitHub REST API, Commit Cadence & Language Matrix', icon: Layers },
  { id: 'talent_agent', name: 'Talent & Workforce Agent', domain: 'Job Postings, AI/ML Talent Density & Skill Deficits', icon: Layers },
  { id: 'tech_stack_agent', name: 'Tech Stack & Architecture Auditor', domain: 'BuiltWith, Cloud-Native vs Legacy Footprint', icon: Layers },
  { id: 'fusion_agent', name: 'Evidence Fusion & Contradiction Agent', domain: 'Cross-Source Tension Matrix & Mirage Filter', icon: Layers },
  { id: 'readiness_agent', name: 'Readiness Tensor Agent', domain: '5-Axis MD-TORI Tensor Calculation', icon: Layers },
  { id: 'roadmap_agent', name: 'Transformation Roadmap Planner', domain: '3-Horizon DAG Topological Scheduling', icon: Layers },
  { id: 'guardrail_agent', name: 'Guardrail & Claim Lineage Agent', domain: 'PII Redaction, Credibility Gating & Lineage Graph', icon: Layers },
];

export const AgentPipelineVisualizer: React.FC<AgentPipelineVisualizerProps> = ({ companyName }) => {
  const [events, setEvents] = useState<AgentStreamEvent[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(9);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(false);

  const startLiveSimulation = () => {
    setEvents([]);
    setCurrentStep(1);
    setIsLiveStreaming(true);

    const eventSource = new EventSource('http://localhost:8000/api/analysis/stream/' + encodeURIComponent(companyName));

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev, data]);
        setCurrentStep(data.step);
        if (data.step >= 9 || data.status === 'FINISHED') {
          eventSource.close();
          setIsLiveStreaming(false);
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsLiveStreaming(false);
    };
  };

  useEffect(() => {
    // Populate completed state by default
    if (events.length === 0) {
      const defaultEvents: AgentStreamEvent[] = AGENTS.map((agent, i) => ({
        step: i + 1,
        total_steps: AGENTS.length,
        agent_name: agent.name,
        status: 'COMPLETED',
        message: 'Successfully executed ' + agent.name + ' across heterogeneous operational data vectors for ' + companyName + '.',
        progress_pct: 100,
        timestamp: new Date().toISOString()
      }));
      setEvents(defaultEvents);
    }
  }, [companyName]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>LangGraph Multi-Agent Orchestration Visualizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            9 specialized autonomous agents running synchronous cross-evidence ingestion, Bayesian fusion, and topological roadmap generation.
          </p>
        </div>

        <button
          onClick={startLiveSimulation}
          disabled={isLiveStreaming}
          className={`px-4 py-2 rounded-md text-xs font-semibold font-mono border transition-all ${
            isLiveStreaming
              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-600/20'
          }`}
        >
          {isLiveStreaming ? 'Streaming Agent Graph...' : 'Re-Execute Live Stream'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agent Flow Graph */}
        <div className="lg:col-span-7 space-y-3">
          {AGENTS.map((agent, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep >= stepNum;
            const isCurrent = currentStep === stepNum && isLiveStreaming;

            return (
              <React.Fragment key={agent.id}>
                <div
                  className={`p-3.5 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                      : isCompleted
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-slate-950/60 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                        isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white tracking-wide">{agent.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{agent.domain}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      isCurrent
                        ? 'bg-blue-950 text-blue-400 border-blue-800 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                        : 'bg-slate-950 text-slate-600 border-slate-900'
                    }`}
                  >
                    {isCurrent ? 'PROCESSING' : isCompleted ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>

                {idx < AGENTS.length - 1 && (
                  <div className="flex justify-center -my-1">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Live Terminal Stream Output */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col h-[580px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">Live Execution Log Stream</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">SSE Gateway: :8000</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-xs pr-1">
            {events.map((evt, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-blue-400 font-semibold">[{evt.agent_name}]</span>
                  <span className="text-[10px] text-slate-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {evt.timestamp.split('T')[1]?.split('.')[0] || '12:00:00'}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{evt.message}</p>
              </div>
            ))}
            {isLiveStreaming && (
              <div className="flex items-center space-x-2 text-blue-400 animate-pulse text-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Executing Agent Node #{currentStep}...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

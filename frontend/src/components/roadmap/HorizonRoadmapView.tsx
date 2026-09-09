import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sliders,
  ArrowRight
} from 'lucide-react';
import type { RoadmapDAG, ScenarioSimulationResult } from '../../types';
import { apiService } from '../../services/api';

interface HorizonRoadmapViewProps {
  roadmap: RoadmapDAG;
  companyName: string;
}

export const HorizonRoadmapView: React.FC<HorizonRoadmapViewProps> = ({ roadmap, companyName }) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'ALL' | 'H1' | 'H2' | 'H3'>('ALL');
  const [simulationParams, setSimulationParams] = useState({
    capex_budget_multiplier: 1.0,
    talent_acquisition_velocity: 1.0,
    legacy_tech_debt_reduction_priority: 1.0,
  });
  const [simResult, setSimResult] = useState<ScenarioSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await apiService.simulateScenario(simulationParams);
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const getHorizonLabel = (h: string) => {
    if (h.includes('H1')) return 'Horizon 1: Foundational (M1-6)';
    if (h.includes('H2')) return 'Horizon 2: Scaled Platform (M6-18)';
    return 'Horizon 3: Autonomous Disruption (M18-36)';
  };

  const getHorizonBadgeColor = (h: string) => {
    if (h.includes('H1')) return 'bg-cyan-950 text-cyan-400 border-cyan-800';
    if (h.includes('H2')) return 'bg-blue-950 text-blue-400 border-blue-800';
    return 'bg-purple-950 text-purple-400 border-purple-800';
  };

  const allMilestones = [
    ...roadmap.horizon_1_milestones,
    ...roadmap.horizon_2_milestones,
    ...roadmap.horizon_3_milestones,
  ];

  const filtered = allMilestones.filter((m) => {
    if (selectedHorizon === 'H1') return m.horizon.includes('H1');
    if (selectedHorizon === 'H2') return m.horizon.includes('H2');
    if (selectedHorizon === 'H3') return m.horizon.includes('H3');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <span>Dependency-Aware Transformation Sequencing & Roadmap Generator (DATS-RG)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Topological DAG scheduling across 3 horizons. Enforces prerequisite infrastructure gates before autonomous scaling.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(['ALL', 'H1', 'H2', 'H3'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold border transition-colors ${
                selectedHorizon === h
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {h === 'ALL' ? 'All Horizons' : h}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Path Indicator */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400 font-bold">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Topological Critical Path ({roadmap.total_estimated_months} Months Total Execution)</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
          {roadmap.critical_path.map((step, i) => (
            <React.Fragment key={i}>
              <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded text-slate-200 font-medium">
                {step}
              </span>
              {i < roadmap.critical_path.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getHorizonBadgeColor(m.horizon)}`}>
                  {getHorizonLabel(m.horizon)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Phase #{m.phase_order}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-wide">{m.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{m.objectives}</p>
            </div>

            <div className="space-y-3 border-t border-slate-800/80 pt-3 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Duration:</span>
                <span className="text-white font-semibold">{m.duration_months} Months</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CapEx Required:</span>
                <span className="text-cyan-400 font-semibold">{m.capex_level}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Projected ROI:</span>
                <span className="text-emerald-400 font-bold">{m.roi_multiplier}x ROIC</span>
              </div>

              {m.dependencies.length > 0 && (
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Prerequisite Gating Criteria:</div>
                  <div className="text-[11px] text-amber-400 font-sans">{m.dependencies.join(', ')}</div>
                </div>
              )}

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase text-slate-500 font-bold">Target Verification KPIs:</div>
                <ul className="list-disc list-inside text-[11px] text-slate-300 font-sans space-y-0.5">
                  {m.kpis.map((kpi, k) => (
                    <li key={k}>{kpi}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Scenario Simulator */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Transformation Scenario What-If Simulator</h3>
              <p className="text-xs text-slate-400">Simulate sensitivity of readiness score and timeline against CapEx, talent velocity, and tech debt priorities.</p>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold px-4 py-2 rounded-md transition-all shadow-md shadow-emerald-600/20"
          >
            {isSimulating ? 'Simulating...' : 'Run Scenario Simulation'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">CapEx Budget Multiplier</span>
              <span className="text-cyan-400 font-bold">{simulationParams.capex_budget_multiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={simulationParams.capex_budget_multiplier}
              onChange={(e) => setSimulationParams({ ...simulationParams, capex_budget_multiplier: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-[10px] text-slate-500">Adjust capital allocation envelope.</div>
          </div>

          <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Talent Acquisition Velocity</span>
              <span className="text-blue-400 font-bold">{simulationParams.talent_acquisition_velocity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={simulationParams.talent_acquisition_velocity}
              onChange={(e) => setSimulationParams({ ...simulationParams, talent_acquisition_velocity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="text-[10px] text-slate-500">Adjust hiring rate in cloud/AI talent.</div>
          </div>

          <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Tech Debt Remediation Focus</span>
              <span className="text-emerald-400 font-bold">{simulationParams.legacy_tech_debt_reduction_priority.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={simulationParams.legacy_tech_debt_reduction_priority}
              onChange={(e) => setSimulationParams({ ...simulationParams, legacy_tech_debt_reduction_priority: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="text-[10px] text-slate-500">Adjust Horizon 1 refactoring prioritization.</div>
          </div>
        </div>

        {simResult && (
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-slate-400">Simulated Readiness: </span>
                <span className="text-cyan-400 font-bold text-sm">{simResult.simulated_readiness_score.toFixed(1)}/100</span>
              </div>
              <div>
                <span className="text-slate-400">Time to Horizon 3: </span>
                <span className="text-white font-bold text-sm">{simResult.simulated_time_to_h3_months} Months</span>
              </div>
              <div>
                <span className="text-slate-400">Risk-Adjusted ROI: </span>
                <span className="text-emerald-400 font-bold text-sm">{simResult.risk_adjusted_roi.toFixed(2)}x</span>
              </div>
              <div>
                <span className="text-slate-400">Feasibility: </span>
                <span className="text-amber-400 font-bold text-sm">{simResult.feasibility_status}</span>
              </div>
            </div>

            <div className="space-y-1 text-slate-300 font-sans">
              {simResult.recommendations.map((rec, r) => (
                <div key={r} className="flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

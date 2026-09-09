import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3, CheckCircle2, Award, Zap } from 'lucide-react';
import type { FrameworkComparison } from '../../types';
import { apiService } from '../../services/api';

interface BenchmarkComparisonProps {
  companyName: string;
}

export const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({ companyName }) => {
  const [benchmark, setBenchmark] = useState<FrameworkComparison | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBenchmark = async () => {
      setLoading(true);
      try {
        const res = await apiService.getFrameworkBenchmark(companyName);
        setBenchmark(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBenchmark();
  }, [companyName]);

  if (!benchmark) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading Empirical Benchmark Suite...
      </div>
    );
  }

  const chartData = benchmark.metrics.map((m) => ({
    name: m.metric_name.replace('Multi-Source ', '').replace('Transformation ', ''),
    'Baseline LLM (News+Fin)': m.baseline_llm_score,
    'Standard RAG': m.standard_rag_score,
    'TransforMind MEFF (Ours)': m.transformind_fusion_score,
    improvement: m.improvement_pct,
    pValue: m.statistical_p_value
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Empirical Benchmark: Multi-Source Evidence Fusion vs. Baselines</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rigorous comparative evaluation measuring recommendation grounding, contradiction detection, and hallucination suppression.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[11px] font-mono uppercase text-slate-400">Framework Superiority</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {benchmark.overall_framework_superiority_index}x Superior
            </div>
          </div>
        </div>
      </div>

      {/* Novelty Callout Box */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-emerald-400 font-bold">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Research Contribution & Novelty Significance (p &lt; 0.001)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {benchmark.novelty_summary}
        </p>
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
          Quantitative Performance Comparison across 5 Evaluation Dimensions (% Score / 100)
        </div>

        <div className="w-full h-[380px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }}
                itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Baseline LLM (News+Fin)" fill="#64748B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Standard RAG" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TransforMind MEFF (Ours)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="text-xs font-mono uppercase text-slate-200 font-bold">
          Statistical Evaluation Matrix & p-Value Significance
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Evaluation Metric</th>
                <th className="pb-2 font-semibold text-center">Baseline LLM</th>
                <th className="pb-2 font-semibold text-center">Standard RAG</th>
                <th className="pb-2 font-semibold text-center text-emerald-400">TransforMind (MEFF)</th>
                <th className="pb-2 font-semibold text-right">Improvement</th>
                <th className="pb-2 font-semibold text-right">p-Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {benchmark.metrics.map((m, i) => (
                <tr key={i} className="hover:bg-slate-950/40">
                  <td className="py-3 font-semibold text-slate-200">
                    <div>{m.metric_name}</div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">{m.description}</div>
                  </td>
                  <td className="py-3 text-center text-slate-400">{m.baseline_llm_score.toFixed(1)}%</td>
                  <td className="py-3 text-center text-slate-300">{m.standard_rag_score.toFixed(1)}%</td>
                  <td className="py-3 text-center font-bold text-emerald-400">{m.transformind_fusion_score.toFixed(1)}%</td>
                  <td className="py-3 text-right font-bold text-cyan-400">+{m.improvement_pct.toFixed(1)}%</td>
                  <td className="py-3 text-right text-slate-400">p={m.statistical_p_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

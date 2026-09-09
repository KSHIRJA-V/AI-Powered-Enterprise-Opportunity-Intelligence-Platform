import React from 'react';
import { BookOpen, Shield, Cpu, Award, GitBranch, Layers } from 'lucide-react';

export const PatentAndResearchView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-cyan-400 font-bold">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Academic Methodology & Formal Patent Disclosure</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Multi-Source Enterprise Evidence Fusion Framework for Strategic Transformation Decision Support
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Official technical disclosure, mathematical formulations, and patent claims for TransforMind AI.
        </p>
      </div>

      {/* Novelty Comparison Summary */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider border-b border-slate-800 pb-2">
          1. Paradigm Shift: Descriptive vs. Prescriptive Decision Intelligence
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold font-mono text-slate-400 uppercase">Conventional Approach</div>
            <p className="text-slate-400 leading-relaxed font-sans">
              Fetches news and financial data, feeds to an LLM, and outputs descriptive summaries answering only: <i>"What is happening in this company?"</i>
            </p>
            <div className="text-[11px] text-rose-400/90 font-mono">
              Limitation: Prone to corporate PR bias, "Transformation Mirages", and ungrounded recommendations.
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-blue-900/40 space-y-2">
            <div className="font-bold font-mono text-cyan-400 uppercase">TransforMind MEFF (Patent Innovation)</div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Integrates 5 heterogeneous telemetry vectors, mathematically resolves cross-source contradictions, computes a 5-axis readiness tensor, and sequences actionable 3-Horizon roadmaps answering: <i>"Is the company ready, what evidence proves it, and what is the sequenced order of execution?"</i>
            </p>
            <div className="text-[11px] text-emerald-400 font-mono">
              Novelty: Verifiable Claim Lineage Graph, Bayesian Credibility Weighting, and Contradiction Penalty Factor.
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Formulations */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
          2. Mathematical Foundations & Algorithms
        </h2>

        <div className="space-y-4 text-slate-300 font-sans">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-cyan-400 font-bold">Equation 1: Composite Credibility Weighting C(s)</div>
            <div className="text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800">
              C(s) = w_r * R(domain) + w_f * e^(-lambda * Delta_t) + w_v * V(metrics) + w_c * C(corroboration)
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Where R(domain) represents the publisher tier, exponential decay models temporal freshness, and V(metrics) verifies numerical empirical citations.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-cyan-400 font-bold">Equation 2: Readiness-Adjusted Transformation Index (MD-TORI)</div>
            <div className="text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800">
              {"R_composite = Sum [ (Sum (w_i * c_i * s_i) / Sum (w_i * c_i)) * W_k * (1 - lambda * C_inconsistency) ]"}
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Where C_inconsistency penalizes transformation readiness when outward PR claims contradict ground-truth engineering debt or talent deficits.
            </p>
          </div>
        </div>
      </div>

      {/* Patent Claims Summary */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs font-mono">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
          3. Core Patent Claims
        </h2>

        <div className="space-y-3 text-slate-300 font-sans">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-1">
            <span className="font-bold font-mono text-blue-400 text-xs">Claim 1 (Independent):</span>
            <p className="text-xs leading-relaxed text-slate-300">
              A computer-implemented method for multi-source enterprise transformation decision support comprising ingesting heterogeneous telemetry vectors, applying dynamic Bayesian credibility scoring, computing cross-source inconsistency tensors, and generating a Directed Acyclic Graph (DAG) scheduled across 3 implementation horizons.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-1">
            <span className="font-bold font-mono text-blue-400 text-xs">Claim 2 (Dependent):</span>
            <p className="text-xs leading-relaxed text-slate-300">
              The method of claim 1, wherein detecting discrepancies between corporate strategic PR statements and GitHub code commit velocity suppresses ungrounded AI recommendations by a calculated contradiction penalty factor.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-1">
            <span className="font-bold font-mono text-blue-400 text-xs">Claim 3 (Dependent):</span>
            <p className="text-xs leading-relaxed text-slate-300">
              The method of claim 1, further comprising constructing a Verifiable Claim Lineage Graph linking each transformation milestone to verifiable cryptographic hashes of the raw telemetry payloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

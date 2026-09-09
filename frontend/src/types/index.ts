export type SourceType = 'MARKET_NEWS' | 'FINANCIAL_HEALTH' | 'ENGINEERING_GITHUB' | 'TALENT_VELOCITY' | 'TECH_STACK';
export type TensionSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type HorizonType = 'H1_FOUNDATIONAL' | 'H2_EXPANSION' | 'H3_AUTONOMOUS';
export type ReadinessBand = 'PRE_EMERGENT' | 'FOUNDATIONAL_READY' | 'SCALED_ACCELERATOR' | 'TRANSFORMATION_LEADER';

export interface Company {
  id?: number;
  name: string;
  ticker?: string;
  industry: string;
  description?: string;
  website?: string;
  github_org?: string;
  created_at?: string;
}

export interface CredibilityBreakdown {
  composite_score: number;
  reputation_score: number;
  freshness_score: number;
  specificity_score: number;
  corroboration_factor: number;
  tier: 'High' | 'Moderate' | 'Low';
}

export interface EvidenceItem {
  id?: number;
  source_type: SourceType;
  title: string;
  content: string;
  source_url?: string;
  credibility_score: number;
  confidence_interval?: number;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export interface ContradictionFinding {
  id?: number;
  dimension_a: string;
  claim_a: string;
  dimension_b: string;
  claim_b: string;
  tension_severity: TensionSeverity;
  discrepancy_score: number;
  explanation: string;
  strategic_risk: string;
  mitigation_recommendation: string;
}

export interface ContradictionMatrix {
  overall_inconsistency_index: number;
  transformation_mirage_risk: string;
  contradictions: ContradictionFinding[];
  tension_heatmap: Record<string, Record<string, number>>;
}

export interface ReadinessDimension {
  name: string;
  score: number;
  weight: number;
  confidence_lower: number;
  confidence_upper: number;
  key_strengths: string[];
  critical_deficits: string[];
}

export interface GapAnalysisItem {
  dimension: string;
  current_state: string;
  target_state: string;
  capability_gap: string;
  priority_level: string;
  estimated_remediation_weeks: number;
}

export interface ReadinessTensor {
  composite_readiness_score: number;
  readiness_band: ReadinessBand;
  dimensions: Record<string, ReadinessDimension>;
  gap_analysis: GapAnalysisItem[];
  uncertainty_margin: number;
}

export interface RoadmapMilestone {
  id?: number;
  title: string;
  horizon: HorizonType;
  duration_months: number;
  capex_level: string;
  roi_multiplier: number;
  dependencies: string[];
  objectives: string;
  kpis: string[];
  risk_factors?: string;
  phase_order: number;
}

export interface RoadmapDAG {
  horizon_1_milestones: RoadmapMilestone[];
  horizon_2_milestones: RoadmapMilestone[];
  horizon_3_milestones: RoadmapMilestone[];
  critical_path: string[];
  total_estimated_months: number;
  aggregate_capex_envelope: string;
  projected_roi_range: string;
}

export interface ClaimLineageNode {
  evidence_title: string;
  source_type: SourceType;
  credibility_score: number;
  source_url?: string;
}

export interface ClaimLineageItem {
  milestone_id: number;
  milestone_title: string;
  horizon: string;
  supporting_evidence_count: number;
  lineage_nodes: ClaimLineageNode[];
  provenance_hash: string;
}

export interface BenchmarkMetric {
  metric_name: string;
  baseline_llm_score: number;
  standard_rag_score: number;
  transformind_fusion_score: number;
  improvement_pct: number;
  statistical_p_value: number;
  description: string;
}

export interface FrameworkComparison {
  company_name: string;
  evaluated_at: string;
  metrics: BenchmarkMetric[];
  overall_framework_superiority_index: number;
  novelty_summary: string;
}

export interface AgentStreamEvent {
  step: number;
  total_steps: number;
  agent_name: string;
  status: 'PENDING' | 'COMPLETED' | 'FINISHED' | 'WARNING';
  message: string;
  progress_pct: number;
  timestamp: string;
}

export interface AnalysisRunResult {
  analysis_id: string;
  company: Company;
  status: string;
  composite_readiness_score: number;
  transformation_verdict: string;
  executive_summary: string;
  evidence_summary: {
    total_records: number;
    source_distribution: Record<string, number>;
    mean_credibility: number;
    verified_claim_coverage_pct: number;
  };
  readiness_tensor: ReadinessTensor;
  contradictions: ContradictionMatrix;
  roadmap: RoadmapDAG;
  started_at: string;
  completed_at?: string;
}

export interface ScenarioSimulationResult {
  simulated_readiness_score: number;
  simulated_time_to_h3_months: number;
  risk_adjusted_roi: number;
  feasibility_status: string;
  recommendations: string[];
}

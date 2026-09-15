export type SourceType = 'MARKET_NEWS' | 'FINANCIAL_HEALTH' | 'INDUSTRY_TREND' | 'COMPANY_FILING';

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

export interface EvidenceItem {
  id?: number;
  source_type: string;
  title: string;
  content: string;
  source_url?: string;
  credibility_score: number;
  confidence_interval?: number;
  metadata?: Record<string, any>;
  timestamp?: string;
}

// Scored Opportunities (Slide 6 & Slide 8 Layer 5)
export interface OpportunityScore {
  category: string; // Cloud, AI, Cybersecurity, Modernization, Data Infrastructure
  title: string;
  opportunity_rate: number; // 0-100%
  confidence_score: number; // 0-100%
  priority_level: string; // CRITICAL, HIGH, MODERATE
  estimated_value_unlock: string;
  recommended_it_services: string[];
  top_evidence_sources: string[];
  reasoning_trace: string;
}

export interface RiskItem {
  category: string;
  severity: string; // LOW, MEDIUM, HIGH
  description: string;
  mitigation_strategy: string;
}

// Hallucination Detection Metrics (Slide 6 & Slide 8 Layer 6)
export interface HallucinationMetrics {
  groundedness_score: number;
  citation_coverage: number;
  evidence_match_rate: number;
  hallucination_risk: string;
  verification_verdict: string;
}

// 8 Security Guardrails (Slide 8 Layer 2 & Slide 9)
export interface GuardrailCheck {
  id: number;
  name: string;
  status: string; // PASS
  detail: string;
}

// Strategy Recommendation & Service Mapping (Slide 8 Layer 7)
export interface StrategyRecommendation {
  pillar: string;
  opportunity_rate: string;
  recommended_services: string[];
  business_impact: string;
  implementation_window: string;
}

// Full Platform Analysis Result
export interface OpportunityAnalysisResult {
  company_name: string;
  ticker?: string;
  industry: string;
  summary: string;
  overall_opportunity_rate: number;
  opportunity_band: string;
  top_opportunity_category: string;
  news_synthesis: Record<string, any>;
  financial_synthesis: Record<string, any>;
  risks: RiskItem[];
  opportunities: OpportunityScore[];
  strategy_recommendations: StrategyRecommendation[];
  hallucination_detection: HallucinationMetrics;
  guardrail_checks: GuardrailCheck[];
  evidence_records: EvidenceItem[];
  created_at: string;
}

// Live Stream Event for the 5 Agents
export interface AgentStreamEvent {
  step: number;
  total_steps: number;
  agent_name: string;
  status: string;
  message: string;
  progress_pct: number;
  timestamp: string;
}

from datetime import datetime
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SourceTypeEnum(str, Enum):
    MARKET_NEWS = "MARKET_NEWS"
    FINANCIAL_HEALTH = "FINANCIAL_HEALTH"
    INDUSTRY_TREND = "INDUSTRY_TREND"
    COMPANY_FILING = "COMPANY_FILING"

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    ticker: Optional[str] = None
    industry: str
    description: Optional[str] = None
    website: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyOut(CompanyBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Evidence Schemas
class EvidenceItem(BaseModel):
    id: Optional[int] = None
    source_type: str = "MARKET_NEWS"
    title: str
    content: str
    source_url: Optional[str] = None
    credibility_score: float = Field(default=0.85, ge=0.0, le=1.0)
    confidence_interval: float = Field(default=0.90, ge=0.0, le=1.0)
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None

# Opportunity Scoring Schemas (Slide 6 & Slide 8 Layer 5)
class OpportunityScore(BaseModel):
    category: str  # e.g., "Enterprise AI & Automation", "Cloud Migration & Modernization"
    title: str
    opportunity_rate: float = Field(..., ge=0.0, le=100.0, description="Calculated opportunity rate in percentage (0-100%)")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Confidence percentage")
    priority_level: str = "HIGH"  # CRITICAL, HIGH, MODERATE
    estimated_value_unlock: str
    recommended_it_services: List[str]
    top_evidence_sources: List[str]
    reasoning_trace: str

class RiskItem(BaseModel):
    category: str
    severity: str  # LOW, MEDIUM, HIGH
    description: str
    mitigation_strategy: str

# Hallucination Detection Metrics (Slide 6 & Slide 8 Layer 6)
class HallucinationMetrics(BaseModel):
    groundedness_score: float = Field(..., ge=0.0, le=100.0, description="Percentage of claims verified against retrieved evidence")
    citation_coverage: float = Field(..., ge=0.0, le=100.0, description="Percentage of recommendations citing explicit evidence sources")
    evidence_match_rate: float = Field(..., ge=0.0, le=100.0, description="Rate of cross-verified telemetry citations")
    hallucination_risk: str = "LOW"
    verification_verdict: str = "VERIFIED: Grounded in retrieved telemetry with full citation coverage"

# 8 Security Guardrails (Slide 8 Layer 2 & Slide 9)
class GuardrailCheck(BaseModel):
    id: int
    name: str
    status: str = "PASS"
    detail: str

# Request & Full Analysis Output
class AnalysisRequest(BaseModel):
    company_name: str
    ticker: Optional[str] = None
    custom_context: Optional[str] = None

class OpportunityAnalysisResult(BaseModel):
    company_name: str
    ticker: Optional[str] = None
    industry: str
    summary: str
    overall_opportunity_rate: float = Field(..., ge=0.0, le=100.0, description="Overall Enterprise Opportunity Rate (%)")
    opportunity_band: str  # RAPID_OPPORTUNITY, HIGH_GROWTH, STABLE_EXPANSION
    top_opportunity_category: str
    news_synthesis: Dict[str, Any]
    financial_synthesis: Dict[str, Any]
    risks: List[RiskItem]
    opportunities: List[OpportunityScore]
    strategy_recommendations: List[Dict[str, Any]]
    hallucination_detection: HallucinationMetrics
    guardrail_checks: List[GuardrailCheck]
    evidence_records: List[EvidenceItem]
    created_at: str


# Scenario Simulation Schemas
class ScenarioSimulationRequest(BaseModel):
    capex_budget_multiplier: float = 1.0
    talent_acquisition_velocity: float = 1.0
    legacy_tech_debt_reduction_priority: float = 1.0

class ScenarioSimulationResponse(BaseModel):
    simulated_readiness_score: float
    simulated_time_to_h3_months: int
    risk_adjusted_roi: float
    feasibility_status: str
    recommendations: List[str]


# Benchmark & Comparison Schemas
class BenchmarkMetric(BaseModel):
    metric_name: str
    baseline_llm_score: float
    standard_rag_score: float
    platform_score: float
    p_value: float
    is_statistically_significant: bool

class FrameworkComparisonResponse(BaseModel):
    company_name: str
    metrics: List[BenchmarkMetric]
    overall_framework_superiority_index: float
    audit_timestamp: str

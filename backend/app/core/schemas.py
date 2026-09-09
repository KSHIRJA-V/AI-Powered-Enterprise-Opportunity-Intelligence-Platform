from datetime import datetime
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SourceTypeEnum(str, Enum):
    MARKET_NEWS = "MARKET_NEWS"
    FINANCIAL_HEALTH = "FINANCIAL_HEALTH"
    ENGINEERING_GITHUB = "ENGINEERING_GITHUB"
    TALENT_VELOCITY = "TALENT_VELOCITY"
    TECH_STACK = "TECH_STACK"

class TensionSeverityEnum(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class HorizonEnum(str, Enum):
    H1_FOUNDATIONAL = "H1_FOUNDATIONAL"
    H2_EXPANSION = "H2_EXPANSION"
    H3_AUTONOMOUS = "H3_AUTONOMOUS"

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    ticker: Optional[str] = None
    industry: str
    description: Optional[str] = None
    website: Optional[str] = None
    github_org: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyOut(CompanyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Evidence Schemas
class EvidenceItem(BaseModel):
    id: Optional[int] = None
    source_type: SourceTypeEnum
    title: str
    content: str
    source_url: Optional[str] = None
    credibility_score: float = Field(ge=0.0, le=1.0)
    confidence_interval: float = Field(default=0.90, ge=0.0, le=1.0)
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None

class EvidenceSummary(BaseModel):
    total_records: int
    source_distribution: Dict[str, int]
    mean_credibility: float
    verified_claim_coverage_pct: float

# Contradiction & Tension Schemas
class ContradictionFinding(BaseModel):
    id: Optional[int] = None
    dimension_a: str
    claim_a: str
    dimension_b: str
    claim_b: str
    tension_severity: TensionSeverityEnum
    discrepancy_score: float
    explanation: str
    strategic_risk: str
    mitigation_recommendation: str

class ContradictionMatrixResponse(BaseModel):
    overall_inconsistency_index: float
    transformation_mirage_risk: str
    contradictions: List[ContradictionFinding]
    tension_heatmap: Dict[str, Dict[str, float]]

# Readiness Schemas
class ReadinessDimension(BaseModel):
    name: str
    score: float = Field(ge=0.0, le=100.0)
    weight: float = Field(ge=0.0, le=1.0)
    confidence_lower: float
    confidence_upper: float
    key_strengths: List[str]
    critical_deficits: List[str]

class GapAnalysisItem(BaseModel):
    dimension: str
    current_state: str
    target_state: str
    capability_gap: str
    priority_level: str
    estimated_remediation_weeks: int

class ReadinessTensorResponse(BaseModel):
    composite_readiness_score: float
    readiness_band: str  # PRE_EMERGENT, FOUNDATIONAL_READY, SCALED_ACCELERATOR, TRANSFORMATION_LEADER
    dimensions: Dict[str, ReadinessDimension]
    gap_analysis: List[GapAnalysisItem]
    uncertainty_margin: float

# Roadmap Schemas
class RoadmapMilestoneSchema(BaseModel):
    id: Optional[int] = None
    title: str
    horizon: HorizonEnum
    duration_months: int
    capex_level: str
    roi_multiplier: float
    dependencies: List[str]
    objectives: str
    kpis: List[str]
    risk_factors: Optional[str] = None
    phase_order: int = 1

class RoadmapDAGResponse(BaseModel):
    horizon_1_milestones: List[RoadmapMilestoneSchema]
    horizon_2_milestones: List[RoadmapMilestoneSchema]
    horizon_3_milestones: List[RoadmapMilestoneSchema]
    critical_path: List[str]
    total_estimated_months: int
    aggregate_capex_envelope: str
    projected_roi_range: str

class ScenarioSimulationRequest(BaseModel):
    capex_budget_multiplier: float = Field(default=1.0, ge=0.3, le=3.0)
    talent_acquisition_velocity: float = Field(default=1.0, ge=0.5, le=2.5)
    legacy_tech_debt_reduction_priority: float = Field(default=1.0, ge=0.5, le=2.0)

class ScenarioSimulationResponse(BaseModel):
    simulated_readiness_score: float
    simulated_time_to_h3_months: int
    risk_adjusted_roi: float
    feasibility_status: str
    recommendations: List[str]

# Evaluation Schemas
class BenchmarkMetric(BaseModel):
    metric_name: str
    baseline_llm_score: float
    standard_rag_score: float
    transformind_fusion_score: float
    improvement_pct: float
    statistical_p_value: float
    description: str

class FrameworkComparisonResponse(BaseModel):
    company_name: str
    evaluated_at: datetime
    metrics: List[BenchmarkMetric]
    overall_framework_superiority_index: float
    novelty_summary: str

# Analysis Schemas
class AnalysisRunRequest(BaseModel):
    company_name: str
    ticker: Optional[str] = None
    custom_context: Optional[str] = None
    force_refresh: bool = False

class AgentStreamEvent(BaseModel):
    step: int
    agent_name: str
    status: str  # STARTED, PROCESSING, COMPLETED, WARNING
    message: str
    evidence_count: int = 0
    timestamp: str

class AnalysisRunResponse(BaseModel):
    analysis_id: str
    company: CompanyOut
    status: str
    composite_readiness_score: float
    transformation_verdict: str
    executive_summary: str
    evidence_summary: EvidenceSummary
    readiness_tensor: ReadinessTensorResponse
    contradictions: ContradictionMatrixResponse
    roadmap: RoadmapDAGResponse
    started_at: datetime
    completed_at: Optional[datetime] = None

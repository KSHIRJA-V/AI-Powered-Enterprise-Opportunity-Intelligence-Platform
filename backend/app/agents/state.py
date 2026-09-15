from typing import TypedDict, List, Dict, Any, Optional
from app.core.schemas import OpportunityScore, RiskItem, HallucinationMetrics, GuardrailCheck, EvidenceItem

class OpportunityIntelligenceState(TypedDict):
    company_name: str
    ticker: Optional[str]
    industry: str
    summary: str
    raw_news: List[Dict[str, Any]]
    financial_metrics: Dict[str, Any]
    risks: List[RiskItem]
    opportunities: List[OpportunityScore]
    overall_opportunity_rate: float
    opportunity_band: str
    top_opportunity_category: str
    strategy_recommendations: List[Dict[str, Any]]
    hallucination_metrics: Optional[HallucinationMetrics]
    guardrail_checks: List[GuardrailCheck]
    evidence_records: List[EvidenceItem]
    execution_logs: List[Dict[str, Any]]

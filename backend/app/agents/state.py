from typing import TypedDict, List, Dict, Any, Optional
from datetime import datetime

class EnterpriseState(TypedDict):
    # Input Parameters
    company_name: str
    ticker: Optional[str]
    industry: Optional[str]
    custom_context: Optional[str]
    analysis_id: str

    # Agent Raw Ingestions & Evidence Stream
    evidence_records: List[Dict[str, Any]]
    
    # Domain Intelligence Outputs
    market_signals: Dict[str, Any]
    financial_health: Dict[str, Any]
    engineering_telemetry: Dict[str, Any]
    talent_capabilities: Dict[str, Any]
    tech_stack_profile: Dict[str, Any]

    # Multi-Source Fusion & Tensions
    contradictions: Dict[str, Any]
    contradiction_index: float
    
    # 5-Axis Readiness Tensor
    readiness_tensor: Dict[str, Any]
    composite_readiness_score: float
    readiness_band: str

    # Sequenced Transformation Strategy
    transformation_verdict: str
    executive_summary: str
    roadmap: Dict[str, Any]

    # Guardrails & Provenance
    claim_lineage_graph: List[Dict[str, Any]]
    pii_redaction_count: int
    mean_credibility_score: float

    # Execution Metadata & Stream Logs
    execution_logs: List[Dict[str, Any]]
    current_step: int
    is_completed: bool
    error_message: Optional[str]

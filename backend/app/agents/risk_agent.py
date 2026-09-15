from typing import Dict, Any
from app.agents.state import OpportunityIntelligenceState
from app.services.opportunity_engine import opportunity_engine

async def run_risk_agent(state: OpportunityIntelligenceState) -> Dict[str, Any]:
    """Agent 3: Risk Agent - Identifies market, technical, and regulatory risks."""
    company_name = state["company_name"]
    fin_metrics = state.get("financial_metrics", {})

    risks = opportunity_engine.generate_risks(company_name, fin_metrics)

    log_entry = {
        "step": 3,
        "agent": "Risk Agent",
        "message": f"Identified {len(risks)} key strategic risk vectors (Legacy Tech Debt, Competitive Headwinds, Compliance)."
    }

    return {
        "risks": risks,
        "execution_logs": state.get("execution_logs", []) + [log_entry]
    }

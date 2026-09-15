from typing import Dict, Any
from app.agents.state import OpportunityIntelligenceState
from app.services.opportunity_engine import opportunity_engine

async def run_opportunity_agent(state: OpportunityIntelligenceState) -> Dict[str, Any]:
    """Agent 4: Opportunity Agent - Scores Cloud, AI, Cyber, Modernization opportunity rates."""
    company_name = state["company_name"]
    raw_news = state.get("raw_news", [])
    fin_metrics = state.get("financial_metrics", {})

    opp_data = opportunity_engine.calculate_opportunities(
        company_name=company_name,
        news_data={"articles": raw_news},
        financial_data=fin_metrics
    )

    log_entry = {
        "step": 4,
        "agent": "Opportunity Agent",
        "message": f"Calculated Overall Enterprise Opportunity Rate: {opp_data['overall_opportunity_rate']}% across 5 modernization pillars."
    }

    return {
        "opportunities": opp_data["opportunities"],
        "overall_opportunity_rate": opp_data["overall_opportunity_rate"],
        "opportunity_band": opp_data["opportunity_band"],
        "top_opportunity_category": opp_data["top_opportunity_category"],
        "execution_logs": state.get("execution_logs", []) + [log_entry]
    }

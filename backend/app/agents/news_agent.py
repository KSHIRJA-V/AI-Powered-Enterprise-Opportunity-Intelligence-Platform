from typing import Dict, Any
from app.agents.state import OpportunityIntelligenceState
from app.services.news_service import NewsService
from app.core.schemas import EvidenceItem

async def run_news_agent(state: OpportunityIntelligenceState) -> Dict[str, Any]:
    """Agent 1: News Agent - Fetches, filters, and synthesizes real-time news."""
    company_name = state["company_name"]
    ticker = state.get("ticker")

    news_items = await NewsService.fetch_news_evidence(company_name, ticker)
    
    evidence: list[EvidenceItem] = []
    for item in news_items:
        evidence.append(
            EvidenceItem(
                source_type="MARKET_NEWS",
                title=item.get("title", f"Strategic news update for {company_name}"),
                content=item.get("content", "Market strategic announcement"),
                source_url=item.get("source_url", "https://news.google.com"),
                credibility_score=item.get("credibility_score", 0.88),
                metadata=item.get("metadata", {})
            )
        )

    log_entry = {
        "step": 1,
        "agent": "News Agent",
        "message": f"Successfully ingested and filtered {len(news_items)} strategic news items for {company_name}."
    }

    return {
        "raw_news": news_items,
        "evidence_records": evidence,
        "execution_logs": state.get("execution_logs", []) + [log_entry]
    }

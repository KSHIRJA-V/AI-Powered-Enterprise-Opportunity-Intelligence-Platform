from langgraph.graph import StateGraph, START, END
from app.agents.state import OpportunityIntelligenceState
from app.agents.news_agent import run_news_agent
from app.agents.financial_agent import run_financial_agent
from app.agents.risk_agent import run_risk_agent
from app.agents.opportunity_agent import run_opportunity_agent
from app.agents.strategy_coordinator import run_strategy_coordinator

def create_opportunity_pipeline():
    """
    Assembles exactly the 5 specialized AI agents from Slide 8 Layer 4:
    1. News Agent
    2. Financial Agent
    3. Risk Agent
    4. Opportunity Agent
    5. Strategy Coordinator
    """
    builder = StateGraph(OpportunityIntelligenceState)

    builder.add_node("news_agent", run_news_agent)
    builder.add_node("financial_agent", run_financial_agent)
    builder.add_node("risk_agent", run_risk_agent)
    builder.add_node("opportunity_agent", run_opportunity_agent)
    builder.add_node("strategy_coordinator", run_strategy_coordinator)

    # Sequential deterministic flow matching Slide 8 Layer 4
    builder.add_edge(START, "news_agent")
    builder.add_edge("news_agent", "financial_agent")
    builder.add_edge("financial_agent", "risk_agent")
    builder.add_edge("risk_agent", "opportunity_agent")
    builder.add_edge("opportunity_agent", "strategy_coordinator")
    builder.add_edge("strategy_coordinator", END)

    return builder.compile()

opportunity_graph = create_opportunity_pipeline()

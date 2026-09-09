from typing import Dict, Any, AsyncGenerator
from langgraph.graph import StateGraph, END
from app.agents.state import EnterpriseState
from app.agents.market_agent import run_market_agent
from app.agents.financial_agent import run_financial_agent
from app.agents.engineering_agent import run_engineering_agent
from app.agents.talent_agent import run_talent_agent
from app.agents.tech_stack_agent import run_tech_stack_agent
from app.agents.fusion_agent import run_fusion_agent
from app.agents.readiness_agent import run_readiness_agent
from app.agents.roadmap_agent import run_roadmap_agent
from app.agents.guardrail_agent import run_guardrail_agent

def create_enterprise_graph():
    workflow = StateGraph(EnterpriseState)

    # Register agent nodes
    workflow.add_node('market_agent', run_market_agent)
    workflow.add_node('financial_agent', run_financial_agent)
    workflow.add_node('engineering_agent', run_engineering_agent)
    workflow.add_node('talent_agent', run_talent_agent)
    workflow.add_node('tech_stack_agent', run_tech_stack_agent)
    workflow.add_node('fusion_agent', run_fusion_agent)
    workflow.add_node('readiness_agent', run_readiness_agent)
    workflow.add_node('roadmap_agent', run_roadmap_agent)
    workflow.add_node('guardrail_agent', run_guardrail_agent)

    # Define orchestration flow
    workflow.set_entry_point('market_agent')
    workflow.add_edge('market_agent', 'financial_agent')
    workflow.add_edge('financial_agent', 'engineering_agent')
    workflow.add_edge('engineering_agent', 'talent_agent')
    workflow.add_edge('talent_agent', 'tech_stack_agent')
    workflow.add_edge('tech_stack_agent', 'fusion_agent')
    workflow.add_edge('fusion_agent', 'readiness_agent')
    workflow.add_edge('readiness_agent', 'roadmap_agent')
    workflow.add_edge('roadmap_agent', 'guardrail_agent')
    workflow.add_edge('guardrail_agent', END)

    return workflow.compile()

compiled_graph = create_enterprise_graph()

async def run_enterprise_pipeline(
    company_name: str,
    ticker: str = None,
    custom_context: str = None,
    analysis_id: str = None
) -> EnterpriseState:
    initial_state: EnterpriseState = {
        'company_name': company_name,
        'ticker': ticker,
        'industry': 'Enterprise Technology and Operations',
        'custom_context': custom_context,
        'analysis_id': analysis_id or 'run_001',
        'evidence_records': [],
        'market_signals': {},
        'financial_health': {},
        'engineering_telemetry': {},
        'talent_capabilities': {},
        'tech_stack_profile': {},
        'contradictions': {},
        'contradiction_index': 0.0,
        'readiness_tensor': {},
        'composite_readiness_score': 0.0,
        'readiness_band': 'PENDING',
        'transformation_verdict': '',
        'executive_summary': '',
        'roadmap': {},
        'claim_lineage_graph': [],
        'pii_redaction_count': 0,
        'mean_credibility_score': 0.0,
        'execution_logs': [],
        'current_step': 1,
        'is_completed': False,
        'error_message': None
    }

    final_state = await compiled_graph.ainvoke(initial_state)
    return final_state

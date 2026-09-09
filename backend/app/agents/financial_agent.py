from datetime import datetime
from typing import Dict, Any
from app.agents.state import EnterpriseState
from app.services.financial_service import FinancialService

async def run_financial_agent(state: EnterpriseState) -> Dict[str, Any]:
    company_name = state['company_name']
    ticker = state.get('ticker')
    
    fin_items = await FinancialService.fetch_financial_evidence(company_name, ticker)
    elasticity = fin_items[0]['metadata'].get('elasticity_score', 75.0) if fin_items else 75.0
    
    log_entry = {
        'step': state.get('current_step', 2),
        'agent_name': 'Financial Health Agent',
        'status': 'COMPLETED',
        'message': f'Audited SEC financial filings and CapEx runway. Financial Elasticity: {elasticity:.1f}/100.',
        'evidence_count': len(fin_items),
        'timestamp': datetime.utcnow().isoformat()
    }
    
    current_evidence = list(state.get('evidence_records', []))
    current_evidence.extend(fin_items)
    
    current_logs = list(state.get('execution_logs', []))
    current_logs.append(log_entry)

    return {
        'evidence_records': current_evidence,
        'financial_health': {
            'elasticity_score': elasticity,
            'status': 'HEALTHY_BUFFER' if elasticity >= 75.0 else 'CONSTRAINED_CAPEX'
        },
        'execution_logs': current_logs,
        'current_step': state.get('current_step', 2) + 1
    }

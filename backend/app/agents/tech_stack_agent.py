from datetime import datetime
from typing import Dict, Any
from app.agents.state import EnterpriseState
from app.services.tech_stack_service import TechStackService

async def run_tech_stack_agent(state: EnterpriseState) -> Dict[str, Any]:
    company_name = state['company_name']
    
    stack_items = await TechStackService.fetch_tech_stack_evidence(company_name)
    arch_score = stack_items[0]['metadata'].get('architecture_modernity_score', 75.0) if stack_items else 75.0
    
    log_entry = {
        'step': state.get('current_step', 5),
        'agent_name': 'Tech Stack and Architecture Auditor',
        'status': 'COMPLETED',
        'message': f'Profiled cloud ecosystem and legacy debt ratio. Architecture Modernity: {arch_score:.1f}/100.',
        'evidence_count': len(stack_items),
        'timestamp': datetime.utcnow().isoformat()
    }
    
    current_evidence = list(state.get('evidence_records', []))
    current_evidence.extend(stack_items)
    
    current_logs = list(state.get('execution_logs', []))
    current_logs.append(log_entry)

    return {
        'evidence_records': current_evidence,
        'tech_stack_profile': {
            'modernity_score': arch_score,
            'status': 'CLOUD_NATIVE' if arch_score >= 85.0 else 'HYBRID_MODERNIZING'
        },
        'execution_logs': current_logs,
        'current_step': state.get('current_step', 5) + 1
    }

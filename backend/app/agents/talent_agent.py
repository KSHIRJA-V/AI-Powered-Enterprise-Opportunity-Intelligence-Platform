from datetime import datetime
from typing import Dict, Any
from app.agents.state import EnterpriseState
from app.services.talent_service import TalentService

async def run_talent_agent(state: EnterpriseState) -> Dict[str, Any]:
    company_name = state['company_name']
    
    talent_items = await TalentService.fetch_talent_evidence(company_name)
    talent_score = talent_items[0]['metadata'].get('talent_velocity_score', 72.0) if talent_items else 72.0
    
    log_entry = {
        'step': state.get('current_step', 4),
        'agent_name': 'Talent and Workforce Agent',
        'status': 'COMPLETED',
        'message': f'Evaluated hiring pipeline and AI/Cloud skill density. Talent Score: {talent_score:.1f}/100.',
        'evidence_count': len(talent_items),
        'timestamp': datetime.utcnow().isoformat()
    }
    
    current_evidence = list(state.get('evidence_records', []))
    current_evidence.extend(talent_items)
    
    current_logs = list(state.get('execution_logs', []))
    current_logs.append(log_entry)

    return {
        'evidence_records': current_evidence,
        'talent_capabilities': {
            'talent_score': talent_score,
            'deficit_level': talent_items[0]['metadata'].get('talent_metrics', {}).get('talent_gap_severity', 'MODERATE') if talent_items else 'MODERATE'
        },
        'execution_logs': current_logs,
        'current_step': state.get('current_step', 4) + 1
    }

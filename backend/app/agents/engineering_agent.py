from datetime import datetime
from typing import Dict, Any
from app.agents.state import EnterpriseState
from app.services.github_service import GitHubService

async def run_engineering_agent(state: EnterpriseState) -> Dict[str, Any]:
    company_name = state['company_name']
    
    eng_items = await GitHubService.fetch_github_evidence(company_name)
    velocity = eng_items[0]['metadata'].get('engineering_velocity_score', 70.0) if eng_items else 70.0
    
    log_entry = {
        'step': state.get('current_step', 3),
        'agent_name': 'Engineering and OSS Auditor',
        'status': 'COMPLETED',
        'message': f'Analyzed GitHub repository telemetry and commit cadence. Velocity Index: {velocity:.1f}/100.',
        'evidence_count': len(eng_items),
        'timestamp': datetime.utcnow().isoformat()
    }
    
    current_evidence = list(state.get('evidence_records', []))
    current_evidence.extend(eng_items)
    
    current_logs = list(state.get('execution_logs', []))
    current_logs.append(log_entry)

    return {
        'evidence_records': current_evidence,
        'engineering_telemetry': {
            'velocity_score': velocity,
            'status': 'HIGH_VELOCITY' if velocity >= 80.0 else 'MODERATE_ENTERPRISE'
        },
        'execution_logs': current_logs,
        'current_step': state.get('current_step', 3) + 1
    }

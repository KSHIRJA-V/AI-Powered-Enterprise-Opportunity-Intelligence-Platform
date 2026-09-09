from datetime import datetime
from typing import Dict, Any
from app.agents.state import EnterpriseState
from app.services.fusion_engine import FusionEngine

async def run_readiness_agent(state: EnterpriseState) -> Dict[str, Any]:
    evidence_items = state.get('evidence_records', [])
    c_index = state.get('contradiction_index', 0.0)

    # Compute 5-Axis MD-TORI Tensor
    readiness_res = FusionEngine.fuse_evidence_and_calculate_readiness(
        evidence_records=evidence_items,
        contradiction_index=c_index
    )

    composite = readiness_res['composite_readiness_score']
    band = readiness_res['readiness_band']

    log_entry = {
        'step': state.get('current_step', 7),
        'agent_name': 'Readiness Tensor Agent',
        'status': 'COMPLETED',
        'message': f'Calculated 5-Axis MD-TORI Tensor with Bayesian credibility weights. Composite Score: {composite:.1f}/100 ({band}).',
        'evidence_count': len(evidence_items),
        'timestamp': datetime.utcnow().isoformat()
    }

    current_logs = list(state.get('execution_logs', []))
    current_logs.append(log_entry)

    return {
        'readiness_tensor': readiness_res,
        'composite_readiness_score': composite,
        'readiness_band': band,
        'execution_logs': current_logs,
        'current_step': state.get('current_step', 7) + 1
    }

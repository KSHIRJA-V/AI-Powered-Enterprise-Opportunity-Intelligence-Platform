from datetime import datetime
from typing import Dict, Any
from app.agents.state import EnterpriseState
from app.services.contradiction_engine import ContradictionEngine
from app.services.qdrant_rag import rag_service

async def run_fusion_agent(state: EnterpriseState) -> Dict[str, Any]:
    company_name = state['company_name']
    evidence_items = state.get('evidence_records', [])
    
    # Index evidence vectors into Qdrant RAG store
    await rag_service.index_evidence_batch(evidence_items)

    # Extract dimension scores for contradiction analysis
    fin_score = state.get('financial_health', {}).get('elasticity_score', 75.0)
    eng_score = state.get('engineering_telemetry', {}).get('velocity_score', 70.0)
    talent_score = state.get('talent_capabilities', {}).get('talent_score', 72.0)
    arch_score = state.get('tech_stack_profile', {}).get('modernity_score', 75.0)
    intent_score = state.get('market_signals', {}).get('intent_intensity', 82.0)

    dim_scores = {
        'financial_elasticity': fin_score,
        'engineering_velocity': eng_score,
        'talent_velocity': talent_score,
        'tech_modernity': arch_score,
        'strategic_momentum': intent_score,
        'operational_agility': round(0.5 * talent_score + 0.5 * arch_score, 1)
    }

    # Run Cross-Source Inconsistency and Contradiction Resolution
    contradiction_res = ContradictionEngine.analyze_contradictions(
        company_name=company_name,
        evidence_items=evidence_items,
        dimension_scores=dim_scores
    )

    c_count = len(contradiction_res.get('contradictions', []))
    c_index = contradiction_res.get('overall_inconsistency_index', 0.0)
    mirage = contradiction_res.get('transformation_mirage_risk', 'LOW')

    log_entry = {
        'step': state.get('current_step', 6),
        'agent_name': 'Evidence Fusion and Contradiction Agent',
        'status': 'COMPLETED',
        'message': f'Synthesized 5 evidence streams into fusion matrix. Identified {c_count} cross-evidence tensions. Mirage Risk: {mirage}.',
        'evidence_count': len(evidence_items),
        'timestamp': datetime.utcnow().isoformat()
    }

    current_logs = list(state.get('execution_logs', []))
    current_logs.append(log_entry)

    return {
        'contradictions': contradiction_res,
        'contradiction_index': c_index,
        'execution_logs': current_logs,
        'current_step': state.get('current_step', 6) + 1
    }

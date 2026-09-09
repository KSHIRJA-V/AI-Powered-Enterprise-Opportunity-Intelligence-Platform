from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.api.routes_analysis import LATEST_ANALYSIS_STORE

router = APIRouter(prefix="/evidence", tags=["Evidence Explorer"])

@router.get("/{company_name}")
async def get_evidence_explorer(
    company_name: str,
    source_type: Optional[str] = Query(None, description="Filter by source type")
):
    key = company_name.lower()
    state = LATEST_ANALYSIS_STORE.get(key)
    if not state:
        # Check if first matching
        for k, v in LATEST_ANALYSIS_STORE.items():
            if company_name.lower() in k:
                state = v
                break
    
    if not state:
        from app.agents.graph import run_enterprise_pipeline
        state = await run_enterprise_pipeline(company_name=company_name)
        LATEST_ANALYSIS_STORE[key] = state

    records = state.get("evidence_records", [])
    if source_type:
        records = [r for r in records if r.get("source_type") == source_type]

    return {
        "company_name": company_name,
        "total_evidence_count": len(records),
        "mean_credibility": state.get("mean_credibility_score", 0.88),
        "claim_lineage_graph": state.get("claim_lineage_graph", []),
        "evidence": records
    }

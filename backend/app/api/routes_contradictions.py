from fastapi import APIRouter
from app.api.routes_analysis import LATEST_ANALYSIS_STORE

router = APIRouter(prefix="/contradictions", tags=["Contradictions & Tension Matrix"])

@router.get("/{company_name}")
async def get_company_contradictions(company_name: str):
    key = company_name.lower()
    state = LATEST_ANALYSIS_STORE.get(key)
    if not state:
        from app.agents.graph import run_enterprise_pipeline
        state = await run_enterprise_pipeline(company_name=company_name)
        LATEST_ANALYSIS_STORE[key] = state

    return state.get("contradictions", {})

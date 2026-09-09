from fastapi import APIRouter
from app.api.routes_analysis import LATEST_ANALYSIS_STORE
from app.core.schemas import FrameworkComparisonResponse
from app.services.evaluation_engine import EvaluationEngine

router = APIRouter(prefix="/evaluations", tags=["Evaluation Benchmark"])

@router.get("/benchmark/{company_name}", response_model=FrameworkComparisonResponse)
async def get_framework_benchmark(company_name: str):
    key = company_name.lower()
    state = LATEST_ANALYSIS_STORE.get(key)
    if not state:
        from app.agents.graph import run_enterprise_pipeline
        state = await run_enterprise_pipeline(company_name=company_name)
        LATEST_ANALYSIS_STORE[key] = state

    res = EvaluationEngine.run_benchmark(company_name=company_name, analysis_data=state)
    return FrameworkComparisonResponse(**res)

from fastapi import APIRouter, HTTPException
from app.api.routes_analysis import LATEST_ANALYSIS_STORE
from app.core.schemas import ScenarioSimulationRequest, ScenarioSimulationResponse

router = APIRouter(prefix="/roadmap", tags=["Roadmap & Simulation"])

@router.get("/{company_name}")
async def get_company_roadmap(company_name: str):
    key = company_name.lower()
    state = LATEST_ANALYSIS_STORE.get(key)
    if not state:
        from app.agents.graph import run_enterprise_pipeline
        state = await run_enterprise_pipeline(company_name=company_name)
        LATEST_ANALYSIS_STORE[key] = state

    return {
        "company_name": company_name,
        "readiness_band": state.get("readiness_band"),
        "composite_readiness_score": state.get("composite_readiness_score"),
        "roadmap": state.get("roadmap", {}),
        "claim_lineage_graph": state.get("claim_lineage_graph", [])
    }

@router.post("/simulate", response_model=ScenarioSimulationResponse)
async def simulate_transformation_scenario(req: ScenarioSimulationRequest):
    # What-If Monte Carlo/Heuristic Simulator
    base_readiness = 75.0
    # Adjust score based on multipliers
    adjusted_score = base_readiness * (0.4 * req.capex_budget_multiplier + 0.35 * req.talent_acquisition_velocity + 0.25 * req.legacy_tech_debt_reduction_priority)
    adjusted_score = round(min(98.0, max(30.0, adjusted_score)), 1)
    
    # Adjust timeline
    base_months = 26
    speedup = (req.capex_budget_multiplier * 0.4 + req.talent_acquisition_velocity * 0.4 + req.legacy_tech_debt_reduction_priority * 0.2)
    simulated_months = max(12, int(base_months / speedup))
    
    risk_adj_roi = round(3.5 * req.talent_acquisition_velocity * (req.legacy_tech_debt_reduction_priority ** 0.5), 2)
    
    status = "ACCELERATED_FEASIBLE" if adjusted_score >= 80.0 else "BALANCED_EXECUTION" if adjusted_score >= 65.0 else "HIGH_EXECUTION_FRICTION"
    
    recs = []
    if req.legacy_tech_debt_reduction_priority > 1.2:
        recs.append("High tech debt reduction focus accelerates Horizon 2 by 4 months.")
    if req.talent_acquisition_velocity < 0.9:
        recs.append("Talent bottleneck risks extending Horizon 1 duration.")
    if req.capex_budget_multiplier >= 1.5:
        recs.append("Aggressive CapEx enables parallel execution of H1 and H2 streams.")
    if not recs:
        recs.append("Balanced allocation maintains standard 3-Horizon dependency flow.")

    return ScenarioSimulationResponse(
        simulated_readiness_score=adjusted_score,
        simulated_time_to_h3_months=simulated_months,
        risk_adjusted_roi=risk_adj_roi,
        feasibility_status=status,
        recommendations=recs
    )

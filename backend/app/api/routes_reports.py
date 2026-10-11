from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.services.report_generator import ReportGenerator
from app.agents.graph import opportunity_graph
from app.agents.state import OpportunityIntelligenceState
from app.api.routes_analysis import LATEST_ANALYSIS_STORE

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

# In-memory cached runs for instant PDF download
ANALYSIS_CACHE = {}

@router.get("/pdf/{company_name}")
async def download_opportunity_pdf(company_name: str):
    key = company_name.lower().strip()
    
    # 1. Check active analysis store from user session first
    state = LATEST_ANALYSIS_STORE.get(key) or ANALYSIS_CACHE.get(key)
    
    # 2. Check partial name matches (e.g. "nvidia" matching "nvidia corporation")
    if not state:
        for stored_key, stored_state in list(LATEST_ANALYSIS_STORE.items()) + list(ANALYSIS_CACHE.items()):
            if key in stored_key or stored_key in key:
                state = stored_state
                break
    
    # 3. If still not found, execute the multi-agent pipeline
    if not state:
        initial_state: OpportunityIntelligenceState = {
            "company_name": company_name,
            "ticker": None,
            "industry": "Enterprise Technology & Cloud Modernization",
            "summary": "",
            "raw_news": [],
            "financial_metrics": {},
            "risks": [],
            "opportunities": [],
            "overall_opportunity_rate": 0.0,
            "opportunity_band": "HIGH_GROWTH",
            "top_opportunity_category": "Enterprise AI & Automation",
            "strategy_recommendations": [],
            "hallucination_metrics": None,
            "guardrail_checks": [],
            "evidence_records": [],
            "execution_logs": []
        }
        try:
            state = await opportunity_graph.ainvoke(initial_state)
            ANALYSIS_CACHE[key] = state
            LATEST_ANALYSIS_STORE[key] = state
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate report data: {str(e)}")

    pdf_buffer = ReportGenerator.generate_pdf_report(state)
    safe_name = company_name.replace(" ", "_").replace("/", "_").replace(",", "")
    filename = f"Enterprise_Opportunity_Intelligence_Report_{safe_name}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

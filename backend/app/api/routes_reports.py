from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.services.report_generator import ReportGenerator
from app.agents.graph import opportunity_graph
from app.agents.state import OpportunityIntelligenceState

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

# In-memory cached runs for instant PDF download
ANALYSIS_CACHE = {}

@router.get("/pdf/{company_name}")
async def download_opportunity_pdf(company_name: str):
    key = company_name.lower().strip()
    state = ANALYSIS_CACHE.get(key)
    
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
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate report data: {str(e)}")

    pdf_buffer = ReportGenerator.generate_pdf_report(state)
    filename = f"Enterprise_Opportunity_Intelligence_Report_{company_name.replace(' ', '_')}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

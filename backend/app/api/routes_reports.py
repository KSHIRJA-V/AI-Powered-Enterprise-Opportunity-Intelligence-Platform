from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.api.routes_analysis import LATEST_ANALYSIS_STORE
from app.services.report_generator import ReportGenerator

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

@router.get("/pdf/{company_name}")
async def download_executive_pdf(company_name: str):
    key = company_name.lower()
    state = LATEST_ANALYSIS_STORE.get(key)
    if not state:
        from app.agents.graph import run_enterprise_pipeline
        state = await run_enterprise_pipeline(company_name=company_name)
        LATEST_ANALYSIS_STORE[key] = state

    pdf_buffer = ReportGenerator.generate_pdf_report(state)
    filename = f"TransforMind_Executive_Dossier_{company_name.replace(' ', '_')}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

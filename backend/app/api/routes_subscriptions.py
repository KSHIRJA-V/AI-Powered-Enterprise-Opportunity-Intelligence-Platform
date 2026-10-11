from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.services.email_service import EmailService
from app.services.report_generator import ReportGenerator
from app.api.routes_analysis import LATEST_ANALYSIS_STORE, run_enterprise_pipeline

router = APIRouter(prefix="/subscriptions", tags=["Subscription Alerts & Email"])

class SubscribeRequest(BaseModel):
    email: str = Field(..., description="Recipient email address")
    company_name: str
    frequency: str = "WEEKLY"  # DAILY, WEEKLY, MONTHLY
    opportunity_threshold: float = 75.0

class EmailReportRequest(BaseModel):
    email: str = Field(..., description="Recipient email address")
    company_name: str
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None

class SendDigestRequest(BaseModel):
    email: str = Field(..., description="Recipient email address")
    company_name: str
    frequency: str = "WEEKLY"
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None

# In-memory storage for active subscriptions (Slide 6)
SUBSCRIPTION_REGISTRY: List[Dict[str, Any]] = [
    {
        "id": "sub-1",
        "email": "executive@enterprise.com",
        "company_name": "NVIDIA Corporation",
        "frequency": "WEEKLY",
        "opportunity_threshold": 80.0,
        "created_at": "2026-09-10T10:00:00Z",
        "active": True
    }
]

@router.post("/subscribe")
async def subscribe_to_alerts(req: SubscribeRequest):
    """
    Subscribes stakeholder to automated frequency-based email digests (Slide 6).
    """
    sub_entry = {
        "id": f"sub-{len(SUBSCRIPTION_REGISTRY) + 1}",
        "email": req.email,
        "company_name": req.company_name,
        "frequency": req.frequency.upper(),
        "opportunity_threshold": req.opportunity_threshold,
        "created_at": datetime.utcnow().isoformat(),
        "active": True
    }
    SUBSCRIPTION_REGISTRY.append(sub_entry)
    
    return {
        "status": "SUBSCRIBED",
        "subscription": sub_entry,
        "message": f"Subscribed {req.email} to {req.frequency} intelligence alerts for {req.company_name}."
    }

@router.get("/list")
async def list_subscriptions():
    """Lists active enterprise subscription alerts."""
    return {
        "total_active": len(SUBSCRIPTION_REGISTRY),
        "subscriptions": SUBSCRIPTION_REGISTRY
    }

@router.post("/send-digest")
async def send_digest(req: SendDigestRequest):
    """
    Triggers an immediate or scheduled frequency-based digest to an email address.
    """
    key = req.company_name.lower().strip()
    analysis_data = LATEST_ANALYSIS_STORE.get(key)
    
    if not analysis_data:
        analysis_data = await run_enterprise_pipeline(req.company_name)

    result = EmailService.send_intelligence_digest(
        to_email=req.email,
        company_name=req.company_name,
        analysis_data=analysis_data,
        frequency=req.frequency.upper(),
        smtp_username=req.smtp_username,
        smtp_password=req.smtp_password
    )
    return result

@router.post("/email-report")
async def email_pdf_report(req: EmailReportRequest):
    """
    Generates and emails the PDF report as an attachment (Slide 6 & 7).
    """
    key = req.company_name.lower().strip()
    analysis_data = LATEST_ANALYSIS_STORE.get(key)
    
    if not analysis_data:
        analysis_data = await run_enterprise_pipeline(req.company_name)

    pdf_buffer = ReportGenerator.generate_pdf_report(analysis_data)
    pdf_bytes = pdf_buffer.getvalue()

    result = EmailService.send_pdf_report_email(
        to_email=req.email,
        company_name=req.company_name,
        pdf_bytes=pdf_bytes,
        smtp_username=req.smtp_username,
        smtp_password=req.smtp_password
    )
    return result

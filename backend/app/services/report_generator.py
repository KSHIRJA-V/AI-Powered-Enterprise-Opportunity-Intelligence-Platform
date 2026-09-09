import io
from datetime import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable

class ReportGenerator:
    """
    Executive Transformation Intelligence Dossier Generator.
    Produces high-resolution, audit-grade PDF reports without emojis.
    """

    @classmethod
    def generate_pdf_report(cls, analysis_data: Dict[str, Any]) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()
        
        # Custom Executive Typography
        title_style = ParagraphStyle(
            'ExecutiveTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=6
        )
        subtitle_style = ParagraphStyle(
            'ExecutiveSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=15,
            textColor=colors.HexColor('#475569'),
            spaceAfter=14
        )
        h1_style = ParagraphStyle(
            'ExecutiveH1',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#1E293B'),
            spaceBefore=14,
            spaceAfter=8
        )
        body_style = ParagraphStyle(
            'ExecutiveBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor('#334155'),
            spaceAfter=8
        )
        callout_style = ParagraphStyle(
            'ExecutiveCallout',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor('#1E3A8A'),
            spaceAfter=6
        )

        elements = []

        company_name = analysis_data.get("company_name", "Enterprise")
        readiness = analysis_data.get("readiness_tensor", {})
        composite_score = readiness.get("composite_readiness_score", 78.5)
        band = readiness.get("readiness_band", "SCALED_ACCELERATOR")
        contradictions = analysis_data.get("contradictions", {}).get("contradictions", [])
        roadmap = analysis_data.get("roadmap", {})

        # Header
        elements.append(Paragraph(f"TRANSFORMIND AI // EXECUTIVE INTELLIGENCE DOSSIER", subtitle_style))
        elements.append(Paragraph(f"Strategic Transformation & Readiness Report: {company_name}", title_style))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=14))

        # Executive Metadata Box
        meta_table_data = [
            [
                Paragraph("<b>Audit Date:</b> " + datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"), body_style),
                Paragraph(f"<b>Readiness Score:</b> {composite_score}/100", body_style),
                Paragraph(f"<b>Classification:</b> {band}", body_style)
            ]
        ]
        meta_table = Table(meta_table_data, colWidths=[200, 150, 180])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 14))

        # Executive Summary
        elements.append(Paragraph("1. Executive Transformation Verdict", h1_style))
        summary_text = analysis_data.get("executive_summary", "Comprehensive multi-source evaluation executed across 5 heterogeneous operational telemetry streams.")
        elements.append(Paragraph(summary_text, body_style))
        elements.append(Spacer(1, 10))

        # 5-Axis Multi-Dimensional Readiness Table
        elements.append(Paragraph("2. Multi-Dimensional Technology & Operational Readiness Index (MD-TORI)", h1_style))
        dim_table_data = [
            [
                Paragraph("<b>Readiness Dimension</b>", body_style),
                Paragraph("<b>Score / 100</b>", body_style),
                Paragraph("<b>Confidence Interval</b>", body_style),
                Paragraph("<b>Weight</b>", body_style),
                Paragraph("<b>Key Findings & Deficits</b>", body_style)
            ]
        ]
        
        dimensions = readiness.get("dimensions", {})
        for dim_k, dim_v in dimensions.items():
            deficits_preview = ", ".join(dim_v.get("critical_deficits", [])) or "Operational alignment satisfactory"
            dim_table_data.append([
                Paragraph(dim_v.get("name", dim_k), body_style),
                Paragraph(f"<b>{dim_v.get('score', 0):.1f}</b>", body_style),
                Paragraph(f"[{dim_v.get('confidence_lower', 0):.1f} - {dim_v.get('confidence_upper', 0):.1f}]", body_style),
                Paragraph(f"{dim_v.get('weight', 0):.2f}", body_style),
                Paragraph(deficits_preview[:80] + ("..." if len(deficits_preview) > 80 else ""), body_style)
            ])

        dim_table = Table(dim_table_data, colWidths=[130, 65, 85, 45, 205])
        dim_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EDF2F7')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(dim_table)
        elements.append(Spacer(1, 14))

        # Cross-Source Contradiction Resolution
        elements.append(Paragraph("3. Cross-Source Inconsistency & Transformation Mirage Analysis", h1_style))
        if contradictions:
            for idx, c in enumerate(contradictions[:3], 1):
                c_data = [
                    [Paragraph(f"<b>Tension #{idx}: {c.get('dimension_a')} vs. {c.get('dimension_b')}</b> (Severity: {c.get('tension_severity')})", callout_style)],
                    [Paragraph(f"<b>Claim A:</b> {c.get('claim_a')}", body_style)],
                    [Paragraph(f"<b>Ground-Truth Telemetry:</b> {c.get('claim_b')}", body_style)],
                    [Paragraph(f"<b>Strategic Risk:</b> {c.get('strategic_risk')}", body_style)],
                    [Paragraph(f"<b>Prescriptive Mitigation:</b> {c.get('mitigation_recommendation')}", body_style)]
                ]
                c_table = Table(c_data, colWidths=[530])
                c_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2') if c.get('tension_severity') in ['CRITICAL', 'HIGH'] else colors.HexColor('#F8FAFC')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#F87171') if c.get('tension_severity') in ['CRITICAL', 'HIGH'] else colors.HexColor('#CBD5E1')),
                    ('PADDING', (0,0), (-1,-1), 6),
                ]))
                elements.append(c_table)
                elements.append(Spacer(1, 8))
        else:
            elements.append(Paragraph("No critical cross-evidence tensions detected.", body_style))

        elements.append(Spacer(1, 10))

        # 3-Horizon Sequenced Roadmap
        elements.append(Paragraph("4. Sequenced Transformation Roadmap (3-Horizon DAG)", h1_style))
        
        all_milestones = (
            roadmap.get("horizon_1_milestones", []) +
            roadmap.get("horizon_2_milestones", []) +
            roadmap.get("horizon_3_milestones", [])
        )
        
        road_table_data = [
            [
                Paragraph("<b>Horizon / Phase</b>", body_style),
                Paragraph("<b>Milestone Title</b>", body_style),
                Paragraph("<b>Duration</b>", body_style),
                Paragraph("<b>CapEx / ROI</b>", body_style),
                Paragraph("<b>Prerequisites & Gating Criteria</b>", body_style)
            ]
        ]

        for m in all_milestones[:6]:
            h_label = "Horizon 1 (M1-6)" if "H1" in m.get("horizon", "") else "Horizon 2 (M6-18)" if "H2" in m.get("horizon", "") else "Horizon 3 (M18-36)"
            deps = ", ".join(m.get("dependencies", [])) or "None (Immediate Start)"
            road_table_data.append([
                Paragraph(h_label, body_style),
                Paragraph(f"<b>{m.get('title')}</b>", body_style),
                Paragraph(f"{m.get('duration_months')} mo", body_style),
                Paragraph(f"{m.get('capex_level')} / {m.get('roi_multiplier')}x", body_style),
                Paragraph(deps, body_style)
            ])

        road_table = Table(road_table_data, colWidths=[95, 145, 55, 75, 160])
        road_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EDF2F7')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(road_table)

        doc.build(elements)
        buffer.seek(0)
        return buffer

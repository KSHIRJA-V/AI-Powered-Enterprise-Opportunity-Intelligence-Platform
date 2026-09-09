from typing import List, Dict, Any, Tuple

class ContradictionEngine:
    """
    Cross-Source Evidence Inconsistency & Contradiction Resolution Engine (CSI-CRE).
    Computes pairwise tension tensors T_{ij} between heterogeneous evidence dimensions:
    - Market/Strategic PR Intent (S_M)
    - Financial Elasticity & CapEx Buffer (S_F)
    - Engineering & OSS Velocity (S_E)
    - Talent & Hiring Capability (S_T)
    - Architecture & Legacy Tech Debt (S_A)
    """

    @classmethod
    def analyze_contradictions(
        cls,
        company_name: str,
        evidence_items: List[Dict[str, Any]],
        dimension_scores: Dict[str, float]
    ) -> Dict[str, Any]:
        contradictions = []
        
        sm = dimension_scores.get("strategic_momentum", 75.0)
        sf = dimension_scores.get("financial_elasticity", 75.0)
        se = dimension_scores.get("engineering_velocity", 75.0)
        st = dimension_scores.get("talent_velocity", 75.0)
        sa = dimension_scores.get("tech_modernity", 75.0)

        # 1. Tension: High Strategic PR Intent vs Low Tech/Architecture Modernity
        diff_intent_arch = sm - sa
        if diff_intent_arch > 15.0:
            severity = "CRITICAL" if diff_intent_arch > 25.0 else "HIGH"
            contradictions.append({
                "dimension_a": "Market & Strategic Intent",
                "claim_a": f"Public commitments and leadership messaging assert rapid autonomous AI & digital platform rollout (Momentum score: {sm:.1f}/100).",
                "dimension_b": "Architecture & Tech Debt",
                "claim_b": f"Telemetry indicates significant legacy debt and monolithic core dependencies (Modernity score: {sa:.1f}/100).",
                "tension_severity": severity,
                "discrepancy_score": round(diff_intent_arch / 100.0, 3),
                "explanation": "High strategic ambition is decoupled from underlying technical infrastructure readiness.",
                "strategic_risk": "Transformation Mirage: High probability of stalled deployments, escalating integration cost overruns, and severe architectural friction.",
                "mitigation_recommendation": "Enforce Horizon 1 API encapsulation and legacy debt remediation gates prior to scaling customer-facing AI agents."
            })

        # 2. Tension: High Strategic PR Intent vs Low Talent Density
        diff_intent_talent = sm - st
        if diff_intent_talent > 12.0:
            severity = "HIGH" if diff_intent_talent > 22.0 else "MODERATE"
            contradictions.append({
                "dimension_a": "Market & Strategic Intent",
                "claim_a": f"Executive announcements emphasize AI-first workflows and autonomous decisioning (Momentum score: {sm:.1f}/100).",
                "dimension_b": "Talent & Workforce Capacity",
                "claim_b": f"Hiring pipeline telemetry reveals a deficit in specialized distributed systems / ML talent (Talent score: {st:.1f}/100).",
                "tension_severity": severity,
                "discrepancy_score": round(diff_intent_talent / 100.0, 3),
                "explanation": "The organization lacks the internal talent density to execute advanced software architectures autonomously.",
                "strategic_risk": "Execution Deficit: Over-reliance on external legacy systems integrators causing knowledge dilution and fragile deliveries.",
                "mitigation_recommendation": "Institute aggressive specialized talent upskilling pods and strategic acquihiring in Horizon 1."
            })

        # 3. Tension: Aggressive Modernization Aspirations vs Constrained Financial Elasticity
        diff_intent_fin = max(sm, sa) - sf
        if diff_intent_fin > 15.0:
            severity = "HIGH" if diff_intent_fin > 25.0 else "MODERATE"
            contradictions.append({
                "dimension_a": "Transformation Modernization Scope",
                "claim_a": "Substantial capital infrastructure demands across multi-cloud and compute clusters.",
                "dimension_b": "Financial Health & CapEx Buffer",
                "claim_b": f"Operating margins or debt obligations constrain free cash flow flexibility (Elasticity score: {sf:.1f}/100).",
                "tension_severity": severity,
                "discrepancy_score": round(diff_intent_fin / 100.0, 3),
                "explanation": "Projected multi-year transformation CapEx may strain operating cash flows or trigger debt covenants.",
                "strategic_risk": "Budgetary De-scoping: Projects abruptly terminated mid-flight due to quarterly margin pressure.",
                "mitigation_recommendation": "Structure transformation into self-funding modular phases where Horizon 1 automation savings fund Horizon 2 expansions."
            })

        # 4. Tension: High Engineering Velocity vs Strict Legacy Operational Agility
        so = dimension_scores.get("operational_agility", 70.0)
        diff_eng_ops = se - so
        if diff_eng_ops > 15.0:
            contradictions.append({
                "dimension_a": "Engineering Velocity",
                "claim_a": f"Software engineering teams demonstrate rapid code delivery and OSS engagement (Velocity score: {se:.1f}/100).",
                "dimension_b": "Operational & Governance Agility",
                "claim_b": f"Enterprise change management and regulatory approval cycles remain rigid (Operational score: {so:.1f}/100).",
                "tension_severity": "MODERATE",
                "discrepancy_score": round(diff_eng_ops / 100.0, 3),
                "explanation": "Developers produce capabilities faster than operational business units can absorb and validate.",
                "strategic_risk": "Shadow IT and Deployment Bottlenecks across regulated production environments.",
                "mitigation_recommendation": "Automate compliance-as-code and establish cross-functional product pods to bridge engineering with compliance."
            })

        # Default fallback if exceptionally harmonious profile
        if not contradictions:
            contradictions.append({
                "dimension_a": "Market & Financial Signals",
                "claim_a": "Strong market momentum backed by high financial liquidity.",
                "dimension_b": "Engineering & Architecture",
                "claim_b": "State-of-the-art engineering velocity and minimal legacy debt.",
                "tension_severity": "LOW",
                "discrepancy_score": 0.05,
                "explanation": "High concordance across all evidence vectors. Signals are mutually reinforcing.",
                "strategic_risk": "Minimal execution tension; principal risk is external macroeconomic shift or regulatory antitrust.",
                "mitigation_recommendation": "Accelerate Horizon 2 and Horizon 3 ecosystem scaling."
            })

        # Tension heatmap matrix
        dims = ["Strategic Intent", "Financial Health", "Engineering Tech", "Talent Capacity", "Architecture"]
        heatmap = {}
        for d1 in dims:
            heatmap[d1] = {}
            for d2 in dims:
                if d1 == d2:
                    heatmap[d1][d2] = 0.0
                else:
                    # Calculate synthetic normalized divergence
                    s1 = dimension_scores.get(cls._dim_key(d1), 75.0)
                    s2 = dimension_scores.get(cls._dim_key(d2), 75.0)
                    heatmap[d1][d2] = round(abs(s1 - s2) / 100.0, 2)

        # Inconsistency Index
        avg_tension = sum(c["discrepancy_score"] for c in contradictions) / max(1, len(contradictions))
        mirage_risk = "HIGH_MIRAGE_RISK" if avg_tension > 0.22 else "MODERATE_TENSION" if avg_tension > 0.12 else "LOW_ALIGNED"

        return {
            "overall_inconsistency_index": round(avg_tension, 3),
            "transformation_mirage_risk": mirage_risk,
            "contradictions": contradictions,
            "tension_heatmap": heatmap
        }

    @staticmethod
    def _dim_key(dim_name: str) -> str:
        mapping = {
            "Strategic Intent": "strategic_momentum",
            "Financial Health": "financial_elasticity",
            "Engineering Tech": "engineering_velocity",
            "Talent Capacity": "talent_velocity",
            "Architecture": "tech_modernity"
        }
        return mapping.get(dim_name, "strategic_momentum")

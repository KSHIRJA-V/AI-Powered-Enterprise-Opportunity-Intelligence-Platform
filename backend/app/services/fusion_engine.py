import math
from typing import List, Dict, Any

class FusionEngine:
    """
    Multi-Source Enterprise Evidence Fusion Framework (MEFF).
    Computes the 5-Axis Technology & Operational Readiness Index (MD-TORI)
    with Dynamic Bayesian Credibility Weights and Contradiction Penalty Factor.
    """

    DIMENSION_WEIGHTS = {
        "financial_elasticity": 0.25,
        "tech_modernity": 0.25,
        "talent_velocity": 0.20,
        "operational_agility": 0.15,
        "strategic_momentum": 0.15
    }

    @classmethod
    def fuse_evidence_and_calculate_readiness(
        cls,
        evidence_records: List[Dict[str, Any]],
        contradiction_index: float = 0.0
    ) -> Dict[str, Any]:
        # Aggregate raw scores per dimension
        dim_scores = {
            "financial_elasticity": 75.0,
            "tech_modernity": 70.0,
            "talent_velocity": 70.0,
            "operational_agility": 68.0,
            "strategic_momentum": 78.0
        }
        
        dim_credibility = {k: [] for k in dim_scores}

        for ev in evidence_records:
            stype = ev.get("source_type", "")
            cred = ev.get("credibility_score", 0.85)
            meta = ev.get("metadata", {})

            if stype == "FINANCIAL_HEALTH":
                score = meta.get("elasticity_score", 80.0)
                dim_scores["financial_elasticity"] = score
                dim_credibility["financial_elasticity"].append(cred)
            elif stype == "TECH_STACK":
                score = meta.get("architecture_modernity_score", 75.0)
                dim_scores["tech_modernity"] = score
                dim_credibility["tech_modernity"].append(cred)
            elif stype == "ENGINEERING_GITHUB":
                score = meta.get("engineering_velocity_score", 75.0)
                # Tech modernity is a joint function of stack and engineering velocity
                dim_scores["tech_modernity"] = (dim_scores["tech_modernity"] * 0.5) + (score * 0.5)
                dim_credibility["tech_modernity"].append(cred)
            elif stype == "TALENT_VELOCITY":
                score = meta.get("talent_velocity_score", 72.0)
                dim_scores["talent_velocity"] = score
                dim_credibility["talent_velocity"].append(cred)
            elif stype == "MARKET_NEWS":
                dim_scores["strategic_momentum"] = 82.0
                dim_credibility["strategic_momentum"].append(cred)

        # Operational agility is derived from talent + architecture balance
        dim_scores["operational_agility"] = round(
            0.55 * dim_scores["talent_velocity"] + 0.45 * dim_scores["tech_modernity"] - (contradiction_index * 15.0),
            1
        )
        dim_scores["operational_agility"] = max(20.0, min(98.0, dim_scores["operational_agility"]))

        # Build detailed dimension objects with confidence intervals
        dimensions_dict = {}
        weighted_sum = 0.0
        total_weight = 0.0

        for dim_key, base_score in dim_scores.items():
            weight = cls.DIMENSION_WEIGHTS[dim_key]
            creds = dim_credibility.get(dim_key, [0.85])
            avg_cred = sum(creds) / max(1, len(creds)) if creds else 0.85
            
            # Credibility-adjusted score
            adjusted_score = base_score * (0.80 + 0.20 * avg_cred)
            # Apply contradiction penalty lambda = 0.18
            adjusted_score = max(10.0, min(99.0, adjusted_score * (1.0 - 0.18 * contradiction_index)))
            adjusted_score = round(adjusted_score, 1)

            # Confidence interval margin (delta)
            delta = round((1.0 - avg_cred) * 12.0 + (contradiction_index * 8.0), 1)
            lower = max(0.0, round(adjusted_score - delta, 1))
            upper = min(100.0, round(adjusted_score + delta, 1))

            strengths, deficits = cls._derive_strengths_and_deficits(dim_key, adjusted_score)

            readable_name = " ".join([w.capitalize() for w in dim_key.split("_")])
            dimensions_dict[dim_key] = {
                "name": readable_name,
                "score": adjusted_score,
                "weight": weight,
                "confidence_lower": lower,
                "confidence_upper": upper,
                "key_strengths": strengths,
                "critical_deficits": deficits
            }

            weighted_sum += adjusted_score * weight
            total_weight += weight

        composite_score = round(weighted_sum / total_weight, 1)

        # Classification Band
        if composite_score >= 85.0:
            band = "TRANSFORMATION_LEADER"
        elif composite_score >= 70.0:
            band = "SCALED_ACCELERATOR"
        elif composite_score >= 50.0:
            band = "FOUNDATIONAL_READY"
        else:
            band = "PRE_EMERGENT"

        # Detailed Gap Analysis
        gaps = cls._generate_gap_analysis(dimensions_dict)

        return {
            "composite_readiness_score": composite_score,
            "readiness_band": band,
            "dimensions": dimensions_dict,
            "gap_analysis": gaps,
            "uncertainty_margin": round(contradiction_index * 10.0 + 3.5, 1)
        }

    @staticmethod
    def _derive_strengths_and_deficits(dim_key: str, score: float) -> tuple:
        if dim_key == "financial_elasticity":
            if score >= 80:
                return (
                    ["Robust free cash flow buffer", "Healthy R&D intensity exceeding industry median", "High CapEx self-funding runway"],
                    ["Potential shareholder yield friction on non-immediate ROI initiatives"]
                )
            else:
                return (
                    ["Consistent operating cash flows"],
                    ["Constrained CapEx flexibility", "Narrow operating margin buffer for experimental R&D"]
                )
        elif dim_key == "tech_modernity":
            if score >= 80:
                return (
                    ["Cloud-native microservices backbone", "High automated test & CI/CD deployment cadence", "Minimal legacy mainframe debt"],
                    ["Cross-cloud egress latency optimizations required"]
                )
            else:
                return (
                    ["Active cloud migration pilots"],
                    ["Legacy core transactional system lock-in", "Siloed monolithic database dependencies", "Fragmented API gateway ecosystem"]
                )
        elif dim_key == "talent_velocity":
            if score >= 80:
                return (
                    ["High density of distributed systems & AI engineers", "High technical talent brand attraction", "Low attrition in core architecture teams"],
                    ["Intense competition for specialized GPU kernel engineers"]
                )
            else:
                return (
                    ["Deep institutional domain knowledge in incumbent teams"],
                    ["Deficit in modern cloud-native & data platform architects", "High proportion of staff dedicated to legacy maintenance"]
                )
        elif dim_key == "operational_agility":
            if score >= 80:
                return (
                    ["Rapid cross-functional product pod execution", "Automated compliance and security-as-code"],
                    ["Scaling governance across multi-regional business units"]
                )
            else:
                return (
                    ["Established risk and compliance governance controls"],
                    ["Slow quarterly release approval gates", "Siloed communication between IT engineering and business stakeholders"]
                )
        else: # strategic_momentum
            if score >= 80:
                return (
                    ["Clear board-level transformation charter", "Market recognition as technology innovation pioneer", "Strong ecosystem partnerships"],
                    ["High market expectations requiring rapid continuous delivery"]
                )
            else:
                return (
                    ["Executive recognition of transformation necessity"],
                    ["Ambiguous transformation KPIs", "Fragmented divisional roadmaps without unified architectural oversight"]
                )

    @classmethod
    def _generate_gap_analysis(cls, dimensions: Dict[str, Any]) -> List[Dict[str, Any]]:
        gaps = []
        for key, dim in dimensions.items():
            score = dim["score"]
            name = dim["name"]
            
            if score < 75.0:
                priority = "P0 - CRITICAL" if score < 60.0 else "P1 - HIGH"
                weeks = int((85.0 - score) * 1.8)
                gaps.append({
                    "dimension": name,
                    "current_state": f"Score at {score:.1f}/100 with evident operational friction.",
                    "target_state": f"Target benchmark >= 85.0/100 with automated, self-healing capability.",
                    "capability_gap": dim["critical_deficits"][0] if dim["critical_deficits"] else "Capability gap remediation required",
                    "priority_level": priority,
                    "estimated_remediation_weeks": max(8, weeks)
                })
        
        if not gaps:
            gaps.append({
                "dimension": "Continuous Innovation",
                "current_state": "All core dimensions exceed baseline readiness (>= 75.0/100).",
                "target_state": "Sustain technological leadership and autonomous agentic scaling.",
                "capability_gap": "Ecosystem federation and autonomous multi-agent interoperability.",
                "priority_level": "P2 - STRATEGIC",
                "estimated_remediation_weeks": 12
            })

        return gaps

from datetime import datetime, timezone
import math
from typing import Dict, Any, Optional

class CredibilityScorer:
    """
    Mathematical credibility weighting engine for heterogeneous enterprise sources.
    Calculates composite credibility:
    C(s) = w_r * R(domain) + w_f * F(timestamp) + w_v * V(citations) + w_s * S(specificity)
    """

    DOMAIN_REPUTATION_TIERS = {
        # Tier 1 (0.95): Regulatory, Official SEC/Gov, Primary Financial Exchanges
        "sec.gov": 0.98,
        "alphavantage.co": 0.95,
        "bloomberg.com": 0.94,
        "reuters.com": 0.94,
        "wsj.com": 0.93,
        "ft.com": 0.93,
        "api.github.com": 0.95,
        "github.com": 0.95,
        # Tier 2 (0.85): Top-tier Tech & Business Press, Peer-reviewed
        "techcrunch.com": 0.88,
        "cnbc.com": 0.88,
        "forbes.com": 0.82,
        "theverge.com": 0.84,
        "wired.com": 0.85,
        "hbr.org": 0.90,
        "venturebeat.com": 0.83,
        "zdnet.com": 0.82,
        # Tier 3 (0.70): Generic news, blogs, PR releases
        "prnewswire.com": 0.72,
        "businesswire.com": 0.73,
        "globenewswire.com": 0.70,
        "medium.com": 0.55,
        "substack.com": 0.58
    }

    WEIGHTS = {
        "reputation": 0.40,
        "freshness": 0.25,
        "specificity": 0.20,
        "corroboration": 0.15
    }

    @classmethod
    def calculate_credibility(
        cls,
        source_domain: str,
        published_date_iso: Optional[str] = None,
        has_verifiable_metrics: bool = True,
        corroboration_count: int = 1
    ) -> Dict[str, Any]:
        # 1. Reputation Score
        domain_clean = source_domain.lower().replace("https://", "").replace("http://", "").split("/")[0]
        reputation = cls.DOMAIN_REPUTATION_TIERS.get(domain_clean, 0.65)
        for known_domain, score in cls.DOMAIN_REPUTATION_TIERS.items():
            if known_domain in domain_clean:
                reputation = score
                break

        # 2. Freshness Score (exponential decay over 365 days)
        freshness = 0.80  # Default if date unavailable
        if published_date_iso:
            try:
                pub_time = datetime.fromisoformat(published_date_iso.replace("Z", "+00:00"))
                now = datetime.now(timezone.utc)
                days_old = max(0, (now - pub_time).days)
                # Halflife of 180 days
                freshness = math.exp(-0.693 * (days_old / 180.0))
                freshness = max(0.20, min(1.0, freshness))
            except Exception:
                freshness = 0.75

        # 3. Specificity Score
        specificity = 0.90 if has_verifiable_metrics else 0.60

        # 4. Corroboration Factor
        corroboration = min(1.0, 0.5 + (0.15 * corroboration_count))

        # Composite Credibility
        composite = (
            cls.WEIGHTS["reputation"] * reputation +
            cls.WEIGHTS["freshness"] * freshness +
            cls.WEIGHTS["specificity"] * specificity +
            cls.WEIGHTS["corroboration"] * corroboration
        )
        composite = round(min(0.99, max(0.10, composite)), 3)

        return {
            "composite_score": composite,
            "reputation_score": round(reputation, 3),
            "freshness_score": round(freshness, 3),
            "specificity_score": round(specificity, 3),
            "corroboration_factor": round(corroboration, 3),
            "tier": "High" if composite >= 0.80 else "Moderate" if composite >= 0.60 else "Low"
        }

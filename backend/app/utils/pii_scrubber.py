import re
from typing import Tuple, List, Dict, Any

class PIIScrubber:
    """
    Enterprise-grade PII detection and redaction engine.
    Scrubs emails, phone numbers, SSNs, credit cards, IP addresses, and private keys.
    """
    
    PATTERNS = {
        "EMAIL": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "PHONE": r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b',
        "SSN": r'\b\d{3}-\d{2}-\d{4}\b',
        "CREDIT_CARD": r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
        "IP_ADDRESS": r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b',
        "API_KEY": r'\b(?:ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{32,}|Bearer\s+[A-Za-z0-9\-_]{20,})\b'
    }

    @classmethod
    def scrub_text(cls, text: str) -> Tuple[str, int, List[Dict[str, Any]]]:
        if not text:
            return "", 0, []
        
        scrubbed = text
        total_redactions = 0
        redactions = []

        for pii_type, pattern in cls.PATTERNS.items():
            matches = list(re.finditer(pattern, scrubbed))
            for match in reversed(matches):
                val = match.group(0)
                # Keep enterprise context if email is public domain like nvidia.com
                replacement = f"[{pii_type}_REDACTED]"
                start, end = match.span()
                scrubbed = scrubbed[:start] + replacement + scrubbed[end:]
                total_redactions += 1
                redactions.append({
                    "type": pii_type,
                    "original_preview": val[:3] + "***" if len(val) > 4 else "***",
                    "position": start
                })

        return scrubbed, total_redactions, redactions

    @classmethod
    def scrub_dict(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        result = {}
        for k, v in data.items():
            if isinstance(v, str):
                scrubbed, _, _ = cls.scrub_text(v)
                result[k] = scrubbed
            elif isinstance(v, dict):
                result[k] = cls.scrub_dict(v)
            elif isinstance(v, list):
                result[k] = [cls.scrub_text(item)[0] if isinstance(item, str) else item for item in v]
            else:
                result[k] = v
        return result

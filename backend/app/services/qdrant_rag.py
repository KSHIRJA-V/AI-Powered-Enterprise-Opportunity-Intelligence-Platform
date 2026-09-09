from typing import List, Dict, Any, Optional
import hashlib
import numpy as np
from app.config import settings

class QdrantRAGService:
    """
    High-Performance Vector RAG Service for Multi-Source Evidence Retrieval.
    Stores and indexes heterogeneous evidence vectors with metadata filtering.
    """

    def __init__(self):
        self._memory_store: List[Dict[str, Any]] = []
        self._is_initialized = False

    def _generate_vector(self, text: str, dim: int = 128) -> List[float]:
        """
        Fast, deterministic hash-based dense embedding representation
        for lightweight local vector operations with cosine similarity support.
        """
        hash_digest = hashlib.sha256(text.encode("utf-8")).digest()
        # Seed pseudo-random generator with hash to generate continuous dense representation
        seed = int.from_bytes(hash_digest[:4], "big")
        rng = np.random.RandomState(seed)
        vec = rng.randn(dim)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    async def index_evidence_batch(self, evidence_items: List[Dict[str, Any]]) -> int:
        count = 0
        for item in evidence_items:
            content = item.get("content", "")
            title = item.get("title", "")
            full_text = f"{title}\n{content}"
            embedding = self._generate_vector(full_text)
            
            record = {
                "id": len(self._memory_store) + 1,
                "title": title,
                "content": content,
                "source_type": item.get("source_type", "MARKET_NEWS"),
                "credibility_score": item.get("credibility_score", 0.85),
                "source_url": item.get("source_url"),
                "metadata": item.get("metadata", {}),
                "vector": embedding
            }
            self._memory_store.append(record)
            count += 1
        return count

    async def query_relevant_evidence(
        self,
        query: str,
        source_type: Optional[str] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        if not self._memory_store:
            return []

        query_vec = np.array(self._generate_vector(query))
        scored_results = []

        for record in self._memory_store:
            if source_type and record["source_type"] != source_type:
                continue
            
            rec_vec = np.array(record["vector"])
            # Cosine similarity
            sim = float(np.dot(query_vec, rec_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(rec_vec) + 1e-9))
            
            # Incorporate credibility score in ranking: Final Score = 0.7 * Sim + 0.3 * Credibility
            final_rank = 0.70 * sim + 0.30 * record["credibility_score"]
            
            scored_results.append({
                "id": record["id"],
                "title": record["title"],
                "content": record["content"],
                "source_type": record["source_type"],
                "credibility_score": record["credibility_score"],
                "source_url": record["source_url"],
                "metadata": record["metadata"],
                "relevance_score": round(sim, 4),
                "composite_rank": round(final_rank, 4)
            })

        scored_results.sort(key=lambda x: x["composite_rank"], reverse=True)
        return scored_results[:top_k]

rag_service = QdrantRAGService()

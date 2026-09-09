# TransforMind AI: System Architecture & Technical Specifications

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                    REACT FRONTEND                                       |
|  - Executive Strategy Command Center        - Live Multi-Agent LangGraph Stream         |
|  - 5-Axis Multidimensional Readiness Radar  - Cross-Source Contradiction Matrix         |
|  - Interactive 3-Horizon Roadmap (DAG/Gantt)- Verifiable Evidence Lineage Explorer      |
|  - Empirical Benchmark Evaluation Lab       - Executive PDF Dossier Export (No Emojis)  |
+--------------------------------------------+--------------------------------------------+
                                             | REST / Server-Sent Events (SSE)
+--------------------------------------------v--------------------------------------------+
|                                   FASTAPI BACKEND                                       |
|  /api/analysis/run  /api/evidence  /api/roadmap  /api/contradictions  /api/evaluations  |
+--------------------------------------------+--------------------------------------------+
                                             |
+--------------------------------------------v--------------------------------------------+
|                        LANGGRAPH MULTI-AGENT ORCHESTRATOR                               |
|                                                                                         |
|  [Market Intelligence Agent]  [Financial Health Agent]  [Engineering Auditor Agent]     |
|  (NewsAPI & Sentiment)        (Alpha Vantage / CapEx)   (GitHub velocity / Tech stack)  |
|               \                         |                        /                      |
|                \                        |                       /                       |
|                 v                       v                      v                        |
|              [Talent & Workforce Agent]   [Tech Stack Auditor Agent]                    |
|              (Job Postings & Skills Gap)  (Legacy vs Cloud-Native Footprint)            |
|                                         |                                               |
|                                         v                                               |
|                    [Cross-Evidence Fusion & Contradiction Agent]                        |
|                    (Bayesian Credibility Weighting & Tension Matrix)                    |
|                                         |                                               |
|                                         v                                               |
|                    [5-Axis Technology Readiness Tensor Agent]                           |
|                    (MD-TORI Multi-Criteria Scoring & Gap Analysis)                      |
|                                         |                                               |
|                                         v                                               |
|                    [Transformation Roadmap & Strategy Planner]                          |
|                    (DAG Topological Sequencing: H1 -> H2 -> H3)                         |
|                                         |                                               |
|                                         v                                               |
|                    [Guardrail, PII Scrubber & Lineage Graph Agent]                      |
|                    (Source Verification & Verifiable Claim Provenance)                  |
+--------------------------------------------+--------------------------------------------+
                                             |
     +---------------------------------------+---------------------------------------+
     |                                       |                                       |
+----v--------------------+    +-------------v-------------+    +--------------------v----+
|  VECTOR RAG (Qdrant)    |    |   DATABASE (SQLite/PG)    |    |    EXTERNAL APIS        |
|  - Evidence Embeddings  |    |   - Companies & Analyses  |    |    - NewsAPI            |
|  - Semantic Search      |    |   - Roadmaps & Audits     |    |    - Alpha Vantage      |
|  - Claim-to-Evidence RAG|    |   - Benchmark Metrics     |    |    - GitHub REST API    |
+-------------------------+    +---------------------------+    +-------------------------+
```

## 2. API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/companies/presets` | GET | Retrieve pre-seeded enterprise profiles (NVIDIA, Tesla, JPMorgan, Walmart, Siemens, ASML). |
| `/api/analysis/run` | POST | Execute full multi-agent LangGraph analysis pipeline synchronously. |
| `/api/analysis/stream/{company}` | GET | Server-Sent Events (SSE) stream providing real-time step-by-step agent logs for UI visualizer. |
| `/api/evidence/{company}` | GET | Retrieve all ingested evidence items, credibility breakdown, and claim lineage nodes. |
| `/api/contradictions/{company}` | GET | Retrieve cross-evidence tension findings, mirage risk index, and pairwise heatmap matrix. |
| `/api/roadmap/{company}` | GET | Retrieve 3-Horizon DAG roadmap with critical path and gating criteria. |
| `/api/roadmap/simulate` | POST | Execute What-If scenario simulation with CapEx, talent velocity, and tech debt multipliers. |
| `/api/evaluations/benchmark/{company}` | GET | Execute quantitative benchmark comparing Baseline LLM vs Standard RAG vs TransforMind MEFF. |
| `/api/reports/pdf/{company}` | GET | Generate and download executive-grade PDF Transformation Intelligence Dossier. |

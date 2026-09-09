from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    ticker = Column(String(20), nullable=True, index=True)
    industry = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    github_org = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    analyses = relationship("AnalysisRun", back_populates="company", cascade="all, delete-orphan")

class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id = Column(String(64), primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    status = Column(String(50), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED, FAILED
    composite_readiness_score = Column(Float, nullable=True)
    transformation_verdict = Column(String(255), nullable=True)
    executive_summary = Column(Text, nullable=True)
    state_json = Column(JSON, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    company = relationship("Company", back_populates="analyses")
    evidence_records = relationship("EvidenceRecord", back_populates="analysis", cascade="all, delete-orphan")
    contradictions = relationship("ContradictionRecord", back_populates="analysis", cascade="all, delete-orphan")
    readiness_tensor = relationship("ReadinessTensor", uselist=False, back_populates="analysis", cascade="all, delete-orphan")
    roadmap_milestones = relationship("RoadmapMilestone", back_populates="analysis", cascade="all, delete-orphan")

class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(String(64), ForeignKey("analysis_runs.id"), nullable=False)
    source_type = Column(String(50), nullable=False)  # MARKET_NEWS, FINANCIAL_HEALTH, ENGINEERING_GITHUB, TALENT_VELOCITY, TECH_STACK
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    source_url = Column(String(512), nullable=True)
    credibility_score = Column(Float, default=0.85)
    confidence_interval = Column(Float, default=0.90)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("AnalysisRun", back_populates="evidence_records")

class ContradictionRecord(Base):
    __tablename__ = "contradiction_records"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(String(64), ForeignKey("analysis_runs.id"), nullable=False)
    dimension_a = Column(String(100), nullable=False)
    claim_a = Column(Text, nullable=False)
    dimension_b = Column(String(100), nullable=False)
    claim_b = Column(Text, nullable=False)
    tension_severity = Column(String(50), default="MODERATE")  # LOW, MODERATE, HIGH, CRITICAL
    discrepancy_score = Column(Float, default=0.5)
    explanation = Column(Text, nullable=False)
    strategic_risk = Column(Text, nullable=False)
    mitigation_recommendation = Column(Text, nullable=False)

    analysis = relationship("AnalysisRun", back_populates="contradictions")

class ReadinessTensor(Base):
    __tablename__ = "readiness_tensors"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(String(64), ForeignKey("analysis_runs.id"), nullable=False, unique=True)
    financial_elasticity = Column(Float, nullable=False)
    tech_modernity = Column(Float, nullable=False)
    talent_velocity = Column(Float, nullable=False)
    operational_agility = Column(Float, nullable=False)
    strategic_momentum = Column(Float, nullable=False)
    gap_analysis_json = Column(JSON, nullable=True)

    analysis = relationship("AnalysisRun", back_populates="readiness_tensor")

class RoadmapMilestone(Base):
    __tablename__ = "roadmap_milestones"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(String(64), ForeignKey("analysis_runs.id"), nullable=False)
    title = Column(String(255), nullable=False)
    horizon = Column(String(20), nullable=False)  # H1_FOUNDATIONAL, H2_EXPANSION, H3_AUTONOMOUS
    duration_months = Column(Integer, default=6)
    capex_level = Column(String(50), default="MEDIUM")  # LOW, MEDIUM, HIGH, CAPITAL_INTENSIVE
    roi_multiplier = Column(Float, default=2.5)
    dependencies_json = Column(JSON, nullable=True)
    objectives = Column(Text, nullable=False)
    kpis_json = Column(JSON, nullable=True)
    risk_factors = Column(Text, nullable=True)

    analysis = relationship("AnalysisRun", back_populates="roadmap_milestones")

class EvaluationBenchmark(Base):
    __tablename__ = "evaluation_benchmarks"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    baseline_llm_metrics = Column(JSON, nullable=False)
    standard_rag_metrics = Column(JSON, nullable=False)
    transformind_fusion_metrics = Column(JSON, nullable=False)
    statistical_significance_json = Column(JSON, nullable=True)

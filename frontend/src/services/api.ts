import axios from 'axios';
import type {
  Company,
  AnalysisRunResult,
  EvidenceItem,
  ClaimLineageItem,
  ContradictionMatrix,
  RoadmapDAG,
  ScenarioSimulationResult,
  FrameworkComparison
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Preset companies
  async getPresetCompanies(): Promise<Company[]> {
    try {
      const resp = await client.get<Company[]>('/companies/presets');
      return resp.data;
    } catch (e) {
      console.warn('API connection failed, fallback to local presets', e);
      return [
        { name: 'NVIDIA Corporation', ticker: 'NVDA', industry: 'Semiconductors & Accelerated Compute', description: 'GPU compute, AI enterprise software and accelerated data centers.', website: 'https://nvidia.com', github_org: 'NVIDIA' },
        { name: 'Tesla, Inc.', ticker: 'TSLA', industry: 'Autonomous Mobility, Robotics & Energy', description: 'Vertically integrated electric vehicle, full self-driving neural net and energy storage platform.', website: 'https://tesla.com', github_org: 'teslamotors' },
        { name: 'JPMorgan Chase & Co.', ticker: 'JPM', industry: 'Global Banking & Financial Services', description: 'Global financial institution modernizing hybrid core banking, AI risk underwriting, and wealth platforms.', website: 'https://jpmorganchase.com', github_org: 'jpmorganchase' },
        { name: 'Walmart Inc.', ticker: 'WMT', industry: 'Retail & Autonomous Supply Chain', description: 'Omnichannel retail enterprise deploying automated distribution, predictive inventory, and edge vision.', website: 'https://walmart.com', github_org: 'walmartlabs' },
        { name: 'Siemens AG', ticker: 'SIEGY', industry: 'Industrial Automation & Digital Enterprise', description: 'Industrial engineering leader scaling connected digital manufacturing twins, IoT edge, and grid software.', website: 'https://siemens.com', github_org: 'siemens' },
        { name: 'ASML Holding N.V.', ticker: 'ASML', industry: 'Semiconductor Photolithography Systems', description: 'Critical global supplier of Extreme Ultraviolet (EUV) photolithography systems for semiconductor fabrication.', website: 'https://asml.com', github_org: 'asml-labs' }
      ];
    }
  },

  // Execute full multi-agent analysis
  async runAnalysis(companyName: string, ticker?: string, customContext?: string): Promise<AnalysisRunResult> {
    const resp = await client.post<AnalysisRunResult>('/analysis/run', {
      company_name: companyName,
      ticker: ticker,
      custom_context: customContext,
    });
    return resp.data;
  },

  // Evidence Explorer
  async getEvidence(companyName: string, sourceType?: string): Promise<{
    company_name: string;
    total_evidence_count: number;
    mean_credibility: number;
    claim_lineage_graph: ClaimLineageItem[];
    evidence: EvidenceItem[];
  }> {
    const params = sourceType ? { source_type: sourceType } : {};
    const resp = await client.get(`/evidence/${encodeURIComponent(companyName)}`, { params });
    return resp.data;
  },

  // Roadmap & Scenario Simulation
  async getRoadmap(companyName: string): Promise<{
    company_name: string;
    readiness_band: string;
    composite_readiness_score: number;
    roadmap: RoadmapDAG;
    claim_lineage_graph: ClaimLineageItem[];
  }> {
    const resp = await client.get(`/roadmap/${encodeURIComponent(companyName)}`);
    return resp.data;
  },

  async simulateScenario(params: {
    capex_budget_multiplier: number;
    talent_acquisition_velocity: number;
    legacy_tech_debt_reduction_priority: number;
  }): Promise<ScenarioSimulationResult> {
    const resp = await client.post<ScenarioSimulationResult>('/roadmap/simulate', params);
    return resp.data;
  },

  // Contradiction Matrix
  async getContradictions(companyName: string): Promise<ContradictionMatrix> {
    const resp = await client.get<ContradictionMatrix>(`/contradictions/${encodeURIComponent(companyName)}`);
    return resp.data;
  },

  // Evaluation & Benchmark
  async getFrameworkBenchmark(companyName: string): Promise<FrameworkComparison> {
    const resp = await client.get<FrameworkComparison>(`/evaluations/benchmark/${encodeURIComponent(companyName)}`);
    return resp.data;
  },

  // PDF Report Download URL
  getPdfReportUrl(companyName: string): string {
    return `${API_BASE_URL}/reports/pdf/${encodeURIComponent(companyName)}`;
  }
};

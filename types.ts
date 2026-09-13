export enum View {
  DASHBOARD = 'DASHBOARD',
  IDENTITY = 'IDENTITY',
  CONTENT = 'CONTENT',
  SENTIMENT = 'SENTIMENT',
  ASSISTANT = 'ASSISTANT',
  REGISTER = 'REGISTER'
}

export interface BrandIdentity {
  name: string;
  industry: string;
  values: string[];
  targetAudience: string;
  tagline?: string;
  logoUrl?: string;
  logoSvg?: string;
  createdAt?: string;
}

export interface SentimentResult {
  score: number;
  label: string;
  explanation: string;
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  timestamp?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ExplainableInsight {
  why: string;
  evidence: string;
  recommendation: string;
  actionLabel?: string;
  actionType?: string;
}

export interface BrandGuardianReport {
  score: number; // 0 - 100
  toneMatch: string; // e.g. "94% aligned with Innovative, Trustworthy"
  status: 'optimal' | 'needs_attention' | 'critical';
  issues: string[];
  explanation: ExplainableInsight;
  suggestedImprovement?: string;
}

export interface PredictiveRisk {
  id: string;
  type: 'risk' | 'opportunity' | 'trend';
  title: string;
  trendDelta?: string;
  why: string;
  evidence: string;
  recommendation: string;
  actionLabel?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface BrandHealthBreakdown {
  score: number; // 0 - 100
  status: 'Strong' | 'Needs Attention' | 'Critical';
  factors: {
    identityCompleteness: number; // 0-100
    contentConsistency: number; // 0-100
    sentimentPerformance: number; // 0-100
    activityVelocity: number; // 0-100
  };
  strongPoints: string[];
  attentionPoints: string[];
  criticalIssues: string[];
  lastUpdated: string;
}

export interface SavedContentItem {
  id: string;
  brandName: string;
  contentType: string;
  content: string;
  consistencyScore?: number;
  createdAt: string;
}

export interface WorkspaceContextType {
  activeBrand: BrandIdentity | null;
  setActiveBrand: (brand: BrandIdentity | null) => void;
  savedContents: SavedContentItem[];
  saveContent: (item: Omit<SavedContentItem, 'id' | 'createdAt'>) => void;
  updateContent: (id: string, newContent: string, score?: number) => void;
  sentimentHistory: SentimentResult[];
  addSentimentRecord: (record: SentimentResult) => void;
  brandHealth: BrandHealthBreakdown | null;
  predictiveRecommendations: PredictiveRisk[];
  hasData: boolean;
}

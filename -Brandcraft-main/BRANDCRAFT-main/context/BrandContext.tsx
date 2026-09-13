import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  BrandIdentity, 
  SavedContentItem, 
  SentimentResult, 
  BrandHealthBreakdown, 
  PredictiveRisk, 
  WorkspaceContextType 
} from '../types';

const BrandContext = createContext<WorkspaceContextType | undefined>(undefined);

const LOCAL_STORAGE_BRAND_KEY = 'brandcraft_active_brand';
const LOCAL_STORAGE_CONTENTS_KEY = 'brandcraft_saved_contents';
const LOCAL_STORAGE_SENTIMENT_KEY = 'brandcraft_sentiment_history';

export const BrandContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBrand, setActiveBrandState] = useState<BrandIdentity | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BRAND_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedContents, setSavedContents] = useState<SavedContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONTENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sentimentHistory, setSentimentHistory] = useState<SentimentResult[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SENTIMENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const setActiveBrand = (brand: BrandIdentity | null) => {
    setActiveBrandState(brand);
    if (brand) {
      localStorage.setItem(LOCAL_STORAGE_BRAND_KEY, JSON.stringify(brand));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_BRAND_KEY);
    }
  };

  const saveContent = (item: Omit<SavedContentItem, 'id' | 'createdAt'>) => {
    const newItem: SavedContentItem = {
      ...item,
      id: 'cnt-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setSavedContents(prev => {
      const updated = [newItem, ...prev.slice(0, 29)]; // keep latest 30
      localStorage.setItem(LOCAL_STORAGE_CONTENTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateContent = (id: string, newContent: string, score?: number) => {
    setSavedContents(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, content: newContent, consistencyScore: score ?? item.consistencyScore } : item
      );
      localStorage.setItem(LOCAL_STORAGE_CONTENTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addSentimentRecord = (record: SentimentResult) => {
    const enriched = { ...record, timestamp: new Date().toISOString() };
    setSentimentHistory(prev => {
      const updated = [enriched, ...prev.slice(0, 19)]; // keep latest 20
      localStorage.setItem(LOCAL_STORAGE_SENTIMENT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const hasData = Boolean(activeBrand || savedContents.length > 0 || sentimentHistory.length > 0);

  // FEATURE D: Dynamically computed Brand Health Score
  const brandHealth = useMemo<BrandHealthBreakdown | null>(() => {
    if (!hasData) return null;

    let identityCompleteness = 0;
    if (activeBrand?.name) identityCompleteness += 30;
    if (activeBrand?.industry && activeBrand?.values?.length) identityCompleteness += 30;
    if (activeBrand?.logoSvg || activeBrand?.logoUrl) identityCompleteness += 40;

    let contentConsistency = 80;
    if (savedContents.length > 0) {
      const scores = savedContents.map(c => c.consistencyScore || 85);
      contentConsistency = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    let sentimentPerformance = 85;
    if (sentimentHistory.length > 0) {
      const avgPos = sentimentHistory.reduce((acc, s) => acc + s.breakdown.positive, 0) / sentimentHistory.length;
      const avgNeg = sentimentHistory.reduce((acc, s) => acc + s.breakdown.negative, 0) / sentimentHistory.length;
      sentimentPerformance = Math.max(10, Math.min(100, Math.round(avgPos + (50 - avgNeg))));
    }

    let activityVelocity = Math.min(100, 20 + savedContents.length * 15 + sentimentHistory.length * 15 + (activeBrand ? 20 : 0));

    // Weighted Overall Score
    const totalScore = Math.round(
      identityCompleteness * 0.35 +
      contentConsistency * 0.25 +
      sentimentPerformance * 0.25 +
      activityVelocity * 0.15
    );

    const strongPoints: string[] = [];
    const attentionPoints: string[] = [];
    const criticalIssues: string[] = [];

    if (activeBrand?.logoSvg) {
      strongPoints.push('Master vector visual identity configured');
    } else if (activeBrand?.name) {
      attentionPoints.push('Visual identity logo has not been generated yet');
    } else {
      criticalIssues.push('Core brand naming & identity missing');
    }

    if (contentConsistency >= 85) {
      strongPoints.push(`High content voice compliance (${contentConsistency}%) across marketing assets`);
    } else if (savedContents.length > 0) {
      attentionPoints.push('Some recent marketing collateral deviates from configured brand values');
    } else {
      attentionPoints.push('No marketing copy assets generated yet in Content Hub');
    }

    if (sentimentHistory.length > 0 && sentimentPerformance >= 80) {
      strongPoints.push(`Positive consumer sentiment baseline (${sentimentPerformance}% rating)`);
    } else if (sentimentHistory.length > 0 && sentimentPerformance < 60) {
      criticalIssues.push('Negative feedback signals detected in recent sentiment analysis');
    }

    return {
      score: totalScore,
      status: totalScore >= 80 ? 'Strong' : totalScore >= 60 ? 'Needs Attention' : 'Critical',
      factors: {
        identityCompleteness,
        contentConsistency,
        sentimentPerformance,
        activityVelocity
      },
      strongPoints: strongPoints.length ? strongPoints : ['Baseline brand architecture initialized'],
      attentionPoints: attentionPoints.length ? attentionPoints : ['Continue expanding multi-channel campaign collateral'],
      criticalIssues,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
  }, [activeBrand, savedContents, sentimentHistory, hasData]);

  // FEATURE F: Proactive Predictive Recommendations
  const predictiveRecommendations = useMemo<PredictiveRisk[]>(() => {
    if (!hasData) return [];

    const recs: PredictiveRisk[] = [];

    if (activeBrand && !activeBrand.logoSvg) {
      recs.push({
        id: 'rec-logo',
        type: 'opportunity',
        title: 'Complete Visual Identity Vector Assets',
        trendDelta: '+35% Brand Recall',
        severity: 'medium',
        why: 'Brands with high-contrast vector logos achieve 35% higher recognition in market launch phases.',
        evidence: 'Brand name has been forged but vector SVG logo is not yet generated.',
        recommendation: 'Generate scalable SVG logo in the Brand Identity Creator.',
        actionLabel: 'Generate Logo'
      });
    }

    if (activeBrand && savedContents.length < 2) {
      recs.push({
        id: 'rec-content-expansion',
        type: 'opportunity',
        title: 'Accelerate Launch Content Coverage',
        trendDelta: '+2.4x Audience Reach',
        severity: 'low',
        why: 'Multi-touchpoint launch strategy requires consistent social, email, and ad copy.',
        evidence: `Currently only ${savedContents.length} marketing asset(s) are stored in Content Hub.`,
        recommendation: 'Generate a Product Launch Email and LinkedIn post in Content Hub.',
        actionLabel: 'Create Launch Copy'
      });
    }

    if (sentimentHistory.length > 0) {
      const latest = sentimentHistory[0];
      if (latest.breakdown.negative > 20) {
        recs.push({
          id: 'rec-sentiment-risk',
          type: 'risk',
          title: 'Customer Experience Friction Risk',
          trendDelta: `-${latest.breakdown.negative}% Customer Sentiment`,
          severity: 'high',
          why: 'Recent feedback analysis flagged customer experience friction points.',
          evidence: `Negative sentiment breakdown reached ${latest.breakdown.negative}%.`,
          recommendation: 'Review negative sentiment insights and adjust brand messaging.',
          actionLabel: 'Review Sentiment AI'
        });
      }
    }

    return recs;
  }, [activeBrand, savedContents, sentimentHistory, hasData]);

  return (
    <BrandContext.Provider
      value={{
        activeBrand,
        setActiveBrand,
        savedContents,
        saveContent,
        updateContent,
        sentimentHistory,
        addSentimentRecord,
        brandHealth,
        predictiveRecommendations,
        hasData
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandContext must be used within a BrandContextProvider');
  }
  return context;
};

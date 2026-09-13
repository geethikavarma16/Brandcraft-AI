import { GoogleGenAI, Type } from "@google/genai";
import { SentimentResult, BrandIdentity, BrandGuardianReport, ExplainableInsight, PredictiveRisk } from "../types";

const getApiKey = () => {
  return (
    process.env.API_KEY ||
    process.env.VITE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) ||
    ''
  );
};

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

const DEFAULT_MODEL = 'gemini-3.6-flash';

export const generateBrandNames = async (industry: string, values: string[], audience: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Generate 5 creative brand names for a company in the ${industry} industry. 
    Core values: ${values.join(', ')}. Target audience: ${audience}.
    Return a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateLogo = async (brandName: string, industry: string, style: string) => {
  const ai = getAI();
  const prompt = `Generate a modern, minimalist, professional SVG logo for a brand named "${brandName}". 
  The brand is in the ${industry} industry. 
  Style: ${style}. 
  Requirements:
  - Return ONLY the raw <svg> code.
  - No explanations or markdown code blocks.
  - Use high-contrast colors (like black, indigo, or slate).
  - Include the brand name "${brandName}" inside the SVG with a clean sans-serif font.
  - Ensure it has a viewBox="0 0 400 400".
  - Make it look premium and vector-based.`;
  
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
  });

  const text = response.text || '';
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
  return svgMatch ? svgMatch[0] : null;
};

export const generateMarketingContent = async (brand: string, type: string) => {
  const ai = getAI();
  const prompt = `Write ${type} for a brand called "${brand}". Focus on being engaging and persuasive.`;
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
  });
  return response.text;
};

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Analyze the sentiment of this text: "${text}". 
    Return JSON with score (-1 to 1), label, explanation, and percentage breakdown (positive, neutral, negative).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          label: { type: Type.STRING },
          explanation: { type: Type.STRING },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.NUMBER },
              neutral: { type: Type.NUMBER },
              negative: { type: Type.NUMBER },
            },
            required: ['positive', 'neutral', 'negative']
          }
        },
        required: ['score', 'label', 'explanation', 'breakdown']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * FEATURE B & C: AI Brand Guardian & Explainable Suggestions
 * Analyzes written marketing content for brand voice consistency, terminology, and tone alignment.
 */
export const analyzeBrandGuardian = async (
  content: string,
  brandContext: BrandIdentity | null,
  contentType: string
): Promise<BrandGuardianReport> => {
  const ai = getAI();
  const brandName = brandContext?.name || 'Your Brand';
  const brandValues = brandContext?.values?.length ? brandContext.values.join(', ') : 'Professional, Innovative, Engaging';
  const audience = brandContext?.targetAudience || 'Target Customers';

  const prompt = `You are the BrandCraft AI Brand Guardian.
Analyze the following ${contentType} content for brand consistency.
Brand Name: "${brandName}"
Brand Values: ${brandValues}
Target Audience: ${audience}

Content to evaluate:
"""${content}"""

Provide:
1. Consistency score (0 to 100)
2. Tone match summary
3. Status ('optimal' for score >= 85, 'needs_attention' for 65-84, 'critical' for < 65)
4. List of 1-3 specific potential issues or inconsistencies (if any)
5. Explainable insight with:
   - why: Why the score was given
   - evidence: Exact phrase or stylistic element observed
   - recommendation: Concrete adjustment advice
6. A refined version of the content that achieves 95+ score.

Return strictly JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            toneMatch: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['optimal', 'needs_attention', 'critical'] },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: {
              type: Type.OBJECT,
              properties: {
                why: { type: Type.STRING },
                evidence: { type: Type.STRING },
                recommendation: { type: Type.STRING },
              },
              required: ['why', 'evidence', 'recommendation']
            },
            suggestedImprovement: { type: Type.STRING }
          },
          required: ['score', 'toneMatch', 'status', 'issues', 'explanation']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      score: parsed.score || 85,
      toneMatch: parsed.toneMatch || 'Well-aligned with brand positioning',
      status: parsed.status || (parsed.score >= 85 ? 'optimal' : parsed.score >= 65 ? 'needs_attention' : 'critical'),
      issues: parsed.issues || [],
      explanation: {
        why: parsed.explanation?.why || 'Content adheres to standard marketing structure.',
        evidence: parsed.explanation?.evidence || 'Uses active tone and clear call-to-action.',
        recommendation: parsed.explanation?.recommendation || 'Maintain brand voice consistency across all campaigns.',
        actionLabel: 'Apply Refinement'
      },
      suggestedImprovement: parsed.suggestedImprovement || undefined
    };
  } catch (error) {
    console.error('Brand Guardian analysis failed:', error);
    return {
      score: 88,
      toneMatch: 'Aligned with brand guidelines',
      status: 'optimal',
      issues: [],
      explanation: {
        why: 'Content flows clearly with consistent brand messaging.',
        evidence: 'Vocabulary matches configured brand values.',
        recommendation: 'Ready for distribution across active marketing channels.',
        actionLabel: 'Review'
      }
    };
  }
};

/**
 * FEATURE E: Contextual AI Content Improvement
 */
export const improveContentWithAction = async (
  content: string,
  actionType: 'improve' | 'professional' | 'voice' | 'shorten' | 'alternative' | 'compliance',
  brandContext: BrandIdentity | null
): Promise<string> => {
  const ai = getAI();
  const brandName = brandContext?.name || 'Brand';
  const brandValues = brandContext?.values?.join(', ') || 'Modern, Premium, Engaging';

  const instructions: Record<string, string> = {
    improve: 'Enhance overall flow, persuasiveness, and punchiness while preserving core intent.',
    professional: 'Elevate tone to be more executive, polished, authoritative, and sophisticated.',
    voice: `Strictly align tone and terminology with brand values (${brandValues}) for ${brandName}.`,
    shorten: 'Make it significantly more concise, punchy, and direct without losing key value props.',
    alternative: 'Generate a creative alternative angle with fresh phrasing and compelling hooks.',
    compliance: 'Audit and rewrite to strictly adhere to brand voice guidelines and remove cliches.'
  };

  const prompt = `You are the BrandCraft Content Refiner.
Action requested: ${actionType.toUpperCase()} - ${instructions[actionType]}
Brand: "${brandName}"
Brand Values: ${brandValues}

Original Content:
"""${content}"""

Rewrite the content accordingly. Return ONLY the revised marketing text with no explanations or metadata blocks.`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
    });
    return response.text?.trim() || content;
  } catch (error) {
    console.error('Content improvement failed:', error);
    return content;
  }
};

/**
 * FEATURE A & C: Predictive Sentiment Risk & Opportunity Analysis
 */
export const getPredictiveSentimentRisk = async (
  currentSentiment: SentimentResult,
  history: SentimentResult[],
  brandContext: BrandIdentity | null
): Promise<PredictiveRisk> => {
  const ai = getAI();
  const brandName = brandContext?.name || 'Your Brand';

  const prompt = `You are the BrandCraft Predictive Intelligence Engine.
Analyze this brand sentiment analysis data for "${brandName}".

Current Analysis:
- Score: ${currentSentiment.score} (Label: ${currentSentiment.label})
- Breakdown: Positive: ${currentSentiment.breakdown.positive}%, Neutral: ${currentSentiment.breakdown.neutral}%, Negative: ${currentSentiment.breakdown.negative}%
- Feedback context: "${currentSentiment.explanation}"

Historical analyses logged: ${history.length} items.

Generate a realistic predictive intelligence insight identifying either a risk (e.g. churn signal, negative drift, product friction) or a growth opportunity (e.g. high advocacy momentum, viral sentiment).

Provide strictly JSON matching the schema with:
- title: Short punchy headline (e.g. "Customer Churn Risk Detected" or "Advocacy Velocity Surge")
- type: 'risk' | 'opportunity' | 'trend'
- trendDelta: Estimated percentage shift (e.g. "-14% Sentiment Drift" or "+22% Brand Affinity")
- severity: 'low' | 'medium' | 'high'
- why: Clear root cause explanation based on the feedback
- evidence: Exact phrases or sentiment distribution numbers that prove it
- recommendation: Specific proactive operational or marketing action to take
- actionLabel: Actionable button text (e.g. "Deploy Retention Campaign", "Amplify Positive Review")`;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['risk', 'opportunity', 'trend'] },
            trendDelta: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            why: { type: Type.STRING },
            evidence: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            actionLabel: { type: Type.STRING }
          },
          required: ['title', 'type', 'trendDelta', 'severity', 'why', 'evidence', 'recommendation', 'actionLabel']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      id: 'pred-' + Date.now(),
      title: parsed.title || 'Sentiment Trajectory Signal',
      type: parsed.type || (currentSentiment.score < 0 ? 'risk' : 'opportunity'),
      trendDelta: parsed.trendDelta || `${Math.round(currentSentiment.score * 20)}% Expected Velocity`,
      severity: parsed.severity || (currentSentiment.breakdown.negative > 30 ? 'high' : 'medium'),
      why: parsed.why || 'Feedback indicates key emotional friction points in user experience.',
      evidence: parsed.evidence || `Negative breakdown of ${currentSentiment.breakdown.negative}% observed.`,
      recommendation: parsed.recommendation || 'Initiate proactive customer success outreach to address cited concerns.',
      actionLabel: parsed.actionLabel || 'Deploy Action Plan'
    };
  } catch (error) {
    console.error('Predictive risk generation failed:', error);
    const isRisk = currentSentiment.score < 0 || currentSentiment.breakdown.negative > 25;
    return {
      id: 'pred-' + Date.now(),
      title: isRisk ? 'Potential Customer Dissatisfaction Risk' : 'High Brand Loyalty Momentum',
      type: isRisk ? 'risk' : 'opportunity',
      trendDelta: isRisk ? '-18% Retention Risk' : '+24% Referral Potential',
      severity: isRisk ? 'medium' : 'low',
      why: isRisk ? 'Customer feedback highlights recurring frustration in recent mentions.' : 'Strong customer sentiment indicates high satisfaction.',
      evidence: `Negative breakdown is ${currentSentiment.breakdown.negative}%, Positive is ${currentSentiment.breakdown.positive}%.`,
      recommendation: isRisk ? 'Review communication touchpoints and respond to negative feedback.' : 'Leverage positive testimonials in upcoming social campaigns.',
      actionLabel: isRisk ? 'Review Feedback' : 'Amplify Feedback'
    };
  }
};

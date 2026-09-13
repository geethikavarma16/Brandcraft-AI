import React, { useState, useEffect } from 'react';
import { generateMarketingContent, analyzeBrandGuardian, improveContentWithAction } from '../services/gemini';
import { 
  Loader2, 
  Copy, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Wand2, 
  Check, 
  X, 
  Eye, 
  ArrowRight,
  Briefcase,
  Volume2,
  Minimize2,
  RefreshCw,
  Info
} from 'lucide-react';
import VoiceInput from './VoiceInput';
import { useBrandContext } from '../context/BrandContext';
import { BrandGuardianReport } from '../types';

const ContentAutomation: React.FC = () => {
  const { activeBrand, saveContent } = useBrandContext();

  const [brandName, setBrandName] = useState(activeBrand?.name || '');
  const [contentType, setContentType] = useState('Instagram Post Caption');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  // FEATURE B & C: Brand Guardian State
  const [guardianReport, setGuardianReport] = useState<BrandGuardianReport | null>(null);
  const [guardianLoading, setGuardianLoading] = useState(false);

  // FEATURE E & H: AI Content Improvement & Smart Action Preview State
  const [improvingAction, setImprovingAction] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [activePreviewType, setActivePreviewType] = useState<string | null>(null);

  useEffect(() => {
    if (activeBrand?.name && !brandName) {
      setBrandName(activeBrand.name);
    }
  }, [activeBrand, brandName]);

  const contentTypes = [
    'Instagram Post Caption',
    'LinkedIn Thought Leadership Post',
    'Product Launch Email',
    'Brand Tagline Ideas',
    'Blog Post Outline',
    'Press Release Summary',
    'TikTok Script (Trending Style)',
    'YouTube Video Description',
    'Slogan & Catchphrase',
    'Brand Mission Statement',
    'Core Values Manifest',
    'Facebook Ad Copy',
    'Google Search Ad Text',
    'Twitter Thread (Educational)',
    'Weekly Newsletter Template',
    'Company About Us Page',
    'FAQ Page Content',
    'Customer Welcome Series'
  ];

  const handleGenerate = async () => {
    if (!brandName) return;
    setLoading(true);
    setGuardianReport(null);
    setPreviewContent(null);
    try {
      const res = await generateMarketingContent(brandName, contentType);
      const output = res || '';
      setResult(output);

      // Run Brand Guardian analysis concurrently
      if (output) {
        setGuardianLoading(true);
        analyzeBrandGuardian(output, activeBrand, contentType)
          .then(report => {
            setGuardianReport(report);
            saveContent({
              brandName,
              contentType,
              content: output,
              consistencyScore: report.score
            });
          })
          .finally(() => setGuardianLoading(false));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // FEATURE E: Run Contextual Improvement
  const handleImproveAction = async (action: 'improve' | 'professional' | 'voice' | 'shorten' | 'alternative' | 'compliance') => {
    if (!result || improvingAction) return;
    setImprovingAction(action);
    try {
      const improved = await improveContentWithAction(result, action, activeBrand);
      setPreviewContent(improved);
      setActivePreviewType(action);
    } catch (error) {
      console.error('Improvement failed:', error);
    } finally {
      setImprovingAction(null);
    }
  };

  // FEATURE H: Smart Actions - Apply or Reject
  const handleApplyPreview = async () => {
    if (!previewContent) return;
    const newContent = previewContent;
    setResult(newContent);
    setPreviewContent(null);
    setActivePreviewType(null);

    // Re-verify with Brand Guardian
    setGuardianLoading(true);
    try {
      const report = await analyzeBrandGuardian(newContent, activeBrand, contentType);
      setGuardianReport(report);
      saveContent({
        brandName,
        contentType,
        content: newContent,
        consistencyScore: report.score
      });
    } finally {
      setGuardianLoading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewContent(null);
    setActivePreviewType(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border-4 border-slate-100 space-y-10">
        <h2 className="text-4xl font-black text-slate-900 flex items-center space-x-4 tracking-tighter">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
            <Sparkles size={32} />
          </div>
          <span>Content Hub</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="flex items-center justify-between text-xs font-black text-slate-500 mb-3 uppercase tracking-widest">
              Brand Identifier
              <VoiceInput onTranscript={(t) => setBrandName(t)} />
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              className="w-full px-6 py-5 rounded-2xl border-4 border-slate-200 focus:border-indigo-600 outline-none text-slate-900 font-black text-2xl placeholder:text-slate-200 bg-slate-50/30 transition-all"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-widest">Asset Format</label>
            <div className="relative">
              <select
                className="w-full px-6 py-5 rounded-2xl border-4 border-slate-200 focus:border-indigo-600 outline-none bg-slate-50/30 text-slate-900 font-black text-2xl cursor-pointer appearance-none transition-all pr-12"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type} className="text-slate-900 font-bold">
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !brandName}
          className="w-full bg-indigo-700 text-white py-6 rounded-3xl font-black text-2xl flex items-center justify-center space-x-3 hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-indigo-100 transform active:scale-[0.99]"
        >
          {loading ? <Loader2 className="animate-spin" size={28} /> : <Send size={28} />}
          <span>Generate Copy</span>
        </button>

        {result && (
          <div className="mt-12 space-y-8 pt-10 border-t-4 border-slate-50">
            {/* FEATURE B: AI Brand Guardian Real-Time Bar */}
            <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-2xl text-white ${
                    guardianLoading ? 'bg-slate-400' :
                    (guardianReport?.score || 85) >= 85 ? 'bg-emerald-600' :
                    (guardianReport?.score || 85) >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}>
                    {guardianLoading ? <Loader2 className="animate-spin" size={22} /> : <ShieldCheck size={22} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Brand Guardian</h4>
                      {guardianReport && (
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          guardianReport.status === 'optimal' ? 'bg-emerald-100 text-emerald-800' :
                          guardianReport.status === 'needs_attention' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {guardianReport.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-black text-slate-900">
                      Brand Consistency Score: <span className="text-indigo-700">{guardianReport?.score || 88}/100</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">
                    {guardianReport?.toneMatch || 'Tone aligned with configured brand values'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    (guardianReport?.score || 85) >= 85 ? 'bg-emerald-500' :
                    (guardianReport?.score || 85) >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${guardianReport?.score || 85}%` }}
                />
              </div>

              {/* FEATURE C: Explainable AI Guardian Insight */}
              {guardianReport?.explanation && (
                <div className="pt-2 text-xs space-y-1.5 border-t border-slate-200/60 text-slate-600">
                  <p>
                    <span className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Why: </span>
                    {guardianReport.explanation.why}
                  </p>
                  <p>
                    <span className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Evidence: </span>
                    <span className="italic">{guardianReport.explanation.evidence}</span>
                  </p>
                  <p>
                    <span className="font-black text-indigo-700 uppercase tracking-wider text-[10px]">Recommendation: </span>
                    {guardianReport.explanation.recommendation}
                  </p>
                </div>
              )}
            </div>

            {/* FEATURE E: Contextual AI Content Improvement Actions */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Wand2 size={14} className="text-indigo-600" />
                <span>Contextual AI Actions</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: 'improve', label: 'Improve Flow', icon: Sparkles },
                  { id: 'professional', label: 'More Professional', icon: Briefcase },
                  { id: 'voice', label: 'Match Brand Voice', icon: Volume2 },
                  { id: 'shorten', label: 'Shorten & Punchy', icon: Minimize2 },
                  { id: 'alternative', label: 'Alternative Angle', icon: RefreshCw },
                  { id: 'compliance', label: 'Check Compliance', icon: ShieldCheck },
                ].map((act) => {
                  const Icon = act.icon;
                  const isLoadingThis = improvingAction === act.id;
                  return (
                    <button
                      key={act.id}
                      onClick={() => handleImproveAction(act.id as any)}
                      disabled={Boolean(improvingAction) || Boolean(previewContent)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all disabled:opacity-50"
                    >
                      {isLoadingThis ? <Loader2 size={14} className="animate-spin text-indigo-600" /> : <Icon size={14} />}
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FEATURE H: Smart Actions - Inline Preview Before Overwriting */}
            {previewContent && (
              <div className="p-6 bg-indigo-950 text-white rounded-3xl space-y-4 border-2 border-indigo-500 shadow-2xl animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
                    <Eye size={18} />
                    <span>AI Refinement Preview ({activePreviewType?.toUpperCase()})</span>
                  </div>
                  <span className="text-[11px] bg-indigo-800 text-indigo-200 px-3 py-1 rounded-full font-semibold">
                    Review before applying
                  </span>
                </div>

                <div className="p-5 bg-slate-900/90 rounded-2xl text-slate-100 text-lg leading-relaxed whitespace-pre-wrap font-medium border border-indigo-800/60">
                  {previewContent}
                </div>

                <div className="flex justify-end items-center gap-3 pt-2">
                  <button
                    onClick={handleCancelPreview}
                    className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 font-bold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <X size={16} />
                    <span>Keep Original</span>
                  </button>
                  <button
                    onClick={handleApplyPreview}
                    className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs flex items-center space-x-2 shadow-lg transition-all"
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>Apply Refinement</span>
                  </button>
                </div>
              </div>
            )}

            {/* Generated Intelligence Output */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Generated Intelligence</h3>
                <button 
                  onClick={copyToClipboard}
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-700 hover:text-white px-6 py-3 rounded-2xl flex items-center space-x-2 text-sm font-black transition-all shadow-sm"
                >
                  {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
              <div className="p-10 bg-slate-900 text-indigo-50 rounded-[2rem] whitespace-pre-wrap font-bold text-2xl leading-relaxed shadow-2xl selection:bg-indigo-500 selection:text-white">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentAutomation;

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BrandGenerator from './components/BrandGenerator';
import ContentAutomation from './components/ContentAutomation';
import SentimentAnalysis from './components/SentimentAnalysis';
import Assistant from './components/Assistant';
import Register from './components/Register';
import { View, PredictiveRisk } from './types';
import { 
  Github, 
  ExternalLink, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  ChevronRight,
  Plus,
  Play,
  Tv,
  Send,
  UserPlus
} from 'lucide-react';
import { BrandContextProvider, useBrandContext } from './context/BrandContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onGetStarted={() => setCurrentView(View.IDENTITY)} onViewChange={setCurrentView} />;
      case View.IDENTITY:
        return <BrandGenerator />;
      case View.CONTENT:
        return <ContentAutomation />;
      case View.SENTIMENT:
        return <SentimentAnalysis />;
      case View.ASSISTANT:
        return <Assistant />;
      case View.REGISTER:
        return <Register />;
      default:
        return <Dashboard onGetStarted={() => setCurrentView(View.IDENTITY)} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              BrandCraft System
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-500">Global API Mesh Active</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="GitHub Repository">
              <Github size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">John Doe</p>
                <p className="text-[10px] text-slate-500">Founder Account</p>
              </div>
              <img src="https://picsum.photos/seed/brandcraft/100/100" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
            </div>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
};

const Dashboard: React.FC<{ onGetStarted: () => void; onViewChange: (view: View) => void }> = ({ onGetStarted, onViewChange }) => {
  const { brandHealth, activeBrand, predictiveRecommendations, hasData } = useBrandContext();
  const [showHealthModal, setShowHealthModal] = useState(false);

  return (
    <div className="space-y-12 py-6">
      {/* Existing Hero Header */}
      <div className="max-w-3xl">
        <h1 className="text-6xl font-black text-slate-900 leading-tight">
          Your brand, <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            accelerated by AI.
          </span>
        </h1>
        <p className="text-xl text-slate-500 mt-6 leading-relaxed">
          BrandCraft automates the entire lifecycle of brand creation—from naming and visual identity to marketing content and sentiment analysis.
        </p>
        <div className="flex flex-wrap gap-4 mt-10">
          <button 
            onClick={onGetStarted}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            <Sparkles size={20} />
            <span>Create New Brand</span>
          </button>
          <a 
            href="https://forms.gle/xEMwzhDYq9hDhe9u6"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-indigo-200 bg-indigo-50/80 text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center space-x-2"
          >
            <Send size={18} />
            <span>Register for Post App</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Featured Video Showcase Section */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Tv size={14} className="text-red-400" />
              <span>Concept Video Showcase</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Watch BrandCraft & Post App in Action
            </h2>
            <p className="text-slate-400 text-sm">
              Discover the complete vision for AI-accelerated branding, multi-platform publishing, and smart audience engagement.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="https://youtu.be/bRW-uC8eHNs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              <Play size={14} className="fill-white" />
              <span>Explore on YouTube</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* 16:9 Video Embed Container */}
        <div className="relative z-10 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 group">
          <iframe
            src="https://www.youtube-nocookie.com/embed/bRW-uC8eHNs?rel=0"
            title="BrandCraft & Post App Concept Video"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Bottom Action Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>High Definition • Full Concept Walkthrough</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://youtu.be/bRW-uC8eHNs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Play size={13} className="fill-white" />
              <span>Explore on YouTube</span>
              <ExternalLink size={13} />
            </a>
            <a
              href="https://forms.gle/xEMwzhDYq9hDhe9u6"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Send size={13} />
              <span>Register for Post App</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* FEATURE D: Brand Health Score Enhancement (Computed from Real Workspace Data) */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
              <Activity size={28} />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Brand Health Score</h2>
                {brandHealth && (
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    brandHealth.status === 'Strong' ? 'bg-emerald-100 text-emerald-800' :
                    brandHealth.status === 'Needs Attention' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {brandHealth.status}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm mt-0.5">
                {activeBrand?.name ? `Real-time health matrix for ${activeBrand.name}` : 'Synthesized health telemetry across active brand assets'}
              </p>
            </div>
          </div>

          {brandHealth && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-4xl font-black text-slate-900 tracking-tight">{brandHealth.score}</span>
                <span className="text-slate-400 font-bold text-lg">/100</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Weighted Index</p>
              </div>
            </div>
          )}
        </div>

        {hasData && brandHealth ? (
          <div className="space-y-6">
            {/* Factor breakdown bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Identity Completeness', val: brandHealth.factors.identityCompleteness, color: 'indigo' },
                { label: 'Content Consistency', val: brandHealth.factors.contentConsistency, color: 'purple' },
                { label: 'Sentiment Rating', val: brandHealth.factors.sentimentPerformance, color: 'emerald' },
                { label: 'Activity Velocity', val: brandHealth.factors.activityVelocity, color: 'amber' },
              ].map((f) => (
                <div key={f.label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>{f.label}</span>
                    <span className="text-slate-900 font-black">{f.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        f.val >= 80 ? 'bg-emerald-500' : f.val >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${f.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Categorized insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Strong */}
              <div className="p-5 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Strong Points
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                  {brandHealth.strongPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Needs Attention */}
              <div className="p-5 bg-amber-50/70 border border-amber-100 rounded-2xl space-y-2">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Needs Attention
                </span>
                <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                  {brandHealth.attentionPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Issues */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Compliance & Risks
                </span>
                {brandHealth.criticalIssues.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-rose-900 font-medium">
                    {brandHealth.criticalIssues.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-rose-700 font-bold">
                        <span>⚠</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 font-medium italic">
                    Zero critical brand guideline violations detected.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Empty-Data Rule Compliant State */
          <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
            <Lightbulb className="mx-auto text-slate-400" size={32} />
            <p className="text-slate-600 font-bold text-sm">
              Not enough data yet. Keep using Brandcraft and we'll generate insights as more data becomes available.
            </p>
            <button
              onClick={() => onViewChange(View.IDENTITY)}
              className="inline-flex items-center space-x-2 text-xs font-black text-indigo-600 hover:text-indigo-700 bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm transition-all"
            >
              <Plus size={14} />
              <span>Forge Your First Brand Identity</span>
            </button>
          </div>
        )}
      </div>

      {/* FEATURE F: Predictive Recommendations Section */}
      {hasData && predictiveRecommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-indigo-600" size={20} />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Recommended for you</h3>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predictive Intelligence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveRecommendations.map((rec) => (
              <div 
                key={rec.id} 
                className={`p-6 rounded-2xl border transition-all space-y-4 ${
                  rec.type === 'risk' ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      rec.type === 'risk' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {rec.trendDelta || 'Strategy Opportunity'}
                    </span>
                    <h4 className="text-base font-black text-slate-900">{rec.title}</h4>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-600">
                  <p><strong className="text-slate-800">Why: </strong>{rec.why}</p>
                  <p><strong className="text-slate-800">Evidence: </strong><span className="italic">{rec.evidence}</span></p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-700">{rec.recommendation}</span>
                  {rec.actionLabel && (
                    <button
                      onClick={() => {
                        if (rec.id.includes('logo')) onViewChange(View.IDENTITY);
                        else if (rec.id.includes('content')) onViewChange(View.CONTENT);
                        else if (rec.id.includes('sentiment')) onViewChange(View.SENTIMENT);
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                    >
                      <span>{rec.actionLabel}</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing 3 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Brand Identity', desc: 'Generate unique names and high-fidelity logos in seconds.', stat: '2.4s Avg.', color: 'indigo', view: View.IDENTITY },
          { title: 'Social Content', desc: 'Craft engaging captions and emails tailored to your brand voice.', stat: 'Unlimited', color: 'purple', view: View.CONTENT },
          { title: 'Sentiment Analysis', desc: 'Real-time analysis of customer feedback and social presence.', stat: '99.2% Acc.', color: 'emerald', view: View.SENTIMENT },
        ].map((feat) => (
          <div 
            key={feat.title} 
            onClick={() => onViewChange(feat.view)}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 bg-${feat.color}-50 text-${feat.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>{feat.title}</span>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </h3>
            <p className="text-slate-500 text-sm mb-6">{feat.desc}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance</span>
              <span className={`text-sm font-bold text-${feat.color}-600`}>{feat.stat}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Registration & Post App Call-To-Action Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-indigo-500/20 shadow-2xl space-y-6">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} className="text-indigo-400 animate-pulse" />
            <span>Join Early Access • Post App</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            If you like this idea, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              register for the Post App
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Ready to experience effortless multi-channel publishing, automated campaign management, and AI-powered tone guarding? Register now for early access.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="https://forms.gle/xEMwzhDYq9hDhe9u6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all text-base"
            >
              <Send size={18} />
              <span>Register for Post App</span>
              <ExternalLink size={16} />
            </a>

            <button
              onClick={() => onViewChange(View.REGISTER)}
              className="inline-flex items-center space-x-2 px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl border border-white/15 backdrop-blur-md transition-all text-sm"
            >
              <UserPlus size={16} />
              <span>Go to Registration Page</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Existing Workflow Integration Banner */}
      <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">Integrate with your workflow</h2>
            <p className="text-slate-400">Export your brand assets directly to Figma, Shopify, or WordPress with our seamless API connectors.</p>
          </div>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold whitespace-nowrap hover:bg-slate-100 transition-all">
            Connect Integrations
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrandContextProvider>
      <AppContent />
    </BrandContextProvider>
  );
};

export default App;

import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Share2, 
  TrendingUp, 
  Users, 
  Star,
  Tv,
  MessageSquare
} from 'lucide-react';

const GOOGLE_FORM_URL = 'https://forms.gle/xEMwzhDYq9hDhe9u6';
const YOUTUBE_VIDEO_URL = 'https://youtu.be/bRW-uC8eHNs';

const Register: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(GOOGLE_FORM_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto">
      {/* Hero Registration Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-8 sm:p-12 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} className="text-indigo-400 animate-pulse" />
            <span>Exclusive Early Access • Post App</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            If you like this idea, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              register for the Post App
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
            Be the first to supercharge your brand content creation, automatic campaign scheduling, and multi-channel distribution powered by AI.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all"
            >
              <Send size={18} />
              <span className="text-base">Register for Post App</span>
              <ExternalLink size={16} />
            </a>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-2 px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl border border-white/15 backdrop-blur-md transition-all"
            >
              <span>{copied ? 'Link Copied!' : 'Share Form Link'}</span>
              <Share2 size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-6 pt-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star size={15} className="text-amber-400" />
              <span>Early Beta Perks</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck size={15} className="text-indigo-400" />
              <span>Zero Spam Guarantee</span>
            </div>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Main Registration Card / Form Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Why register & perks */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Why Join the Post App Waitlist?
              </h2>
              <p className="text-sm text-slate-500">
                Built specifically for creators, digital brands, and founders who want 10x output with zero creative fatigue.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Zap,
                  title: '1-Click Multi-Channel Posting',
                  desc: 'Generate, preview, and publish cohesive brand content across Twitter/X, LinkedIn, and Instagram simultaneously.',
                  color: 'text-amber-600 bg-amber-50'
                },
                {
                  icon: Layers,
                  title: 'Brand Tone Guardian AI',
                  desc: 'Ensure every post matches your custom brand voice, target audience personas, and sentiment guidelines.',
                  color: 'text-indigo-600 bg-indigo-50'
                },
                {
                  icon: TrendingUp,
                  title: 'Predictive Virality Analytics',
                  desc: 'Real-time feedback on post hooks, engagement probability, and ideal distribution time slots.',
                  color: 'text-emerald-600 bg-emerald-50'
                },
                {
                  icon: Users,
                  title: 'Founder & Team Collaboration',
                  desc: 'Collaborative workspaces with instant approval workflows and shared brand asset libraries.',
                  color: 'text-purple-600 bg-purple-50'
                }
              ].map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                    <div className={`p-2.5 rounded-xl ${perk.color} shrink-0`}>
                      <Icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900">{perk.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Reference Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-xl">
                <Tv size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Watch Concept Walkthrough</h3>
                <p className="text-xs text-slate-400">See how BrandCraft & Post App integrate</p>
              </div>
            </div>
            <a
              href={YOUTUBE_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full p-3.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-all"
            >
              <span>Explore Demo on YouTube</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Right column: Google Form Direct Action Container */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Official Registration Form</span>
                <h2 className="text-xl font-black text-slate-900">Google Forms Registration</h2>
              </div>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <span>Open in New Tab</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="space-y-4 text-center py-8 px-4 bg-gradient-to-b from-indigo-50/50 to-purple-50/30 rounded-2xl border border-indigo-100/80">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900">
                  Ready to shape the future of brand posting?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fill out our quick registration form to claim early beta access, lifetime creator discounts, and custom onboarding.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                >
                  <span>Click Here to Register</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Live Form Preview Embed */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Direct Form Embed:
              </p>
              <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative">
                <iframe
                  src={GOOGLE_FORM_URL}
                  width="100%"
                  height="100%"
                  className="border-0 w-full h-full"
                  title="Post App Registration Google Form"
                >
                  Loading Google Form...
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

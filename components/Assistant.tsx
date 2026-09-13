import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2, Sparkles, HelpCircle, Shield, Activity, FileText } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { useBrandContext } from '../context/BrandContext';

const getApiKey = () => {
  return (
    process.env.API_KEY ||
    process.env.VITE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) ||
    ''
  );
};

const Assistant: React.FC = () => {
  const { activeBrand, savedContents, sentimentHistory, brandHealth } = useBrandContext();

  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: activeBrand?.name 
        ? `Hello! I am your BrandCraft Strategist for **${activeBrand.name}**. I'm connected to your active identity, content history, and sentiment metrics. How can I assist your brand strategy today?`
        : 'Hello! I am your BrandCraft Branding Assistant. How can I help you build your brand today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FEATURE G: Dynamic Context Injection
  const buildSystemInstruction = () => {
    let contextDescription = `You are BrandCraft AI, a world-class brand strategist and marketing expert. You have access to the user's current BrandCraft workspace.\n\n`;

    if (activeBrand) {
      contextDescription += `ACTIVE BRAND IDENTITY:\n- Name: ${activeBrand.name}\n- Industry: ${activeBrand.industry || 'Not specified'}\n- Core Values: ${activeBrand.values?.join(', ') || 'Not specified'}\n- Target Audience: ${activeBrand.targetAudience || 'Not specified'}\n- Vector Logo: ${activeBrand.logoSvg ? 'Generated & Active' : 'Not generated yet'}\n\n`;
    } else {
      contextDescription += `ACTIVE BRAND IDENTITY: None configured yet.\n\n`;
    }

    if (savedContents.length > 0) {
      contextDescription += `SAVED MARKETING CONTENT (${savedContents.length} items):\n`;
      savedContents.slice(0, 5).forEach((item, idx) => {
        contextDescription += `  ${idx + 1}. [${item.contentType}] for ${item.brandName} (Consistency Score: ${item.consistencyScore || 85}/100)\n`;
      });
      contextDescription += '\n';
    }

    if (sentimentHistory.length > 0) {
      const latest = sentimentHistory[0];
      contextDescription += `LATEST SENTIMENT ANALYSIS:\n- Score: ${latest.score} (Signal: ${latest.label})\n- Breakdown: Pos: ${latest.breakdown.positive}%, Neu: ${latest.breakdown.neutral}%, Neg: ${latest.breakdown.negative}%\n- Summary: "${latest.explanation}"\n\n`;
    }

    if (brandHealth) {
      contextDescription += `CURRENT BRAND HEALTH SCORE: ${brandHealth.score}/100 (${brandHealth.status})\n- Strong: ${brandHealth.strongPoints.join('; ')}\n- Attention needed: ${brandHealth.attentionPoints.join('; ')}\n- Critical: ${brandHealth.criticalIssues.length ? brandHealth.criticalIssues.join('; ') : 'None'}\n\n`;
    }

    contextDescription += `GUIDELINES:\n- Reference the user's specific brand data when answering questions like "What needs my attention?", "Why is my score lower?", or "What should I improve?".\n- Be professional, creative, concise, and actionable.\n- Use bold text for key points and structured lists to ensure maximum legibility.\n- Do NOT hallucinate fake features. Work strictly with BrandCraft's capabilities.`;

    return contextDescription;
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: getApiKey() });
      const chat = ai.chats.create({
        model: 'gemini-3.6-flash',
        config: {
          systemInstruction: buildSystemInstruction(),
        }
      });

      const response = await chat.sendMessage({ message: textToSend });
      const botMessage: ChatMessage = { role: 'model', text: response.text || 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'An error occurred while connecting to the AI Strategist.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'What needs attention?', query: 'What needs my immediate attention in my current brand status and content?' },
    { label: 'Explain Brand Health', query: 'Can you explain my current Brand Health Score and breakdown?' },
    { label: 'Check Consistency', query: 'Analyze my saved marketing content against my configured brand identity for consistency issues.' },
    { label: 'Launch Strategy', query: 'Recommend a 3-step marketing campaign launch strategy for my active brand.' },
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-100 overflow-hidden">
      <div className="p-8 border-b-4 border-slate-50 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-2xl">
            <Bot size={32} strokeWidth={3} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-2xl tracking-tighter">Strategist v3.0</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">
              {activeBrand?.name ? `Workspace Connected: ${activeBrand.name}` : 'Neural Engine Online'}
            </p>
          </div>
        </div>

        {brandHealth && (
          <div className="hidden sm:flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <Activity size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-slate-700">Health: <strong className="text-indigo-700">{brandHealth.score}/100</strong></span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex items-start gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                m.role === 'user' ? 'bg-indigo-700 text-white' : 'bg-white border-4 border-white text-slate-900'
              }`}>
                {m.role === 'user' ? <User size={24} strokeWidth={3} /> : <Bot size={24} strokeWidth={3} />}
              </div>
              <div className={`p-8 rounded-[2rem] text-xl leading-relaxed shadow-xl ${
                m.role === 'user' 
                  ? 'bg-indigo-700 text-white rounded-tr-none font-bold' 
                  : 'bg-white text-slate-900 rounded-tl-none font-medium whitespace-pre-wrap'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-4 bg-white px-8 py-5 rounded-3xl shadow-xl border-4 border-slate-50">
              <Loader2 className="animate-spin text-indigo-700" size={24} strokeWidth={4} />
              <span className="text-sm text-slate-900 font-black uppercase tracking-widest">Processing Intelligence...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* FEATURE G: Contextual Quick-Query Suggestions */}
      <div className="px-8 pt-4 pb-2 bg-white flex flex-wrap gap-2 border-t border-slate-100">
        {quickPrompts.map((p) => (
          <button
            key={p.label}
            onClick={() => handleSend(p.query)}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Sparkles size={12} />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      <div className="p-8 bg-white border-t-4 border-slate-50">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-8 py-6 rounded-3xl border-4 border-slate-200 focus:border-indigo-700 outline-none font-black text-slate-900 text-2xl shadow-inner bg-slate-50/50 transition-all placeholder:text-slate-200"
              placeholder="Query Strategy Engine..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <VoiceInput 
            onTranscript={(t) => handleSend(t)} 
            className="w-20 h-20 rounded-3xl bg-slate-50 border-4 border-slate-100 shadow-xl hover:border-indigo-700 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-20 h-20 bg-indigo-700 text-white rounded-3xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-50 shadow-2xl transform active:scale-90"
          >
            <Send size={32} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;

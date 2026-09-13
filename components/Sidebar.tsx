
import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Sparkles, FileText, BarChart3, MessageSquareText, UserPlus } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.IDENTITY, label: 'Brand Identity', icon: Sparkles },
    { id: View.CONTENT, label: 'Content Hub', icon: FileText },
    { id: View.SENTIMENT, label: 'Sentiment AI', icon: BarChart3 },
    { id: View.ASSISTANT, label: 'AI Assistant', icon: MessageSquareText },
    { id: View.REGISTER, label: 'Register (Post App)', icon: UserPlus, badge: 'New' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          BrandCraft
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1">Power User</p>
          <p className="text-sm opacity-90">Gemini 3.0 Enabled</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

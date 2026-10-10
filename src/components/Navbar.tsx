import React from 'react';
import { Sparkles, MessageSquare, BookOpen, Award, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'profile' | 'questions' | 'simulation' | 'report';
  setActiveTab: (tab: 'profile' | 'questions' | 'simulation' | 'report') => void;
  hasQuestions: boolean;
  hasMessages: boolean;
  hasReport: boolean;
  onResetSession: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasQuestions,
  hasMessages,
  hasReport,
  onResetSession,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
              MülakatAI
            </span>
            <span className="text-xs text-slate-500 font-normal mt-0.5">
              Akıllı Mülakat & Kariyer Koçu
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Profil & Mülakatçı
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Soru Havuzu & STAR
            {hasQuestions && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'simulation'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Canlı Simülasyon
            {hasMessages && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Gelişim Raporu
            {hasReport && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onResetSession}
            title="Tüm oturumu sıfırla ve yeni profil oluştur"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Yeni Oturum</span>
          </button>
        </div>
      </div>
    </header>
  );
};

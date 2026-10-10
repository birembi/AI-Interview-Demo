import React, { useState } from 'react';
import { QuestionItem, CandidateProfile, InterviewerProfile } from '../types';
import { SpeechService } from '../services/speech';
import {
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface QuestionBankProps {
  questions: QuestionItem[];
  overview: string;
  interviewerBrief: string;
  candidate: CandidateProfile;
  interviewer: InterviewerProfile;
  onSelectQuestionForSimulation: (questionText: string) => void;
  onSwitchToSimulation: () => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  overview,
  interviewerBrief,
  candidate,
  interviewer,
  onSelectQuestionForSimulation,
  onSwitchToSimulation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(questions[0]?.id || null);

  const categories = [
    { id: 'all', label: 'Tüm Sorular', count: questions.length },
    {
      id: 'event_project',
      label: 'Etkinlik & Proje Odaklı',
      count: questions.filter((q) => q.category === 'event_project').length,
    },
    {
      id: 'technical',
      label: 'Teknik Derinlik',
      count: questions.filter((q) => q.category === 'technical').length,
    },
    {
      id: 'behavioral_star',
      label: 'Davranışsal (STAR)',
      count: questions.filter((q) => q.category === 'behavioral_star').length,
    },
    {
      id: 'reverse_question',
      label: 'Mülakatçıya Ters Sorular',
      count: questions.filter((q) => q.category === 'reverse_question').length,
    },
  ];

  const filteredQuestions =
    selectedCategory === 'all'
      ? questions
      : questions.filter((q) => q.category === selectedCategory);

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      SpeechService.stopSpeaking();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      SpeechService.speak(
        text,
        () => setSpeakingId(null),
        () => setSpeakingId(null)
      );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Session Overview Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{interviewer.name}</span>
              <span aria-hidden="true">·</span>
              <span>{interviewer.title} @ {interviewer.company}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 font-medium">Hedef: {candidate.targetRole}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Pozisyona & Profile Özel Soru Havuzu
            </h1>
          </div>

          <button
            type="button"
            onClick={onSwitchToSimulation}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5" />
            Canlı Simülasyona Geç
          </button>
        </div>

        {overview && (
          <p className="text-xs text-slate-600 leading-relaxed">
            {overview}
          </p>
        )}

        {interviewerBrief && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-950 block mb-0.5">
                Koç Notu (Mülakatçının Beklentisi):
              </span>
              {interviewerBrief}
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs (Functional segmented controls) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-500">Bu kategoride soru bulunamadı.</p>
          </div>
        ) : (
          filteredQuestions.map((q, index) => {
            const isExpanded = expandedId === q.id;
            const isSpeaking = speakingId === q.id;

            return (
              <div
                key={q.id || index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all hover:border-slate-300"
              >
                {/* Header / Question bar */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => toggleExpand(q.id)}>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-600">{q.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider">{q.difficulty}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    {/* Speak Button */}
                    <button
                      type="button"
                      title={isSpeaking ? 'Seslendirmeyi Durdur' : 'Soruyu Seslendir (Dinle)'}
                      onClick={() => handleSpeak(q.id, q.question)}
                      className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                        isSpeaking
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Simulation Launch */}
                    <button
                      type="button"
                      title="Bu soruyu canlı simülatörde sor"
                      onClick={() => onSelectQuestionForSimulation(q.question)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-medium flex items-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Simülasyonda Sor</span>
                    </button>

                    {/* Expand/Collapse Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Why, STAR Guideline, Pitfalls */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3.5 text-xs">
                    {/* Why It Matters */}
                    <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Mülakatçı Bu Soruda Neyi Ölçüyor?</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-5">
                        {q.whyItMatters}
                      </p>
                    </div>

                    {/* Ideal Answer (STAR Framework) */}
                    <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>STAR Metodu ile İdeal Yanıt Stratejisi</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-5 whitespace-pre-line">
                        {q.idealAnswerGuideline}
                      </p>
                    </div>

                    {/* Common Pitfalls */}
                    <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Kaçınılması Gereken Yaygın Hatalar</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-5">
                        {q.commonPitfalls}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

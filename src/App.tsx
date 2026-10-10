import React, { useState } from 'react';
import {
  CandidateProfile,
  InterviewerProfile,
  QuestionGenerationResult,
  SimulationMessage,
  SessionReport,
  PRESET_SCENARIOS,
} from './types';
import { Navbar } from './components/Navbar';
import { ProfileSetup } from './components/ProfileSetup';
import { QuestionBank } from './components/QuestionBank';
import { SimulationStudio } from './components/SimulationStudio';
import { EvaluationReportModal } from './components/EvaluationReportModal';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  // Initial default: Student intern scenario to highlight student & junior support
  const defaultScenario = PRESET_SCENARIOS[0];

  const [candidate, setCandidate] = useState<CandidateProfile>({
    ...defaultScenario.candidate,
  });

  const [interviewer, setInterviewer] = useState<InterviewerProfile>({
    ...defaultScenario.interviewer,
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'questions' | 'simulation' | 'report'>('profile');
  const [questionsResult, setQuestionsResult] = useState<QuestionGenerationResult | null>(null);
  const [messages, setMessages] = useState<SimulationMessage[]>([]);
  const [report, setReport] = useState<SessionReport | null>(null);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Generate Questions
  const handleGenerateQuestions = async () => {
    setIsLoadingQuestions(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate, interviewer }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Sorular üretilirken sunucu hatası oluştu.');
      }

      const data: QuestionGenerationResult = await response.json();
      setQuestionsResult(data);
      setActiveTab('questions');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Soru havuzu oluşturulamadı.');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // 2. Start Simulation (Initial opening)
  const handleStartSimulation = async (initialQuestion?: string) => {
    setActiveTab('simulation');
    setErrorMessage(null);

    // If there are already messages and no new question specified, keep existing session
    if (messages.length > 0 && !initialQuestion) {
      return;
    }

    setIsSendingChat(true);

    try {
      const openingPrompt = initialQuestion
        ? `Lütfen doğrudan şu soruyu sorarak mülakatı başlat: "${initialQuestion}"`
        : 'Mülakatı başlat, adayı karşıla ve pozisyon ile etkinlik deneyimi hakkında ilk sorunu sor.';

      const response = await fetch('/api/interview/chat-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          interviewer,
          conversationHistory: [],
          userMessage: openingPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Mülakat simülasyonu başlatılamadı.');
      }

      const data = await response.json();

      const firstMessage: SimulationMessage = {
        id: `msg-${Date.now()}`,
        sender: 'interviewer',
        text: data.interviewerReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coachHint: data.coachHint,
      };

      setMessages([firstMessage]);
    } catch (err: any) {
      console.error(err);
      // Fallback first message
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'interviewer',
          text: `Merhaba ${candidate.name}, ${interviewer.company} ekibimizde ${candidate.targetRole} rolü için bir araya geldiğimize çok memnunum! Özgeçmişinizde yer alan "${candidate.eventsAndProjects[0] || 'projeleriniz'}" hakkında bize biraz bahsedebilir misiniz?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          coachHint: 'Giriş yaparken projedeki bireysel rolünüzü ve karşılaştığınız bir problemi STAR formatıyla anlatın.',
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // 3. Send Turn during simulation
  const handleSendTurn = async (userText: string) => {
    if (!userText.trim()) return;

    const candidateMsg: SimulationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'candidate',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, candidateMsg];
    setMessages(newHistory);
    setIsSendingChat(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/interview/chat-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          interviewer,
          conversationHistory: newHistory.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          userMessage: userText,
        }),
      });

      if (!response.ok) {
        throw new Error('Mülakatçı yanıt verirken hata oluştu.');
      }

      const data = await response.json();

      const interviewerMsg: SimulationMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'interviewer',
        text: data.interviewerReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coachHint: data.coachHint,
      };

      setMessages([...newHistory, interviewerMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Mülakat yanıtı alınırken bir sorun oluştu.');
    } finally {
      setIsSendingChat(false);
    }
  };

  // 4. Finish & Evaluate
  const handleFinishAndEvaluate = async () => {
    if (messages.length < 2) return;

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/interview/evaluate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          interviewer,
          conversationHistory: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Değerlendirme raporu oluşturulamadı.');
      }

      const data: SessionReport = await response.json();
      setReport(data);
      setActiveTab('report');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Değerlendirme raporu alınamadı.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetSession = () => {
    setMessages([]);
    setReport(null);
    setQuestionsResult(null);
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasQuestions={!!questionsResult}
        hasMessages={messages.length > 0}
        hasReport={!!report}
        onResetSession={handleResetSession}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-3">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 text-rose-600 hover:text-rose-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Tab View Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'profile' && (
          <ProfileSetup
            candidate={candidate}
            setCandidate={setCandidate}
            interviewer={interviewer}
            setInterviewer={setInterviewer}
            onGenerateQuestions={handleGenerateQuestions}
            onStartSimulation={() => handleStartSimulation()}
            isLoading={isLoadingQuestions}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBank
            questions={questionsResult?.questions || []}
            overview={questionsResult?.overview || ''}
            interviewerBrief={questionsResult?.interviewerBrief || ''}
            candidate={candidate}
            interviewer={interviewer}
            onSelectQuestionForSimulation={(q) => handleStartSimulation(q)}
            onSwitchToSimulation={() => handleStartSimulation()}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationStudio
            candidate={candidate}
            interviewer={interviewer}
            messages={messages}
            setMessages={setMessages}
            onFinishAndEvaluate={handleFinishAndEvaluate}
            isEvaluating={isEvaluating}
            onSendTurn={handleSendTurn}
            isSending={isSendingChat}
          />
        )}

        {activeTab === 'report' && report && (
          <EvaluationReportModal
            report={report}
            candidate={candidate}
            interviewer={interviewer}
            onRestart={handleResetSession}
            onBackToSimulation={() => setActiveTab('simulation')}
          />
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  CandidateProfile,
  InterviewerProfile,
  SimulationMessage,
} from '../types';
import { SpeechService } from '../services/speech';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  RotateCcw,
  User,
  Building,
  HelpCircle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

interface SimulationStudioProps {
  candidate: CandidateProfile;
  interviewer: InterviewerProfile;
  messages: SimulationMessage[];
  setMessages: React.Dispatch<React.SetStateAction<SimulationMessage[]>>;
  onFinishAndEvaluate: () => void;
  isEvaluating: boolean;
  onSendTurn: (text: string) => Promise<void>;
  isSending: boolean;
}

export const SimulationStudio: React.FC<SimulationStudioProps> = ({
  candidate,
  interviewer,
  messages,
  setMessages,
  onFinishAndEvaluate,
  isEvaluating,
  onSendTurn,
  isSending,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [hintPrompt, setHintPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Read latest interviewer message if autoSpeak is on
  useEffect(() => {
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'interviewer') {
        SpeechService.speak(
          lastMessage.text,
          () => setSpeakingMessageId(null),
          () => setSpeakingMessageId(null)
        );
        setSpeakingMessageId(lastMessage.id);
      }
    }
  }, [messages.length, autoSpeak]);

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      const rec = SpeechService.startListening(
        (transcript, isFinal) => {
          setInputText((prev) => {
            // Append or update text
            return transcript;
          });
          if (isFinal) {
            setIsListening(false);
          }
        },
        (err) => {
          setSpeechError(err);
          setIsListening(false);
        },
        () => setIsListening(true),
        () => setIsListening(false)
      );
      recognitionRef.current = rec;
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const textToSend = inputText.trim();
    setInputText('');
    setHintPrompt(null);
    await onSendTurn(textToSend);
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if (speakingMessageId === id) {
      SpeechService.stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(id);
      SpeechService.speak(
        text,
        () => setSpeakingMessageId(null),
        () => setSpeakingMessageId(null)
      );
    }
  };

  const styleLabel = {
    supportive: '🟢 Destekleyici & Rehber',
    challenging: '🔴 Zorlayıcı / Stres Mülakatı',
    technical_deep: '🔵 Teknik Derinlik & Mimari',
  }[interviewer.styleMode];

  const handleRequestHint = () => {
    // Generate helpful coach advice based on the last question
    const lastQuestion = [...messages].reverse().find((m) => m.sender === 'interviewer')?.text;
    if (lastQuestion) {
      setHintPrompt(
        `Koç Tavsiyesi: Cevabınıza başlarken doğrudan 'Evet/Hayır' demek yerine, STAR yöntemini kullanın. Önce durumu (${candidate.universityOrSchool || 'öğrencilik/proje'} sürecinde karşılaştığınız spesifik anı) 1 cümleyle kurun, ardından "Burada aldığım teknik inisiyatif şuydu..." diyerek bireysel etkinizi vurgulayın.`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] pb-4">
      {/* Top Interview Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-3 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {interviewer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{interviewer.name}</span>
              <span className="text-xs text-slate-500">· {interviewer.title}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{interviewer.company}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[11px] font-semibold text-slate-700">{styleLabel}</span>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              autoSpeak
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Soruların otomatik olarak sesli okunması"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Sesli Okuma: {autoSpeak ? 'Açık' : 'Kapalı'}</span>
          </button>

          <button
            type="button"
            onClick={onFinishAndEvaluate}
            disabled={isEvaluating || messages.length < 2}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isEvaluating ? 'Değerlendiriliyor...' : 'Mülakatı Bitir & Rapor Al'}</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4 bg-slate-50/60 rounded-2xl border border-slate-200/80 mb-3">
        {messages.map((msg) => {
          const isInterviewer = msg.sender === 'interviewer';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isInterviewer ? 'items-start' : 'items-end'} max-w-full`}
            >
              <div
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isInterviewer ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-xs ${
                    isInterviewer
                      ? 'bg-slate-900 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isInterviewer ? interviewer.name.charAt(0) : candidate.name.charAt(0)}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
                    <span className="font-semibold text-slate-700">
                      {isInterviewer ? interviewer.name : candidate.name}
                    </span>
                    <span>·</span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isInterviewer
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {isInterviewer && (
                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleSpeakMessage(msg.id, msg.text)}
                          title="Bu soruyu seslendir"
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          {speakingMessageId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* In-line Coach Whisper / Feedback */}
              {isInterviewer && msg.coachHint && (
                <div className="mt-2 ml-11 max-w-[85%] sm:max-w-[75%] p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 flex items-start gap-2 shadow-2xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-950 block mb-0.5">
                      Koç Fısıltısı (Anlık Analiz):
                    </span>
                    <span>{msg.coachHint}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-2 px-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>{interviewer.name} düşünüyor ve yanıt hazırlıyor...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Coach Hint Callout (if candidate requested hint) */}
      {hintPrompt && (
        <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start justify-between gap-2 shrink-0">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>{hintPrompt}</span>
          </div>
          <button
            onClick={() => setHintPrompt(null)}
            className="text-blue-400 hover:text-blue-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Speech recognition error message */}
      {speechError && (
        <div className="mb-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center justify-between">
          <span>{speechError}</span>
          <button onClick={() => setSpeechError(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Input Bar (Hybrid Voice + Text) */}
      <form onSubmit={handleSendMessage} className="shrink-0 space-y-2">
        <div className="relative flex items-center gap-2 bg-white border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-2xl p-2 shadow-xs transition-all">
          {/* Microphone Button */}
          <button
            type="button"
            onClick={handleToggleListening}
            title={isListening ? 'Mikrofonu Kapat' : 'Sesli Konuş (Mikrofon)'}
            className={`p-2.5 rounded-xl transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Dinleniyor... Konuştuğunuz Türkçe metin buraya dökülüyor...'
                : 'Yanıtınızı yazın veya mikrofona basarak konuşun...'
            }
            disabled={isSending}
            className="flex-1 px-2 py-1.5 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Input helper & Tips */}
        <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              {isListening ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                  Sesiniz kaydediliyor...
                </span>
              ) : (
                'Hibrit mod: Hem konuşabilir hem yazabilirsiniz'
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRequestHint}
            className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3 h-3" />
            Koçtan Cevap İpucu İste
          </button>
        </div>
      </form>
    </div>
  );
};

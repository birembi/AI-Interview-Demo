import React, { useState } from 'react';
import { SessionReport, CandidateProfile, InterviewerProfile } from '../types';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface EvaluationReportModalProps {
  report: SessionReport;
  candidate: CandidateProfile;
  interviewer: InterviewerProfile;
  onRestart: () => void;
  onBackToSimulation: () => void;
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({
  report,
  candidate,
  interviewer,
  onRestart,
  onBackToSimulation,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `
MÜLAKATAI DEĞERLENDİRME RAPORU
===================================
Aday: ${candidate.name} (${candidate.targetRole} - ${candidate.experienceLevel})
Okul/Geçmiş: ${candidate.universityOrSchool || 'Belirtilmedi'}
Mülakatçı: ${interviewer.name} (${interviewer.title} @ ${interviewer.company})

GENEL PUAN: ${report.overallScore} / 100

Kategori Puanları:
- Teknik Yetkinlik: ${report.categoryScores.technicalScore} / 100
- STAR Metodolojisi: ${report.categoryScores.starMethodScore} / 100
- İletişim & Diksiyon: ${report.categoryScores.communicationScore} / 100
- Proje & Etkinlik Hakimiyeti: ${report.categoryScores.projectMasteryScore} / 100

GÜÇLÜ YÖNLER:
${report.strengths.map((s) => `• ${s}`).join('\n')}

GELİŞİM ALANLARI:
${report.growthAreas.map((g) => `• ${g}`).join('\n')}

STAR ANALİZİ:
- Durum (Situation): ${report.starAnalysis.situation}
- Görev (Task): ${report.starAnalysis.task}
- Eylem (Action): ${report.starAnalysis.action}
- Sonuç (Result): ${report.starAnalysis.result}

ÖĞRENCİ & KARİYER TAVSİYESİ:
${report.studentOrCareerAdvice}

GENEL ÖZET:
${report.summary}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Card with Overall Score */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{candidate.name}</span>
              <span aria-hidden="true">·</span>
              <span>{candidate.targetRole}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600">{interviewer.name} Mülakatı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mülakat Başarı & Gelişim Raporu
            </h1>
            <p className="text-xs text-slate-500">
              STAR kriterleri ve teknik derinlik bazlı kapsamlı yetenek analizi
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              className={`w-24 h-24 rounded-2xl border flex flex-col items-center justify-center font-bold shadow-xs ${getScoreColor(
                report.overallScore
              )}`}
            >
              <span className="text-3xl sm:text-4xl font-mono tabular-nums leading-none">
                {report.overallScore}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider mt-1">
                / 100 Puan
              </span>
            </div>
          </div>
        </div>

        {/* 4 Category Sub-score bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-500 block truncate">Teknik Yetkinlik</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-slate-900">
                {report.categoryScores.technicalScore}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${report.categoryScores.technicalScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-500 block truncate">STAR Metodolojisi</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-slate-900">
                {report.categoryScores.starMethodScore}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${report.categoryScores.starMethodScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-500 block truncate">İletişim & Netlik</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-slate-900">
                {report.categoryScores.communicationScore}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${report.categoryScores.communicationScore}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-500 block truncate">Proje & Etkinlik</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-slate-900">
                {report.categoryScores.projectMasteryScore}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full"
                style={{ width: `${report.categoryScores.projectMasteryScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student / Career Specific Advice Banner */}
      {report.studentOrCareerAdvice && (
        <div className="p-5 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/80 rounded-2xl flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-900 block text-sm">
              🎓 Öğrenci & Kariyer Yol Haritası Tavsiyesi
            </span>
            <p className="leading-relaxed text-slate-700">
              {report.studentOrCareerAdvice}
            </p>
          </div>
        </div>
      )}

      {/* Strengths & Growth Areas Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Öne Çıkan Güçlü Yönler</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {report.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-slate-900">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Geliştirilmesi Gereken Alanlar</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {report.growthAreas.map((grw, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{grw}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* STAR Framework Analysis */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>STAR Metodolojisi Derinlemesine İnceleme</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="font-semibold text-slate-800 block">S - Durum (Situation)</span>
            <p className="text-slate-600 leading-relaxed">{report.starAnalysis.situation}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="font-semibold text-slate-800 block">T - Görev (Task)</span>
            <p className="text-slate-600 leading-relaxed">{report.starAnalysis.task}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="font-semibold text-slate-800 block">A - Eylem (Action)</span>
            <p className="text-slate-600 leading-relaxed">{report.starAnalysis.action}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <span className="font-semibold text-slate-800 block">R - Sonuç (Result)</span>
            <p className="text-slate-600 leading-relaxed">{report.starAnalysis.result}</p>
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
        <h3 className="text-sm font-bold text-slate-900">Genel Değerlendirme & Koç Notu</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {report.summary}
        </p>
      </div>

      {/* Bottom Bar Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Rapor Kopyalandı!' : 'Raporu Panoya Kopyala'}</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToSimulation}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            Simülasyona Dön
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Yeni Mülakat Başlat
          </button>
        </div>
      </div>
    </div>
  );
};
